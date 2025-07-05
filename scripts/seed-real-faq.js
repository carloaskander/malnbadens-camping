import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the parent directory (project root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const REAL_FAQ_DATA = [
  {
    question: "Hur långt är det från campingen till stranden?",
    answer: "Cirka 150 meter till Malnbadens sandstrand."
  },
  {
    question: "Finns det restaurang vid stranden?",
    answer: "Ja, strandrestaurangen Maln Hav & Krog ligger precis vid stranden och är känd för god mat, evenemang och havsutsikt."
  },
  {
    question: "Har stranden ett område för hundar?",
    answer: "Ja, det finns ett särskilt avsnitt där hundar är välkomna att bada och leka."
  },
  {
    question: "Vilka aktiviteter finns vid motionsspåret?",
    answer: "Flera löp- och promenadrundor, banor för rullskidor/rullskridskor samt en dirt-jump-bana för cykel."
  },
  {
    question: "Hur många campingplatser finns det och hur stora är de?",
    answer: "125 platser på 90–110 m²; 99 % har el."
  },
  {
    question: "Vilka bekvämligheter ingår på campingplatserna?",
    answer: "El, wifi, latrin- och gråvattentömning, servicehus med dusch, bastu, skötrum, kök, gemensam grill, utomhusmatplats, diskrum och dricksvatten."
  },
  {
    question: "Kan jag önska en specifik campingplats?",
    answer: "Ja, ange gärna önskemål vid bokning; vi försöker tillmötesgå dem men kan inte garantera."
  },
  {
    question: "Hur många stugor finns det och hur stora är de?",
    answer: "Nio stugor på 16 m² med 2–4 bäddar; extra madrass kan ordnas."
  },
  {
    question: "Har stugorna eget badrum?",
    answer: "Nej, WC, dusch, bastu och skötrum finns i servicehuset intill."
  },
  {
    question: "Vilka bekvämligheter finns i stugorna?",
    answer: "Wifi, LCD-TV, egen uteplats samt ett enkelt kök; dessutom tillgång till ett större gemensamt kök."
  },
  {
    question: "Hur många rum finns i vandrarhemmet?",
    answer: "15 rum varav 12 enkel-/dubbelrum; gäster delar två badrum och två kök."
  },
  {
    question: "Erbjuder vandrarhemmet tvättmöjligheter?",
    answer: "Ja, gratis tvättmaskin och torkskåp ingår."
  },
  {
    question: "Hur långt är vandrarhemmet från Hudiksvalls centrum?",
    answer: "Cirka 4 km; bra bussförbindelser finns."
  },
  {
    question: "Vilken är turistsäsongen för camping och stugor?",
    answer: "Från mitten av maj till slutet av september."
  },
  {
    question: "Är vandrarhemmet öppet året runt?",
    answer: "Ja, för företags- och långtidsbokningar."
  },
  {
    question: "Hur kontaktar jag campingen?",
    answer: "Telefon 0650-132 60 eller e-post info@malnbadenscamping.se. Adress: Malnvägen 34, 824 56 Hudiksvall."
  },
  {
    question: "Vad är tyst tid på campingen?",
    answer: "Mellan 23:00 och 07:00 ska det vara lugnt på området."
  },
  {
    question: "Får jag ta med hund till campingen?",
    answer: "Ja, husdjur är välkomna på campingtomterna och har även ett eget hundavsnitt på stranden."
  },
  {
    question: "Får man ha husdjur i stugorna?",
    answer: "Kontakta receptionen först – vissa stugor kan tillåta husdjur beroende på beläggning och städrutin."
  },
  {
    question: "Var får jag grilla?",
    answer: "Använd helst den gemensamma grillplatsen vid servicehuset. Bärbar grill får inte stå direkt på gräset – ställ den på vägen eller annan hård yta för att undvika brännskador."
  },
  {
    question: "Är det tillåtet med eldkorg eller öppen eld?",
    answer: "Endast på anvisad grillplats; öppen eld på marken är inte tillåten av brandsäkerhetsskäl."
  },
  {
    question: "Har ni bokningsbar bastu?",
    answer: "Bastun är normalt redan uppvärmd som drop-in: en för dam- och en för herrdelen i servicehuset. Ingen förbokning krävs; fråga personalen om status."
  },
  {
    question: "Kan jag ladda elbilen?",
    answer: "Om du hyr en el-plats får du använda dess uttag för bilen. Vill du bara ladda på annan plats eller om du inte bor på campingen, kontakta receptionen. Laddning utanför egen plats kan ibland erbjudas under lågsäsong mot avgift men garanteras inte."
  },
  {
    question: "Hyr ni ut cyklar?",
    answer: "Ja, heldagsuthyrning finns. Pris cirka 100–150 kr/dag – fråga i receptionen för exakt belopp och tillgänglighet."
  },
  {
    question: "Finns kajaker att hyra?",
    answer: "Ja, kajakuthyrning erbjuds – boka i receptionen."
  },
  {
    question: "När är receptionen öppen?",
    answer: "Se alltid /sv/opening-hours för aktuella tider. Under högsäsong är receptionen normalt öppen 08–21."
  },
  {
    question: "Vilka tider är minigolfbanan öppen?",
    answer: "Se /sv/opening-hours för minigolfens aktuella öppettider."
  },
  {
    question: "Var hittar jag aktuella priser för campingplatser?",
    answer: "Se /sv/accommodation/camping för dagsaktuell prislista."
  },
  {
    question: "Var hittar jag aktuella priser för stugor?",
    answer: "Se /sv/accommodation/cottages för aktuella stugpriser."
  },
  {
    question: "Var hittar jag priser för vandrarhemmet?",
    answer: "Se /sv/accommodation/hostel för priser och långtidspaket."
  },
  {
    question: "Vad ingår i priset?",
    answer: "På campingplatserna ingår el, varma duschar, Wi-Fi samt fri tillgång till servicehusets kök och övriga faciliteter – det mesta du behöver för en bekväm vistelse. För stugor och vandrarhem ingår inte sänglinne; däremot ingår slutstädning i vandrarhemmet. Båda boendena har fräscha gemensamma badrum och kök, och stugorna har dessutom ett litet pentry för enklare måltider. Kompletta priser och bokning hittar du på /accommodation/camping, /accommodation/cottages och /accommodation/hostel."
  },
  {
    question: "Finns det wifi överallt?",
    answer: "Ja, vi erbjuder kostnadsfritt Wi-Fi som täcker hela campingen. Nätet förbättras kontinuerligt och genomgick en extra uppgradering 2025 för att stärka täckningen även i tidigare svagare områden. Skulle du ändå märka av svag signal är du alltid välkommen att säga till i receptionen så hjälper vi dig snabbt."
  },
  {
    question: "Kan jag få studentrabatt?",
    answer: "Tyvärr erbjuder vi inga särskilda rabatter för studenter eller pensionärer. Våra ordinarie priser gäller för alla gäster och visas alltid uppdaterade på respektive bokningssida."
  },
  {
    question: "Kan jag få en plats nära stranden?",
    answer: "Hela campingen ligger inom ungefär 150 meter från sandstranden, så du har alltid kort promenadavstånd till vattnet. Det finns dock inga tomter precis på strandkanten."
  },
  {
    question: "Vill ha en stor plats för min stora husbil",
    answer: "De flesta av våra campingtomter rymmer även större husbilar. Lägg gärna till en kommentar i bokningen eller meddela receptionen, särskilt under högsäsong, så ser vi till att du får en plats som passar."
  },
  {
    question: "Har ni restaurang?",
    answer: "Ja, Restaurang Maln Hav & Krog ligger på stranden strax intill campingen. Den drivs fristående och är känd för god mat, evenemang och en fantastisk havsutsikt. Läs mer på /restaurant."
  },
  {
    question: "Var parkerar jag bilen?",
    answer: "Vandrarhems- och stuggäster har markerade parkeringsplatser intill sitt boende. Camperar du på en tomt parkerar du normalt på själva platsen; extra fordon går bra så länge allt får plats inom tomtgränsen och inte stör grannar."
  },
  {
    question: "Är det ledigt imorgon?",
    answer: "Jag är inte direkt kopplad till bokningssystemet. Klicka på \"Boka nu\" på startsidan eller på sidorna för camping, stugor eller vandrarhem (/accommodation/camping, /accommodation/cottages, /accommodation/hostel) för att se aktuell tillgänglighet och boka direkt."
  }
];

async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function clearExistingFAQs() {
  console.log('🧹 Clearing existing FAQ data...');
  try {
    const { error } = await supabase
      .from('faq')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible UUID
    
    if (error) {
      console.error('Error clearing FAQ data:', error);
    } else {
      console.log('✅ Cleared existing FAQ data');
    }
  } catch (error) {
    console.error('Error clearing FAQ data:', error);
  }
}

async function seedRealFAQs() {
  console.log('🌱 Starting REAL FAQ seeding with 30 professional Q&As...');
  
  // Clear existing data
  await clearExistingFAQs();
  
  console.log(`📝 Processing ${REAL_FAQ_DATA.length} real FAQ entries...`);
  
  let successCount = 0;
  
  for (let i = 0; i < REAL_FAQ_DATA.length; i++) {
    const faq = REAL_FAQ_DATA[i];
    console.log(`\n${i + 1}/${REAL_FAQ_DATA.length}: "${faq.question.substring(0, 50)}..."`);
    
    try {
      // Generate embedding for the question
      const embedding = await generateEmbedding(faq.question);
      
      // Insert FAQ with embedding
      const { error } = await supabase
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
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error processing FAQ ${i + 1}:`, error);
    }
  }
  
  // Verify the seeded data
  console.log('\n🔍 Verifying seeded data...');
  const { data, error } = await supabase
    .from('faq')
    .select('question, answer')
    .limit(5);
  
  if (error) {
    console.error('Error verifying data:', error);
  } else {
    console.log(`✅ Successfully seeded ${successCount}/${REAL_FAQ_DATA.length} real FAQ entries!`);
    console.log(`📊 Total entries in database: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log('\n📋 Sample entries:');
      data.forEach((faq, index) => {
        console.log(`${index + 1}. Q: ${faq.question}`);
        console.log(`   A: ${faq.answer.substring(0, 60)}...`);
      });
    }
  }
  
  console.log('\n🎉 REAL FAQ seeding completed!');
  console.log('\n🧪 Now test these REAL questions in your chatbot:');
  console.log('✅ "Hur långt är det från campingen till stranden?"');
  console.log('✅ "Finns det restaurang vid stranden?"');
  console.log('✅ "Kan jag ladda elbilen?"');
  console.log('✅ "Hyr ni ut cyklar?"');
  console.log('✅ "Vad är tyst tid på campingen?"');
  console.log('\n🎯 You should now see "Säker" confidence for exact matches with REAL camping info!');
}

// Run the seeding
seedRealFAQs().catch(console.error); 