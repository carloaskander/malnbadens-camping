import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Initialize clients with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, answer, id = null } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    // Generate embedding for the question
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Upsert FAQ entry
    const { data, error } = await supabase
      .from('faq')
      .upsert({
        ...(id && { id }), // Include ID if updating existing entry
        question: question.trim(),
        answer: answer.trim(),
        embedding,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      return res.status(500).json({ error: 'Failed to save FAQ entry' });
    }

    return res.status(200).json({
      success: true,
      data,
      message: id ? 'FAQ updated successfully' : 'FAQ created successfully'
    });

  } catch (error) {
    console.error('Embed FAQ error:', error);

    // Handle OpenAI API errors
    if (error.status === 429 || error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'OpenAI API quota exceeded. Please try again later.'
      });
    }

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
} 