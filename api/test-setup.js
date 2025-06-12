import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results = {
    environment: {},
    supabase: {},
    openai: {},
    database: {}
  };

  // Check environment variables
  results.environment = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY
  };

  // Test Supabase connection
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase
      .from('faq')
      .select('count')
      .limit(1);
    
    results.supabase = {
      connected: !error,
      error: error?.message
    };
  } catch (error) {
    results.supabase = {
      connected: false,
      error: error.message
    };
  }

  // Test OpenAI connection
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    await openai.models.list();
    results.openai = { connected: true };
  } catch (error) {
    results.openai = {
      connected: false,
      error: error.message
    };
  }

  // Test database function
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase.rpc('match_faq', {
      query_embedding: new Array(1536).fill(0.1),
      match_threshold: 0.6,
      match_count: 1
    });
    
    results.database = {
      function_exists: !error,
      error: error?.message
    };
  } catch (error) {
    results.database = {
      function_exists: false,
      error: error.message
    };
  }

  return res.status(200).json(results);
} 