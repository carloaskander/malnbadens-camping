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

// Simple rate limiting store - no personal data
const sessionLimitStore = new Map();

// Basic rate limiting configuration
const RATE_LIMITS = {
  REQUESTS_PER_WINDOW: 10,
  WINDOW_DURATION: 10 * 60 * 1000, // 10 minutes
  BURST_REQUESTS: 5,
  BURST_WINDOW: 60 * 1000, // 1 minute
};

// Content filtering patterns - Only block clearly inappropriate content
const SUSPICIOUS_PATTERNS = [
  /(.)\1{15,}/, // Very long repeated characters (15+)
  /^[^a-zA-ZåäöÅÄÖ\s]*$/, // Only symbols/numbers, no letters or spaces
  
  // Enhanced profanity detection (Swedish + English)
  /fuck|shit|damn|bitch|ass|hell|crap/i,
  /fan|skit|helvete|jävla|kuk|fitta|hora/i,
  
  // Clear nonsense/spam
  /qwerty|asdf|zxcv/i, // Keyboard mashing
  /^(a{5,}|b{5,}|c{5,}|hej{3,}|hello{3,})$/i, // Excessive repetition
];

function getSessionId() {
  // Generate random session ID - no personal data
  return Math.random().toString(36).substring(2, 15);
}

function checkRateLimit(message) {
  const now = Date.now();
  
  // Simple session-based rate limiting
  const sessionId = 'anonymous'; // All users share same basic limits
  
  // Initialize or get rate limit data
  if (!sessionLimitStore.has(sessionId)) {
    sessionLimitStore.set(sessionId, {
      requests: [],
      recentMessages: []
    });
  }
  
  const sessionData = sessionLimitStore.get(sessionId);
  
  // Clean old requests
  sessionData.requests = sessionData.requests.filter(time => now - time < RATE_LIMITS.WINDOW_DURATION);
  
  // Check main rate limit
  if (sessionData.requests.length >= RATE_LIMITS.REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded'
    };
  }
  
  // Check burst protection
  const recentRequests = sessionData.requests.filter(time => now - time < RATE_LIMITS.BURST_WINDOW);
  if (recentRequests.length >= RATE_LIMITS.BURST_REQUESTS) {
    return {
      allowed: false,
      reason: 'Too many requests in short time'
    };
  }
  
  // Check message length
  if (message.length < 2 || message.length > 500) {
    return {
      allowed: false,
      reason: 'Invalid message format'
    };
  }
  
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(message)) {
      return {
        allowed: false,
        reason: 'Message contains suspicious content'
      };
    }
  }
  
  // Check for repeated identical messages
  sessionData.recentMessages = sessionData.recentMessages.filter(
    msg => now - msg.timestamp < 5 * 60 * 1000 // Keep last 5 minutes
  );
  
  const identicalCount = sessionData.recentMessages.filter(
    msg => msg.text.toLowerCase() === message.toLowerCase()
  ).length;
  
  if (identicalCount >= 2) {
    return {
      allowed: false,
      reason: 'Too many identical messages'
    };
  }
  
  // Update counters
  sessionData.requests.push(now);
  sessionData.recentMessages.push({
    text: message,
    timestamp: now
  });
  
  return { allowed: true };
}

// Fallback FAQ for when API is down
const FALLBACK_FAQ = `
Hej! Jag är Campy Bot och är tillfälligt otillgänglig, men här är grundläggande information om Malnbadens Camping:

📍 **Plats**: Malnvägen 34, Hudiksvall - vacker naturmiljö vid vattnet
🏕️ **Bokning**: Besök vår hemsida för aktuella priser och tillgänglighet
🕐 **Information**: Kolla hemsidan för öppettider och alla aktiviteter
🌲 **Aktiviteter**: Simning, fiske, vandring och mycket mer

Besök vår hemsida för komplett information och bokning!
`;

async function searchFAQ(query) {
  try {
    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: query,
    });
    
    const queryEmbedding = embeddingResponse.data[0].embedding;
    
    // First, do a quick search to determine best similarity
    const { data: quickData, error: quickError } = await supabase.rpc('match_faq', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 1
    });
    
    if (quickError) {
      console.error('Supabase quick search error:', quickError);
      return { results: [], bestSimilarity: 0 };
    }
    
    const bestSimilarity = quickData.length > 0 ? quickData[0].similarity : 0;
    
    // Dynamic k based on similarity - lower similarity needs more context
    let matchCount;
    let threshold;
    
    if (bestSimilarity < 0.6) {
      // Low similarity - cast a wider net
      matchCount = 10;
      threshold = 0.4;
      console.log(`🔍 Low similarity (${bestSimilarity.toFixed(3)}), using wide search: k=${matchCount}`);
    } else if (bestSimilarity < 0.75) {
      // Medium similarity - moderate search
      matchCount = 6;
      threshold = 0.5;
      console.log(`🎯 Medium similarity (${bestSimilarity.toFixed(3)}), using moderate search: k=${matchCount}`);
    } else {
      // High similarity - focused search
      matchCount = 4;
      threshold = 0.6;
      console.log(`✅ High similarity (${bestSimilarity.toFixed(3)}), using focused search: k=${matchCount}`);
    }
    
    // Now do the full search with dynamic parameters
    const { data, error } = await supabase.rpc('match_faq', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: matchCount
    });
    
    if (error) {
      console.error('Supabase search error:', error);
      return { results: [], bestSimilarity: 0 };
    }
    
    console.log(`📊 Retrieved ${data.length} FAQ chunks for context`);
    
    return {
      results: data,
      bestSimilarity
    };
  } catch (error) {
    console.error('Search FAQ error:', error);
    return { results: [], bestSimilarity: 0 };
  }
}

async function logPendingQuestion(question, botResponse, confidence, similarity, priority = 'medium') {
  try {
    console.log(`🔄 Attempting to log ${priority} priority pending question:`, question);
    const result = await supabase
      .from('pending')
      .insert([
        {
          question: question,
          bot_response: botResponse,
          confidence: confidence,
          similarity: similarity,
          priority: priority
        }
      ]);
    
    if (result.error) {
      console.error('❌ Supabase insertion failed:', result.error);
    } else {
      console.log('✅ Successfully logged pending question with bot response');
    }
  } catch (error) {
    console.error('❌ Error logging pending question:', error);
  }
}

export default async function handler(req, res) {
  // Set CORS headers to allow requests from localhost during development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message } = req.body;
    
    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Meddelande krävs' });
    }
    
    const trimmedMessage = message.trim();
    
    // Check rate limits and abuse protection
    const rateLimitResult = checkRateLimit(trimmedMessage);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({ 
        error: 'Hoppsan! Du har skickat många meddelanden nyligen. Vila lite och försök igen om en stund. 😊',
        fallback: FALLBACK_FAQ,
        reason: rateLimitResult.reason
      });
    }
    
    // Search for relevant FAQ entries
    const { results, bestSimilarity } = await searchFAQ(trimmedMessage);
    
    // Replace the direct response logic with multilingual support
    if (bestSimilarity >= 0.75 && results.length > 0) {
      // For high-confidence matches, use AI to translate the answer to user's language
      const directAnswerPrompt = `Du är Campy Bot, en hjälpsam AI-assistent för Malnbadens Camping. Du har hittat det perfekta svaret på användarens fråga.

INSTRUKTIONER:
- Svara på samma språk som användaren frågade på
- Använd den exakta informationen från FAQ-svaret nedan
- Håll samma ton och stil som FAQ-svaret
- Lägg INTE till extra information eller telefonnummer

FAQ SVAR:
${results[0].answer}

ANVÄNDARENS FRÅGA: ${trimmedMessage}

Ge det exakta svaret på användarens språk:`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: directAnswerPrompt }
        ],
        temperature: 0.1,
        max_tokens: 200,
      });

      return res.status(200).json({
        response: completion.choices[0].message.content,
        confidence: 'high',
        similarity: bestSimilarity
      });
    }
    
    // Use GPT-4o-mini with context from search results
    const context = results.length > 0 
      ? results.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n')
      : 'Ingen relevant information hittad i kunskapsdatabasen.';
    
    const systemPrompt = `Du är Campy Bot, en hjälpsam AI-assistent för Malnbadens Camping i Hudiksvall, Sverige. Du är här för att hjälpa besökare med information om campingen.

🚨 VIKTIGT - SPRÅK: Svara ALLTID på samma språk som användaren frågade på. Om användaren frågar på engelska, svara på engelska. Om på tyska, svara på tyska. Använd exakt samma språk som frågan är skriven på!

INSTRUKTIONER:
- Använd CONTEXT nedan som primär informationskälla
- Om CONTEXT inte har exakt information, försök hjälpa baserat på allmän camping-kunskap
- För specifika detaljer som priser, bokningar eller aktuella öppettider, ge specifika sidor (t.ex. /sv/accommodation/camping för campingpriser)
- Var vänlig, naturlig och hjälpsam - prata som en riktig person
- Håll svaren korta men informativa (2-4 meningar)
- SVARA PÅ SAMMA SPRÅK SOM ANVÄNDAREN FRÅGADE PÅ
- Undvik att ge telefonnummer - hänvisa till hemsidan istället

CAMPING-RELATERADE ÄMNEN (försök alltid hjälpa med dessa):
- Boende: stugor, hostel, campingplatser, faciliteter
- Aktiviteter: simning, fiske, vandring, cykling, klättring, äventyr, sport
- Barn & familj: lekplatser, barnaktiviteter, familjeaktiviteter
- Praktiskt: parkering, mat, shopping, transport, väder, säkerhet
- Område: Hudiksvall, närliggande attraktioner, natur, stränder
- Säsong: öppettider, bokningar, priser, tillgänglighet

HEMSIDANS SIDOR - Ge alltid specifika URL:er när det är relevant:
- Startsida: / (dirigerar automatiskt till rätt språk)
- Campingpriser & bokning: /accommodation/camping (lägg till efter hemsidans URL)
- Stugpriser & bokning: /accommodation/cottages (lägg till efter hemsidans URL)
- Vandrarhemsspriser & bokning: /accommodation/hostel (lägg till efter hemsidans URL)
- Aktiviteter & saker att göra: /activities (lägg till efter hemsidans URL)
- Restauranginformation: /restaurant (lägg till efter hemsidans URL)
- Öppettider: /opening-hours (lägg till efter hemsidans URL)
- Hemsidan hanterar språkval automatiskt
- Kontaktinformation finns på de flesta sidor

INNEHÅLLSFILTRERING (endast för helt irrelevanta frågor):
- Om frågan handlar om helt andra ämnen (politik, sport, teknik, skola som inte rör camping), svara: "Jag är Campy Bot och hjälper med frågor om Malnbadens Camping. Har du några frågor om vår camping?"
- Vid olämpligt innehåll, svara professionellt: "Jag kan bara hjälpa med frågor om campingen. Vad kan jag berätta om våra faciliteter?"
- När du är osäker om något är camping-relaterat, försök ändå hjälpa genom att koppla det till camping

🚨 PÅMINNELSE: Matcha språket i användarens fråga exakt. Engelska fråga = engelskt svar. Tyskt fråga = tyskt svar.

CONTEXT:
${context}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: trimmedMessage }
      ],
      temperature: 0.2,
      max_tokens: 300,
    });
    
    const response = completion.choices[0].message.content;
    // Confidence ranges: High (0.75+), Medium (0.55-0.74), Low (<0.55)
    const confidence = bestSimilarity >= 0.55 ? 'medium' : 'low';
    
    // Log question with bot response for learning
    // Only log medium and low confidence for review
    if (bestSimilarity < 0.75) {
      const priority = bestSimilarity < 0.5 ? 'high' : 'medium';
      await logPendingQuestion(trimmedMessage, response, confidence, bestSimilarity, priority);
      
      // Trigger Discord notification for high priority questions
      if (priority === 'high') {
        try {
          const baseUrl = process.env.VERCEL_URL?.startsWith('http') 
            ? process.env.VERCEL_URL 
            : `https://${process.env.VERCEL_URL}`;
          const discordUrl = `${baseUrl}/api/discord-bot`;
          console.log('🔍 Triggering Discord bot at:', discordUrl);
          await fetch(discordUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          console.error('❌ Error triggering Discord bot:', error);
        }
      }
    }
    
    return res.status(200).json({
      response,
      confidence: confidence,
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