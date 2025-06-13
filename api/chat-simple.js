import OpenAI from 'openai';

// Fallback FAQ for when API is down
const FALLBACK_FAQ = `
Här är vanliga frågor om Malnbadens Camping:

📞 **Kontakt**: 0650-132 60
📍 **Adress**: Malnvägen 34, 82456 Hudiksvall
🏕️ **Bokning**: Ring oss eller besök vår hemsida
🕐 **Öppettider**: Se vår öppettider-sida för aktuell information

För mer detaljerad information, vänligen kontakta oss direkt!
`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Check environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY');
      return res.status(500).json({
        error: 'Server configuration error',
        fallback: FALLBACK_FAQ
      });
    }
    
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Meddelande krävs' });
    }
    
    console.log('Processing simple chat request:', { message: message.trim() });
    
    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Simple system prompt without database context
    const systemPrompt = `Du är en hjälpsam assistent för Malnbadens Camping i Hudiksvall, Sverige. 

INSTRUKTIONER:
- Svara baserat på allmän camping-kunskap
- Om du inte vet något specifikt om campingen, hänvisa till telefonnummer 0650-132 60
- Håll svaren korta och hjälpsamma (max 2-3 meningar)
- Svara på svenska
- Var vänlig och professionell

CAMPING INFO:
- Namn: Malnbadens Camping
- Plats: Hudiksvall, Sverige
- Telefon: 0650-132 60
- Adress: Malnvägen 34, 82456 Hudiksvall`;

    console.log('Calling OpenAI...');
    
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
    
    console.log('OpenAI response generated successfully');
    
    return res.status(200).json({
      response,
      confidence: 'basic',
      mode: 'simple'
    });
    
  } catch (error) {
    console.error('Simple chat API error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code
    });
    
    return res.status(500).json({
      error: 'Ett fel uppstod. Försök igen senare.',
      fallback: FALLBACK_FAQ,
      debug: error.message
    });
  }
} 