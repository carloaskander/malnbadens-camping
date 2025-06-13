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

// Enhanced rate limiting store with multiple protection layers
const rateLimitStore = new Map();
const suspiciousActivityStore = new Map();

// Rate limiting configuration
const RATE_LIMITS = {
  // Basic rate limit: 10 requests per 10 minutes per IP
  REQUESTS_PER_WINDOW: 10,
  WINDOW_DURATION: 10 * 60 * 1000, // 10 minutes
  
  // Burst protection: max 3 requests per minute
  BURST_REQUESTS: 3,
  BURST_WINDOW: 60 * 1000, // 1 minute
  
  // Daily limit per IP
  DAILY_LIMIT: 50,
  DAILY_WINDOW: 24 * 60 * 60 * 1000, // 24 hours
  
  // Suspicious activity thresholds
  MAX_IDENTICAL_MESSAGES: 3, // Same message repeated
  MAX_RAPID_FIRE: 5, // Too many requests in short time
  MIN_MESSAGE_LENGTH: 2,
  MAX_MESSAGE_LENGTH: 500,
  
  // Cooldown periods
  ABUSE_COOLDOWN: 30 * 60 * 1000, // 30 minutes for abuse
  SUSPICIOUS_COOLDOWN: 5 * 60 * 1000 // 5 minutes for suspicious activity
};

// Content filtering patterns
const SUSPICIOUS_PATTERNS = [
  /test\s*test/i,
  /spam/i,
  /(.)\1{10,}/, // Repeated characters
  /^[^a-zA-ZåäöÅÄÖ]*$/, // No letters (only symbols/numbers)
  /fuck|shit|damn/i, // Basic profanity (add more as needed)
];

function getClientIdentifier(req) {
  // Use multiple identifiers for better tracking
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
            req.headers['x-real-ip'] || 
            req.connection.remoteAddress || 
            'unknown';
  
  const userAgent = req.headers['user-agent'] || 'unknown';
  const fingerprint = `${ip}_${userAgent.substring(0, 50)}`;
  
  return { ip, fingerprint };
}

function checkRateLimit(identifier, message) {
  const now = Date.now();
  const { ip, fingerprint } = identifier;
  
  // Check if IP is in abuse cooldown
  if (suspiciousActivityStore.has(ip)) {
    const suspiciousData = suspiciousActivityStore.get(ip);
    if (now < suspiciousData.cooldownUntil) {
      return {
        allowed: false,
        reason: 'IP temporarily blocked due to suspicious activity',
        retryAfter: Math.ceil((suspiciousData.cooldownUntil - now) / 1000)
      };
    } else {
      suspiciousActivityStore.delete(ip);
    }
  }
  
  // Initialize or get rate limit data
  if (!rateLimitStore.has(fingerprint)) {
    rateLimitStore.set(fingerprint, {
      requests: [],
      dailyCount: 0,
      dailyReset: now + RATE_LIMITS.DAILY_WINDOW,
      recentMessages: [],
      rapidFireCount: 0,
      lastRequestTime: 0
    });
  }
  
  const userData = rateLimitStore.get(fingerprint);
  
  // Reset daily counter if needed
  if (now > userData.dailyReset) {
    userData.dailyCount = 0;
    userData.dailyReset = now + RATE_LIMITS.DAILY_WINDOW;
  }
  
  // Check daily limit
  if (userData.dailyCount >= RATE_LIMITS.DAILY_LIMIT) {
    return {
      allowed: false,
      reason: 'Daily request limit exceeded',
      retryAfter: Math.ceil((userData.dailyReset - now) / 1000)
    };
  }
  
  // Clean old requests
  userData.requests = userData.requests.filter(time => now - time < RATE_LIMITS.WINDOW_DURATION);
  
  // Check main rate limit
  if (userData.requests.length >= RATE_LIMITS.REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      reason: 'Rate limit exceeded',
      retryAfter: Math.ceil(RATE_LIMITS.WINDOW_DURATION / 1000)
    };
  }
  
  // Check burst protection
  const recentRequests = userData.requests.filter(time => now - time < RATE_LIMITS.BURST_WINDOW);
  if (recentRequests.length >= RATE_LIMITS.BURST_REQUESTS) {
    return {
      allowed: false,
      reason: 'Too many requests in short time',
      retryAfter: 60
    };
  }
  
  // Check for suspicious activity
  const suspiciousActivity = checkSuspiciousActivity(userData, message, now, ip);
  if (suspiciousActivity.isSuspicious) {
    return {
      allowed: false,
      reason: suspiciousActivity.reason,
      retryAfter: suspiciousActivity.retryAfter
    };
  }
  
  // Update counters
  userData.requests.push(now);
  userData.dailyCount++;
  userData.lastRequestTime = now;
  
  return { allowed: true };
}

function checkSuspiciousActivity(userData, message, now, ip) {
  // Check message length
  if (message.length < RATE_LIMITS.MIN_MESSAGE_LENGTH || 
      message.length > RATE_LIMITS.MAX_MESSAGE_LENGTH) {
    flagSuspiciousIP(ip, 'Invalid message length');
    return {
      isSuspicious: true,
      reason: 'Invalid message format',
      retryAfter: 300
    };
  }
  
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(message)) {
      flagSuspiciousIP(ip, `Suspicious pattern: ${pattern}`);
      return {
        isSuspicious: true,
        reason: 'Message contains suspicious content',
        retryAfter: 600
      };
    }
  }
  
  // Check for repeated identical messages
  userData.recentMessages = userData.recentMessages.filter(
    msg => now - msg.timestamp < 5 * 60 * 1000 // Keep last 5 minutes
  );
  
  const identicalCount = userData.recentMessages.filter(
    msg => msg.text.toLowerCase() === message.toLowerCase()
  ).length;
  
  if (identicalCount >= RATE_LIMITS.MAX_IDENTICAL_MESSAGES) {
    flagSuspiciousIP(ip, 'Repeated identical messages');
    return {
      isSuspicious: true,
      reason: 'Too many identical messages',
      retryAfter: 900
    };
  }
  
  // Check rapid fire (too fast requests)
  if (now - userData.lastRequestTime < 2000) { // Less than 2 seconds
    userData.rapidFireCount = (userData.rapidFireCount || 0) + 1;
    if (userData.rapidFireCount >= RATE_LIMITS.MAX_RAPID_FIRE) {
      flagSuspiciousIP(ip, 'Rapid fire requests');
      return {
        isSuspicious: true,
        reason: 'Requests too frequent',
        retryAfter: 600
      };
    }
  } else {
    userData.rapidFireCount = 0;
  }
  
  // Store message for pattern analysis
  userData.recentMessages.push({
    text: message,
    timestamp: now
  });
  
  return { isSuspicious: false };
}

function flagSuspiciousIP(ip, reason) {
  console.warn(`🚨 Suspicious activity from IP ${ip}: ${reason}`);
  
  suspiciousActivityStore.set(ip, {
    reason,
    flaggedAt: Date.now(),
    cooldownUntil: Date.now() + RATE_LIMITS.SUSPICIOUS_COOLDOWN
  });
  
  // Log to Supabase for monitoring (optional)
  logSuspiciousActivity(ip, reason).catch(console.error);
}

async function logSuspiciousActivity(ip, reason) {
  try {
    await supabase
      .from('suspicious_activity')
      .insert([
        {
          ip_address: ip,
          reason: reason,
          created_at: new Date().toISOString()
        }
      ]);
  } catch (error) {
    console.error('Failed to log suspicious activity:', error);
  }
}

// Fallback FAQ for when API is down
const FALLBACK_FAQ = `
Hej! Jag är tillfälligt otillgänglig, men här är grundläggande information om Malnbadens Camping:

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

async function logPendingQuestion(question, ip, metadata = {}) {
  try {
    await supabase
      .from('pending')
      .insert([
        {
          question: question,
          ip_address: ip,
          user_agent: metadata.userAgent,
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
    const identifier = getClientIdentifier(req);
    const { message } = req.body;
    
    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Meddelande krävs' });
    }
    
    const trimmedMessage = message.trim();
    
    // Check rate limits and abuse protection
    const rateLimitResult = checkRateLimit(identifier, trimmedMessage);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({ 
        error: 'Hoppsan! Du har skickat många meddelanden nyligen. Vila lite och försök igen om en stund. 😊',
        fallback: FALLBACK_FAQ,
        retryAfter: rateLimitResult.retryAfter,
        reason: rateLimitResult.reason
      });
    }
    
    // Search for relevant FAQ entries
    const { results, bestSimilarity } = await searchFAQ(trimmedMessage);
    
    // If we have a high-confidence match, return it directly
    if (bestSimilarity >= 0.82 && results.length > 0) {
      return res.status(200).json({
        response: results[0].answer,
        confidence: 'high',
        similarity: bestSimilarity
      });
    }
    
    // Log question as potentially unanswered for learning
    await logPendingQuestion(trimmedMessage, identifier.ip, {
      userAgent: req.headers['user-agent']
    });
    
    // Use GPT-4o-mini with context from search results
    const context = results.length > 0 
      ? results.map(r => `Q: ${r.question}\nA: ${r.answer}`).join('\n\n')
      : 'Ingen relevant information hittad i kunskapsdatabasen.';
    
    const systemPrompt = `Du är en hjälpsam AI-assistent för Malnbadens Camping i Hudiksvall, Sverige. Du är här för att hjälpa besökare med information om campingen.

INSTRUKTIONER:
- Använd CONTEXT nedan som primär informationskälla
- Om CONTEXT inte har exakt information, försök hjälpa baserat på allmän camping-kunskap
- För specifika detaljer som priser, bokningar eller aktuella öppettider, hänvisa till hemsidan
- Var vänlig, naturlig och hjälpsam - prata som en riktig person
- Håll svaren korta men informativa (2-4 meningar)
- Svara alltid på svenska
- Undvik att ge telefonnummer - hänvisa till hemsidan istället

CONTEXT:
${context}

EXEMPEL PÅ BRA SVAR:
- "Det låter som en bra fråga! Jag har inte den exakta informationen just nu, men du kan hitta aktuella priser och bokningsinfo på vår hemsida."
- "Ja, de flesta campingar brukar ha det! För att vara säker på vad vi erbjuder just nu, kolla gärna vår hemsida för senaste informationen."
- "Hmm, det är inte något jag har information om för tillfället. Kolla gärna under 'Aktiviteter' på hemsidan för en komplett lista!"`;

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