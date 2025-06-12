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

// Rate limiting store (in-memory for now)
const rateLimitStore = new Map();

// Rate limit: 10 requests per 10 minutes per IP
const RATE_LIMIT = 10;
const RATE_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  const record = rateLimitStore.get(key);
  
  if (now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// Fallback FAQ for when API is down
const FALLBACK_FAQ = `
Här är vanliga frågor om Malnbadens Camping:

📞 **Kontakt**: 0650-132 60
📍 **Adress**: Malnvägen 34, 82456 Hudiksvall
🏕️ **Bokning**: Ring oss eller besök vår hemsida
🕐 **Öppettider**: Se vår öppettider-sida för aktuell information

För mer detaljerad information, vänligen kontakta oss direkt!
`;

async function searchFAQ(query) {
  try {
    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });
    
    const queryEmbedding = embeddingResponse.data[0].embedding;
    
    // Search for similar FAQs using cosine similarity
    const { data, error } = await supabase.rpc('match_faq', {
      query_embedding: queryEmbedding,
      match_threshold: 0.6,
      match_count: 3
    });
    
    if (error) {
      console.error('Supabase search error:', error);
      return { results: [], bestSimilarity: 0 };
    }
    
    const bestSimilarity = data.length > 0 ? data[0].similarity : 0;
    
    return {
      results: data,
      bestSimilarity
    };
  } catch (error) {
    console.error('Search FAQ error:', error);
    return { results: [], bestSimilarity: 0 };
  }
}

async function logPendingQuestion(question) {
  try {
    await supabase
      .from('pending')
      .insert([
        {
          question: question,
          created_at: new Date().toISOString()
        }
      ]);
  } catch (error) {
    console.error('Error logging pending question:', error);
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Get client IP for rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        error: 'För många förfrågningar. Försök igen om 10 minuter.',
        fallback: FALLBACK_FAQ
      });
    }
    
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Meddelande krävs' });
    }
    
    // Search for relevant FAQ entries
    const { results, bestSimilarity } = await searchFAQ(message.trim());
    
    // If we have a high-confidence match, return it directly
    if (bestSimilarity >= 0.82 && results.length > 0) {
      return res.status(200).json({
        response: results[0].answer,
        confidence: 'high',
        similarity: bestSimilarity
      });
    }
    
    // Log question as potentially unanswered
    await logPendingQuestion(message.trim());
    
    // Use GPT-4o-mini with context from search results
    const context = results.length > 0 
      ? results.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n')
      : 'Ingen relevant information hittad i kunskapsdatabasen.';
    
    const systemPrompt = `Du är en hjälpsam assistent för Malnbadens Camping i Hudiksvall, Sverige. 

INSTRUKTIONER:
- Svara ENDAST baserat på CONTEXT nedan
- Om CONTEXT inte innehåller relevant information, svara "Jag är osäker på det. Kontakta oss på 0650-132 60 för mer information."
- Håll svaren korta och hjälpsamma (max 2-3 meningar)
- Svara på svenska
- Var vänlig och professionell

CONTEXT:
${context}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.2,
      max_tokens: 300,
    });
    
    const response = completion.choices[0].message.content;
    
    return res.status(200).json({
      response,
      confidence: bestSimilarity >= 0.6 ? 'medium' : 'low',
      similarity: bestSimilarity
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    // If OpenAI quota exceeded or other API errors, return fallback
    if (error.status === 429 || error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: 'AI-tjänsten är tillfälligt otillgänglig',
        fallback: FALLBACK_FAQ
      });
    }
    
    return res.status(500).json({
      error: 'Ett fel uppstod. Försök igen senare.',
      fallback: FALLBACK_FAQ
    });
  }
} 