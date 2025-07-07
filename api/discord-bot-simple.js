import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Simple Discord bot that just logs questions for manual processing
export default async function handler(req, res) {
  // Quick health check without database
  if (req.method === 'GET') {
    console.log('🏥 Health check requested');
    return res.status(200).json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
        hasVercelUrl: !!process.env.VERCEL_URL
      }
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📨 Simple Discord bot received request');
    console.log('📝 Raw request body:', req.body);
    console.log('📝 Request body type:', typeof req.body);
    console.log('📝 Request body keys:', req.body ? Object.keys(req.body) : 'No body');
    console.log('📝 Request headers:', req.headers);
    
    const startTime = Date.now();
    
    // Parse JSON if it's a string
    let parsedBody;
    if (typeof req.body === 'string') {
      try {
        parsedBody = JSON.parse(req.body);
        console.log('📝 Parsed body:', parsedBody);
      } catch (parseError) {
        console.log('❌ JSON parse error:', parseError.message);
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid JSON',
          details: parseError.message 
        });
      }
    } else {
      parsedBody = req.body;
    }
    
    // Validate request data
    if (!parsedBody || !parsedBody.id || !parsedBody.question) {
      console.log('❌ Invalid request data:', parsedBody);
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid request data - missing id or question' 
      });
    }
    
    const { id, question, bot_response, confidence, similarity, priority } = parsedBody;
    
    console.log(`📝 Processing question ID: ${id}`);
    console.log(`📝 Question: ${question.substring(0, 100)}...`);
    console.log(`📝 Priority: ${priority}`);
    
    // Check environment variables before database call
    console.log('🔍 Environment check:', {
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseUrlPrefix: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.substring(0, 20) + '...' : 'MISSING'
    });
    
    // Instead of connecting to Discord, just mark as processed
    // This prevents timeouts and allows manual Discord posting later
    console.log('⏰ Starting database update...');
    const { error } = await supabase
      .from('pending')
      .update({ 
        discord_message_id: `queued-${Date.now()}`,
        sent_to_discord: true 
      })
      .eq('id', id);
    
    console.log('⏰ Database update completed');
    
    if (error) {
      console.error('❌ Database update error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Database update failed',
        details: error.message 
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