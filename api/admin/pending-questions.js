import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Simple admin authentication (you should implement proper auth)
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'your-secure-admin-key';

export default async function handler(req, res) {
  // Check admin authentication
  const apiKey = req.headers['x-admin-key'] || req.query.key;
  if (apiKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return await getPendingQuestions(req, res);
  } else if (req.method === 'POST') {
    return await updateQuestionStatus(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getPendingQuestions(req, res) {
  try {
    const { status = 'pending', limit = 50, offset = 0 } = req.query;
    
    // Get pending questions with pagination
    const { data: questions, error } = await supabase
      .from('pending')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      console.error('Error fetching pending questions:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Get summary statistics
    const { data: summary, error: summaryError } = await supabase
      .from('pending_questions_summary')
      .select('*')
      .limit(7); // Last 7 days
    
    if (summaryError) {
      console.error('Error fetching summary:', summaryError);
    }
    
    return res.status(200).json({
      questions,
      summary: summary || [],
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        hasMore: questions.length === parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error in getPendingQuestions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateQuestionStatus(req, res) {
  try {
    const { id, status, admin_notes } = req.body;
    
    if (!id || !status) {
      return res.status(400).json({ error: 'ID and status are required' });
    }
    
    if (!['pending', 'reviewed', 'added_to_faq', 'ignored'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const { data, error } = await supabase
      .from('pending')
      .update({ 
        status, 
        admin_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating question status:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    
    return res.status(200).json({ 
      message: 'Status updated successfully',
      question: data[0]
    });
    
  } catch (error) {
    console.error('Error in updateQuestionStatus:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 