import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ] 
});

// Configuration
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const HIGH_PRIORITY_CHANNEL = 'high-priority-questions';
const MEDIUM_PRIORITY_CHANNEL = 'medium-priority-questions';

// Bot ready event
client.once('ready', async () => {
  console.log(`✅ Discord bot logged in as ${client.user.tag}`);
  
  // Ensure channels exist
  await ensureChannelsExist();
});

// Ensure channels exist
async function ensureChannelsExist() {
  try {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
      console.error('❌ Guild not found');
      return;
    }

    // Check if channels exist, create if they don't
    let highPriorityChannel = guild.channels.cache.find(channel => channel.name === HIGH_PRIORITY_CHANNEL);
    let mediumPriorityChannel = guild.channels.cache.find(channel => channel.name === MEDIUM_PRIORITY_CHANNEL);

    if (!highPriorityChannel) {
      highPriorityChannel = await guild.channels.create({
        name: HIGH_PRIORITY_CHANNEL,
        type: ChannelType.GuildText,
        topic: '🚨 High priority camping questions that need immediate attention'
      });
      console.log(`✅ Created ${HIGH_PRIORITY_CHANNEL} channel`);
    }

    if (!mediumPriorityChannel) {
      mediumPriorityChannel = await guild.channels.create({
        name: MEDIUM_PRIORITY_CHANNEL,
        type: ChannelType.GuildText,
        topic: '⚠️ Medium priority camping questions'
      });
      console.log(`✅ Created ${MEDIUM_PRIORITY_CHANNEL} channel`);
    }
  } catch (error) {
    console.error('❌ Error creating channels:', error);
  }
}

// Send pending question to Discord
async function sendPendingQuestion(question) {
  try {
    const guild = client.guilds.cache.get(GUILD_ID);
    const channelName = question.priority === 'high' ? HIGH_PRIORITY_CHANNEL : MEDIUM_PRIORITY_CHANNEL;
    const channel = guild.channels.cache.find(ch => ch.name === channelName);
    
    if (!channel) {
      console.error(`❌ Channel ${channelName} not found`);
      return;
    }

    const embed = {
      color: question.priority === 'high' ? 0xFF0000 : 0xFFA500, // Red for high, orange for medium
      title: `🏕️ ${question.priority.toUpperCase()} PRIORITY`,
      fields: [
        { 
          name: '❓ Question (Copy This)', 
          value: `\`\`\`\n${question.question}\n\`\`\``,
          inline: false
        },
        { 
          name: '🤖 Bot Response', 
          value: question.bot_response.length > 1000 ? 
            question.bot_response.substring(0, 1000) + '...' : 
            question.bot_response,
          inline: false
        },
        { 
          name: '📊 Stats', 
          value: `**Confidence:** ${question.confidence}\n**Similarity:** ${question.similarity.toFixed(3)}\n**Created:** ${new Date(question.created_at).toLocaleString()}`,
          inline: false
        }
      ],
      timestamp: new Date(),
      footer: { text: 'Reply to this message to add your answer to FAQ' }
    };

    const message = await channel.send({ embeds: [embed] });
    
    // Store Discord message ID with the pending question
    await supabase
      .from('pending')
      .update({ discord_message_id: message.id })
      .eq('id', question.id);

    console.log(`✅ Sent ${question.priority} priority question to Discord`);
    return message;
  } catch (error) {
    if (error.code === 50013) {
      console.error('❌ Discord: Missing permissions');
    } else if (error.code === 429) {
      console.error('❌ Discord: Rate limited!', {
        retryAfter: error.retryAfter,
        limit: error.limit,
        remaining: error.remaining
      });
    } else {
      console.error('❌ Error sending question to Discord:', error);
    }
  }
}

// Handle replies to add to FAQ
client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check if this is a reply to a bot message
  if (message.reference) {
    try {
      const repliedToMessage = await message.channel.messages.fetch(message.reference.messageId);
      
      // Check if the replied-to message is from our bot and has embeds
      if (repliedToMessage.author.id === client.user.id && repliedToMessage.embeds.length > 0) {
        await handleFAQReply(message, repliedToMessage);
      }
    } catch (error) {
      console.error('❌ Error handling reply:', error);
    }
  }
});

// Handle FAQ reply
async function handleFAQReply(replyMessage, originalMessage) {
  try {
    // Extract question from the embed
    const embed = originalMessage.embeds[0];
    const questionField = embed.fields.find(field => field.name.includes('Question'));
    
    if (!questionField) {
      await replyMessage.react('❌');
      return;
    }

    // Extract the question from the code block
    const question = questionField.value.replace(/```\n?/g, '').trim();
    const answer = replyMessage.content.trim();

    if (!answer) {
      await replyMessage.react('❌');
      return;
    }

    // Generate embedding for the answer
    console.log('🔄 Generating embedding for FAQ answer...');
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: answer,
    });

    // Add to FAQ database
    const { data, error } = await supabase
      .from('faq')
      .insert([
        {
          question: question,
          answer: answer,
          embedding: embeddingResponse.data[0].embedding,
          created_by: 'discord_admin'
        }
      ])
      .select();

    if (error) {
      console.error('❌ Error adding to FAQ:', error);
      await replyMessage.react('❌');
      return;
    }

    // Success! React with checkmark
    await replyMessage.react('✅');
    
    // Find and mark the original pending question as resolved
    const { error: updateError } = await supabase
      .from('pending')
      .update({ resolved: true, resolved_at: new Date().toISOString() })
      .eq('discord_message_id', originalMessage.id);

    if (updateError) {
      console.error('❌ Error updating pending question:', updateError);
    }

    console.log('✅ Successfully added answer to FAQ database');
    
  } catch (error) {
    console.error('❌ Error in handleFAQReply:', error);
    await replyMessage.react('❌');
  }
}

// Check for new pending questions with retry logic
async function checkPendingQuestionsWithRetry() {
  let retries = 2; // Reduced from 3 to 2 since we now process all questions at once
  while (retries > 0) {
    const found = await checkPendingQuestions();
    if (found > 0) {
      console.log(`✅ Processed ${found} pending questions`);
      return found; // Return the count of processed questions
    }
    retries--;
    if (retries > 0) {
      console.log(`🔄 No questions found, retrying in 1 second... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced delay from 2s to 1s
    }
  }
  console.log('📋 No pending questions found after retries');
  return 0;
}

// Check for new pending questions
async function checkPendingQuestions() {
  try {
    console.log('🔍 Checking for pending questions...');
    
    // First, check ALL pending questions
    const { data: allPending, error: allError } = await supabase
      .from('pending')
      .select('id, question, sent_to_discord, priority, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (!allError && allPending) {
      console.log('📊 Recent pending questions:', allPending.map(q => ({
        id: q.id,
        question: q.question.substring(0, 30) + '...',
        sent_to_discord: q.sent_to_discord,
        priority: q.priority,
        created_at: q.created_at
      })));
    }
    
    // Now check specifically for unsent ones - PROCESS ALL PENDING QUESTIONS
    const { data: pendingQuestions, error } = await supabase
      .from('pending')
      .select('*')
      .eq('sent_to_discord', false)
      .order('priority', { ascending: false }) // High priority first
      .order('created_at', { ascending: true }); // Oldest first within same priority
      // REMOVED .limit(1) - now processes ALL pending questions

    if (error) {
      console.error('❌ Error fetching pending questions:', error);
      return;
    }

    console.log(`📋 Found ${pendingQuestions?.length || 0} pending questions to send`);
    
    if (pendingQuestions && pendingQuestions.length > 0) {
      console.log('📋 Questions:', pendingQuestions.map(q => ({ id: q.id, question: q.question.substring(0, 50) + '...', priority: q.priority })));
      
      // Process all questions in sequence
      for (const question of pendingQuestions) {
        console.log(`🔄 Processing question ${question.id}: ${question.question.substring(0, 50)}...`);
        
        // First, mark as sent to Discord IMMEDIATELY to prevent other instances from picking it up
        const { error: markError } = await supabase
          .from('pending')
          .update({ sent_to_discord: true })
          .eq('id', question.id);
        
        if (markError) {
          console.error('❌ Error marking question as sent (skipping):', markError);
          continue; // Skip this question to avoid duplicates
        }
        
        // Then send to Discord
        try {
          await sendPendingQuestion(question);
          console.log(`✅ Successfully sent question ${question.id} to Discord`);
        } catch (sendError) {
          console.error(`❌ Error sending question ${question.id} to Discord:`, sendError);
          
          // If sending failed, mark as not sent so it can be retried
          await supabase
            .from('pending')
            .update({ sent_to_discord: false })
            .eq('id', question.id);
        }
        
        // Small delay to avoid Discord rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
      console.log('📋 No pending questions found');
    }
    
    return pendingQuestions?.length || 0;
  } catch (error) {
    console.error('❌ Error checking pending questions:', error);
    return 0;
  }
}

// Process a single question by ID
async function processSingleQuestion(questionId) {
  try {
    console.log(`🔍 Processing single question: ${questionId}`);
    
    // Get the specific question
    const { data: question, error } = await supabase
      .from('pending')
      .select('*')
      .eq('id', questionId)
      .eq('sent_to_discord', false)
      .single();
    
    if (error) {
      console.error('❌ Error fetching question:', error);
      return { success: false, error: error.message };
    }
    
    if (!question) {
      console.log('📋 Question not found or already processed');
      return { success: true, message: 'Question not found or already processed' };
    }
    
    console.log(`📝 Found question: ${question.question.substring(0, 50)}... (Priority: ${question.priority})`);
    
    // Mark as sent immediately to prevent duplicates
    const { error: markError } = await supabase
      .from('pending')
      .update({ sent_to_discord: true })
      .eq('id', questionId);
    
    if (markError) {
      console.error('❌ Error marking question as sent:', markError);
      return { success: false, error: markError.message };
    }
    
    // Send to Discord
    await sendPendingQuestion(question);
    console.log(`✅ Successfully sent question ${questionId} to Discord`);
    
    return { success: true, message: 'Question processed successfully', questionId };
    
  } catch (error) {
    console.error(`❌ Error processing question ${questionId}:`, error);
    
    // If something went wrong, mark as not sent so it can be retried
    await supabase
      .from('pending')
      .update({ sent_to_discord: false })
      .eq('id', questionId);
    
    return { success: false, error: error.message };
  }
}

// API endpoint handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('🚀 Discord bot handler called');
      
      // If bot is not ready, start it
      if (!client.isReady()) {
        console.log('🔄 Bot not ready, logging in...');
        await client.login(process.env.DISCORD_BOT_TOKEN);
        // Wait a bit for the bot to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ Bot logged in and ready');
      } else {
        console.log('✅ Bot already ready');
      }

      const startTime = Date.now();
      let result;
      
      // Check if we have a specific question ID (from webhook)
      if (req.body && req.body.record && req.body.record.id) {
        console.log('📨 Webhook triggered for specific question');
        result = await processSingleQuestion(req.body.record.id);
      } else if (req.body && req.body.questionId) {
        console.log('📨 Manual trigger for specific question');
        result = await processSingleQuestion(req.body.questionId);
      } else {
        console.log('📨 Processing all pending questions (fallback)');
        const questionsProcessed = await checkPendingQuestionsWithRetry();
        result = { 
          success: true, 
          message: questionsProcessed > 0 ? `Processed ${questionsProcessed} pending questions` : 'No pending questions found',
          questionsProcessed 
        };
      }
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Discord bot execution took ${duration}ms`);
      
      return res.status(200).json({ 
        ...result,
        duration 
      });
      
    } catch (error) {
      console.error('❌ Discord bot error:', error);
      return res.status(500).json({ error: 'Discord bot error', details: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Start the bot if running directly
if (process.env.NODE_ENV !== 'production') {
  client.login(process.env.DISCORD_BOT_TOKEN);
  
  // Check for pending questions every 5 minutes
  setInterval(checkPendingQuestions, 5 * 60 * 1000);
} 