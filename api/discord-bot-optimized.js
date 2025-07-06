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

// Global Discord client (reused across function calls)
let client;
let isConnecting = false;
let lastConnectionTime = 0;
const CONNECTION_TIMEOUT = 30000; // 30 seconds

// Configuration
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const HIGH_PRIORITY_CHANNEL = 'high-priority-questions';
const MEDIUM_PRIORITY_CHANNEL = 'medium-priority-questions';

// Initialize Discord client
function initializeClient() {
  if (client) return client;
  
  client = new Client({ 
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ] 
  });

  client.once('ready', async () => {
    console.log(`✅ Discord bot logged in as ${client.user.tag}`);
    lastConnectionTime = Date.now();
    
    // Only ensure channels exist on first connection (not every time)
    if (!client.channelsChecked) {
      await ensureChannelsExist();
      client.channelsChecked = true;
    }
  });

  client.on('error', (error) => {
    console.error('❌ Discord client error:', error);
  });

  return client;
}

// Fast Discord connection with timeout
async function connectToDiscord() {
  if (isConnecting) {
    console.log('⏳ Already connecting to Discord, waiting...');
    // Wait for existing connection attempt
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return client.isReady();
  }

  if (client && client.isReady()) {
    // Check if connection is still fresh (within 30 seconds)
    if (Date.now() - lastConnectionTime < CONNECTION_TIMEOUT) {
      console.log('✅ Discord bot already connected and fresh');
      return true;
    }
  }

  try {
    isConnecting = true;
    console.log('🔄 Connecting to Discord...');
    
    if (!client) {
      client = initializeClient();
    }

    // Set connection timeout
    const connectionPromise = client.login(process.env.DISCORD_BOT_TOKEN);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Discord connection timeout')), 15000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);

    // Wait for ready state (but not too long)
    let attempts = 0;
    while (!client.isReady() && attempts < 50) { // 5 seconds max
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!client.isReady()) {
      throw new Error('Discord bot failed to become ready');
    }

    console.log('✅ Discord bot connected successfully');
    return true;

  } catch (error) {
    console.error('❌ Discord connection failed:', error);
    return false;
  } finally {
    isConnecting = false;
  }
}

// Ensure channels exist (optimized - only runs once)
async function ensureChannelsExist() {
  try {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
      console.error('❌ Guild not found');
      return;
    }

    // Check if channels exist, create if they don't
    const channels = guild.channels.cache;
    const highPriorityChannel = channels.find(ch => ch.name === HIGH_PRIORITY_CHANNEL);
    const mediumPriorityChannel = channels.find(ch => ch.name === MEDIUM_PRIORITY_CHANNEL);

    const channelPromises = [];

    if (!highPriorityChannel) {
      channelPromises.push(
        guild.channels.create({
          name: HIGH_PRIORITY_CHANNEL,
          type: ChannelType.GuildText,
          topic: '🚨 High priority camping questions that need immediate attention'
        })
      );
    }

    if (!mediumPriorityChannel) {
      channelPromises.push(
        guild.channels.create({
          name: MEDIUM_PRIORITY_CHANNEL,
          type: ChannelType.GuildText,
          topic: '⚠️ Medium priority camping questions'
        })
      );
    }

    // Create channels in parallel
    if (channelPromises.length > 0) {
      await Promise.all(channelPromises);
      console.log(`✅ Created ${channelPromises.length} missing channels`);
    }

  } catch (error) {
    console.error('❌ Error checking channels:', error);
  }
}

// Optimized send function
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
      color: question.priority === 'high' ? 0xFF0000 : 0xFFA500,
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
    
    // Store Discord message ID
    await supabase
      .from('pending')
      .update({ discord_message_id: message.id })
      .eq('id', question.id);

    console.log(`✅ Sent ${question.priority} priority question to Discord`);
    return message;

  } catch (error) {
    console.error('❌ Error sending question to Discord:', error);
    throw error;
  }
}

// Optimized processing function
async function processSingleQuestion(questionId) {
  try {
    console.log(`🔍 Processing question: ${questionId}`);
    
    // Get the specific question with minimal query
    const { data: question, error } = await supabase
      .from('pending')
      .select('*')
      .eq('id', questionId)
      .single();
    
    if (error || !question) {
      console.error('❌ Question not found:', error);
      return { success: false, error: 'Question not found' };
    }
    
    // Check if already processed
    if (question.sent_to_discord) {
      console.log('📋 Question already processed, skipping');
      return { success: true, message: 'Question already processed' };
    }
    
    console.log(`📝 Processing: ${question.question.substring(0, 50)}...`);
    
    // Mark as sent first (prevent duplicates)
    await supabase
      .from('pending')
      .update({ sent_to_discord: true })
      .eq('id', questionId);
    
    // Send to Discord
    await sendPendingQuestion(question);
    
    return { success: true, message: 'Question processed successfully', questionId };
    
  } catch (error) {
    console.error(`❌ Error processing question ${questionId}:`, error);
    
    // Revert sent status on error
    await supabase
      .from('pending')
      .update({ sent_to_discord: false })
      .eq('id', questionId);
    
    return { success: false, error: error.message };
  }
}

// Process using webhook data directly (NEW APPROACH)
async function processWebhookData(webhookData) {
  try {
    const { record } = webhookData;
    console.log(`🔍 Processing webhook data: ${record.question.substring(0, 50)}...`);
    
    // Use webhook data directly instead of re-fetching from database
    const question = {
      id: record.id,
      question: record.question,
      bot_response: record.bot_response,
      confidence: record.confidence,
      similarity: record.similarity,
      priority: record.priority,
      created_at: new Date().toISOString()
    };
    
    // Send to Discord using webhook data
    await sendPendingQuestion(question);
    
    // Update database to mark as sent (optional - for audit trail)
    await supabase
      .from('pending')
      .update({ discord_message_id: 'webhook-processed' })
      .eq('id', record.id);
    
    return { success: true, message: 'Webhook data processed successfully', questionId: record.id };
    
  } catch (error) {
    console.error('❌ Error processing webhook data:', error);
    return { success: false, error: error.message };
  }
}

// API endpoint handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Optimized Discord bot handler called');
    const startTime = Date.now();
    
    // Fast Discord connection
    const connected = await connectToDiscord();
    if (!connected) {
      return res.status(500).json({ error: 'Failed to connect to Discord' });
    }
    
    let result;
    
    // Use webhook data directly if available (NEW APPROACH)
    if (req.body && req.body.record) {
      console.log('📨 Processing webhook data directly');
      result = await processWebhookData(req.body);
    } else if (req.body && req.body.questionId) {
      console.log('📨 Processing specific question ID');
      result = await processSingleQuestion(req.body.questionId);
    } else {
      console.log('📨 No valid request data');
      result = { success: false, error: 'No valid request data' };
    }
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ Optimized Discord bot execution took ${duration}ms`);
    
    return res.status(200).json({ 
      ...result,
      duration 
    });
    
  } catch (error) {
    console.error('❌ Discord bot error:', error);
    return res.status(500).json({ error: 'Discord bot error', details: error.message });
  }
} 