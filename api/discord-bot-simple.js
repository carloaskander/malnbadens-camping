import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Simple Discord bot that just logs questions for manual processing
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📨 Simple Discord bot received request');
    const startTime = Date.now();
    
    // Validate request data
    if (!req.body || !req.body.id || !req.body.question) {
      console.log('❌ Invalid request data:', req.body);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request data - missing id or question' 
      });
    }
    
    const { id, question, bot_response, confidence, similarity, priority } = req.body;
    
    console.log(`📝 Processing question ID: ${id}`);
    console.log(`📝 Question: ${question.substring(0, 100)}...`);
    console.log(`📝 Priority: ${priority}`);
    
    // Instead of connecting to Discord, just mark as processed
    // This prevents timeouts and allows manual Discord posting later
    const { error } = await supabase
      .from('pending')
      .update({ 
        discord_message_id: `queued-${Date.now()}`,
        sent_to_discord: true 
      })
      .eq('id', id);
    
    if (error) {
      console.error('❌ Database update error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Database update failed' 
      });
    }
    
    // Log for manual Discord posting
    console.log('🎯 HIGH PRIORITY QUESTION FOR MANUAL DISCORD POSTING:');
    console.log('=====================================');
    console.log(`📝 ID: ${id}`);
    console.log(`❓ Question: ${question}`);
    console.log(`🤖 Bot Response: ${bot_response}`);
    console.log(`📊 Confidence: ${confidence}`);
    console.log(`📊 Similarity: ${similarity}`);
    console.log(`⚡ Priority: ${priority}`);
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
    console.log('=====================================');
    
    const duration = Date.now() - startTime;
    console.log(`✅ Question processed in ${duration}ms`);
    
    return res.status(200).json({
      success: true,
      message: 'Question queued for Discord posting',
      questionId: id,
      duration,
      note: 'Question marked as processed but needs manual Discord posting'
    });
    
  } catch (error) {
    console.error('❌ Simple Discord bot error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Simple Discord bot error', 
      details: error.message 
    });
  }
} 