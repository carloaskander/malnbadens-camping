import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initial FAQ data for Malnbadens Camping
const faqData = [
  {
    question: "Vilka är era öppettider?",
    answer: "Vi är öppna från april till oktober. Exakta öppettider varierar beroende på säsong. Kontakta oss på 0650-132 60 för aktuella öppettider."
  },
  {
    question: "Hur bokar jag en campingplats?",
    answer: "Du kan boka genom att ringa oss på 0650-132 60 eller via vår hemsida. Vi rekommenderar att boka i förväg, särskilt under högsäsong."
  },
  {
    question: "Vad kostar det att campa?",
    answer: "Priserna varierar beroende på säsong och typ av plats. Se vår prislista på hemsidan eller kontakta oss för aktuella priser."
  },
  {
    question: "Finns det el och vatten på campingplatserna?",
    answer: "Ja, de flesta av våra platser har tillgång till el. Vatten och avlopp finns vid servicestationer runt om på campingen."
  },
  {
    question: "Vad ingår i campingavgiften?",
    answer: "Campingavgiften inkluderar campingplats, tillgång till servicehus med duschar och toaletter, samt wifi på campingområdet."
  },
  {
    question: "Tar ni emot husbilar och husvagnar?",
    answer: "Ja, vi tar emot både husbilar och husvagnar. Vi har platser av olika storlekar för att passa olika fordon."
  },
  {
    question: "Finns det möjlighet att hyra stuga?",
    answer: "Ja, vi har stugor att hyra. Se vår hemsida för bilder, priser och bokning av stugor."
  },
  {
    question: "Har ni vandrarhem?",
    answer: "Ja, vi har vandrarhem med rum för olika gruppers storlekar. Kontakta oss för bokning och priser."
  },
  {
    question: "Är husdjur välkomna?",
    answer: "Ja, husdjur är välkomna på campingen. Vi ber dig hålla ditt husdjur kopplat och städa upp efter det."
  },
  {
    question: "Finns det restaurang på campingen?",
    answer: "Ja, vi har en restaurang som serverar mat och dryck. Öppettider kan variera beroende på säsong."
  },
  {
    question: "Vad finns det för aktiviteter?",
    answer: "Vi erbjuder många aktiviteter som strandliv, fiske, vandring, lekplats för barn och tillgång till båtuthyrning."
  },
  {
    question: "Hur är stranden?",
    answer: "Vi har en fin sandstrand med badmöjligheter. Stranden är populär för både simning och solbad."
  },
  {
    question: "Finns det wifi?",
    answer: "Ja, vi erbjuder gratis wifi på campingområdet. Täckningen är bra i de flesta områden."
  },
  {
    question: "Var ligger ni?",
    answer: "Vi ligger på Malnvägen 34 i Hudiksvall, vackert beläget vid kusten. Lätt att hitta med bil och kollektivtrafik."
  },
  {
    question: "Finns det tvättmöjligheter?",
    answer: "Ja, vi har tvättstuga med tvättmaskiner och torktumlare som gäster kan använda mot en avgift."
  },
  {
    question: "Kan man bada i havet?",
    answer: "Ja, vi ligger vid kusten och har fin badstrand. Vattnet är skönt att bada i under sommarmånaderna."
  },
  {
    question: "Finns parkeringsplats?",
    answer: "Ja, det finns gott om parkeringsplatser för gäster. Parkering ingår i campingavgiften."
  },
  {
    question: "Hur når jag er med kollektivtrafik?",
    answer: "Hudiksvall är välförbundet med buss och tåg. Från Hudiksvall centrum kan du ta lokal buss eller taxi till campingen."
  },
  {
    question: "Finns det affär på campingen?",
    answer: "Vi har en mindre campingshop med basvaror. För större inköp finns ICA och andra affärer i närheten av Hudiksvall."
  },
  {
    question: "Vad ska jag ta med?",
    answer: "Ta med eget tält eller husvagn, sängkläder, handduk, och personliga föremål. Grundutrustning för camping finns att köpa på plats."
  },
  {
    question: "Finns det lekplats för barn?",
    answer: "Ja, vi har lekplats och aktiviteter för barn. Stranden är också perfekt för barnfamiljer."
  },
  {
    question: "Kan man fiska?",
    answer: "Ja, det finns goda fiskemöjligheter både från stranden och med båt. Fiskekort kan behövas för vissa områden."
  },
  {
    question: "Finns det servicehus?",
    answer: "Ja, vi har flera servicehus med toaletter, duschar, diskho och avfallshantering fördelade över campingområdet."
  },
  {
    question: "Vilka betalningssätt accepterar ni?",
    answer: "Vi accepterar kontanter, bankkort och Swish. Kortbetalning är möjlig för de flesta tjänster."
  },
  {
    question: "Kan man grilla?",
    answer: "Ja, grillning är tillåten på campingen. Använd bara säkra grillplatser och följ eldförbudet vid torka."
  },
  {
    question: "Vad gör man om det regnar?",
    answer: "Det finns inomhusaktiviteter som restaurangen och spelrum. Hudiksvall centrum erbjuder också shopping och kultur."
  },
  {
    question: "Finns det båtuthyrning?",
    answer: "Ja, vi erbjuder båtuthyrning för gäster som vill utforska kusten. Kontakta oss för priser och tillgänglighet."
  },
  {
    question: "Kan man boka långtidsboende?",
    answer: "Ja, vi erbjuder möjlighet till säsongsboende. Kontakta oss för priser och villkor för långtidsboende."
  },
  {
    question: "Vad händer om man kommer sent på kvällen?",
    answer: "Vi försöker vara flexibla med ankomst. Kontakta oss i förväg om du kommer sent så arrangerar vi incheckning."
  },
  {
    question: "Finns det cykeluthyrning?",
    answer: "Ja, vi har cyklar att hyra. Perfekt för att utforska den vackra kusten och närområdet."
  }
];

async function seedFAQ() {
  console.log('Starting FAQ seeding process...');
  
  try {
    // Clear existing FAQ entries
    await supabase.from('faq').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared existing FAQ entries');

    // Process each FAQ entry
    for (let i = 0; i < faqData.length; i++) {
      const faq = faqData[i];
      console.log(`Processing FAQ ${i + 1}/${faqData.length}: ${faq.question}`);
      
      try {
        // Generate embedding
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: faq.question,
        });
        
        const embedding = embeddingResponse.data[0].embedding;
        
        // Insert into database
        const { error } = await supabase
          .from('faq')
          .insert([{
            question: faq.question,
            answer: faq.answer,
            embedding
          }]);
        
        if (error) {
          console.error(`Error inserting FAQ ${i + 1}:`, error);
        } else {
          console.log(`✓ Successfully inserted FAQ ${i + 1}`);
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error processing FAQ ${i + 1}:`, error);
      }
    }
    
    console.log('FAQ seeding completed!');
    
  } catch (error) {
    console.error('Error during FAQ seeding:', error);
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFAQ();
} 