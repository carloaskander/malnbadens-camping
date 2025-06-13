import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simplified FAQ data for testing (without category column)
const faqData = [
  {
    question: "Vad kostar det att bo här?",
    answer: "Priserna varierar beroende på säsong och typ av plats. En standardplats kostar från 250 kr/natt under lågsäsong och från 350 kr/natt under högsäsong. Kontakta oss för aktuella priser."
  },
  {
    question: "Finns det WiFi?",
    answer: "Ja, vi erbjuder gratis WiFi i receptionsområdet och på de flesta campingplatser. Lösenordet får du vid incheckning."
  },
  {
    question: "Kan jag ta med min hund?",
    answer: "Ja, hundar är välkomna på Malnbadens Camping! Vi tar en extra avgift på 50 kr/natt för hundar. Hunden ska hållas kopplad och du ansvarar för att städa upp efter den."
  },
  {
    question: "Vilka aktiviteter finns det?",
    answer: "Vi erbjuder simning, fiske, kanotuthyrning, vandringsleder och lekplats. I närheten finns också golf, ridning och sevärdheter i Hudiksvall. Perfekt för naturälskare!"
  },
  {
    question: "Hur bokar jag en plats?",
    answer: "Du kan boka genom vår hemsida, ringa oss på 0650-132 60, eller komma direkt till receptionen. Vi rekommenderar att boka i förväg, särskilt under sommarmånaderna."
  },
  {
    question: "Finns det toaletter och duschar?",
    answer: "Ja, vi har moderna sanitetsanläggningar med toaletter, duschar och handfat. De är öppna dygnet runt och städas dagligen."
  },
  {
    question: "Kan jag grilla på campingen?",
    answer: "Ja, grillning är tillåten på anvisade platser. Vi har gemensamma grillplatser och du får också grilla vid din egen campingplats med försiktighet."
  },
  {
    question: "Finns det lekplats för barn?",
    answer: "Ja, vi har en fin lekplats med gungor, rutschkana och klätterställning. Den ligger centralt på campingen och är perfekt för familjer med barn."
  },
  {
    question: "Var ligger campingen?",
    answer: "Malnbadens Camping ligger på Malnvägen 34 i Hudiksvall, vackert beläget vid vattnet med närhet till både skog och hav. Vi ligger cirka 5 km från Hudiksvalls centrum."
  },
  {
    question: "Kan man bada här?",
    answer: "Ja, vi har en fin badplats direkt vid campingen med både sandstrand och brygga. Vattnet är rent och bra för bad under sommarmånaderna."
  },
  {
    question: "Vilka öppettider har receptionen?",
    answer: "Receptionen är öppen 08:00-20:00 under högsäsong (juni-augusti) och 09:00-17:00 under lågsäsong. Vid ankomst utanför öppettider, kontakta oss i förväg."
  },
  {
    question: "Vad ingår i priset?",
    answer: "I priset ingår campingplats, tillgång till sanitetsanläggningar, duschar, och gemensamma utrymmen. El och WiFi ingår också på de flesta platser."
  }
];

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function seedFAQ() {
  console.log('🌱 Starting simplified FAQ seeding...\n');
  
  try {
    // Clear existing FAQ data (skip the UUID error)
    console.log('🧹 Clearing existing FAQ data...');
    const { data: existingData } = await supabase
      .from('faq')
      .select('id');
    
    if (existingData && existingData.length > 0) {
      for (const row of existingData) {
        await supabase
          .from('faq')
          .delete()
          .eq('id', row.id);
      }
      console.log(`✅ Cleared ${existingData.length} existing entries`);
    } else {
      console.log('✅ No existing data to clear');
    }

    console.log(`\n📝 Processing ${faqData.length} FAQ entries...\n`);

    let successCount = 0;
    for (let i = 0; i < faqData.length; i++) {
      const faq = faqData[i];
      console.log(`${i + 1}/${faqData.length}: "${faq.question}"`);
      
      try {
        // Generate embedding for the question
        const embedding = await generateEmbedding(faq.question);
        
        // Insert into database (without category)
        const { data, error } = await supabase
          .from('faq')
          .insert([
            {
              question: faq.question,
              answer: faq.answer,
              embedding: embedding
            }
          ]);
        
        if (error) {
          console.error(`❌ Error inserting FAQ ${i + 1}:`, error);
        } else {
          console.log(`✅ Inserted successfully`);
          successCount++;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Error processing FAQ ${i + 1}:`, error);
      }
    }

    // Verify the seeding
    console.log('\n🔍 Verifying seeded data...');
    const { data: verifyData, error: verifyError, count } = await supabase
      .from('faq')
      .select('*', { count: 'exact' });
    
    if (verifyError) {
      console.error('❌ Error verifying data:', verifyError);
    } else {
      console.log(`✅ Successfully seeded ${successCount}/${faqData.length} FAQ entries!`);
      console.log(`📊 Total entries in database: ${count}`);
      console.log('\n📋 Sample entries:');
      verifyData.slice(0, 5).forEach((faq, index) => {
        console.log(`${index + 1}. Q: ${faq.question}`);
        console.log(`   A: ${faq.answer.substring(0, 60)}...`);
      });
    }

    console.log('\n🎉 FAQ seeding completed!');
    console.log('\n🧪 Now test these EXACT questions in your chatbot:');
    console.log('✅ "Vad kostar det att bo här?"');
    console.log('✅ "Finns det WiFi?"');
    console.log('✅ "Kan jag ta med min hund?"');
    console.log('✅ "Vilka aktiviteter finns det?"');
    console.log('✅ "Hur bokar jag en plats?"');
    console.log('\n🎯 You should now see "Säker" confidence for exact matches!');
    console.log('🔍 Try variations too - should get "Ganska säker" or "Osäker"');

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
  }
}

// Run the seeding
seedFAQ(); 