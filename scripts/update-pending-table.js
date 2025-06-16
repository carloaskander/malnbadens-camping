import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePendingTable() {
  console.log('🔄 Updating pending table structure...');
  
  try {
    // First, let's check current table structure
    console.log('📋 Checking current table structure...');
    
    const { data: currentColumns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'pending');

    if (checkError) {
      console.log('⚠️  Could not check existing columns, proceeding with updates...');
    } else {
      console.log('Current columns:', currentColumns?.map(c => c.column_name).join(', '));
    }

    // Add the new columns using raw SQL
    const sqlCommands = [
      'ALTER TABLE pending ADD COLUMN IF NOT EXISTS bot_response TEXT;',
      'ALTER TABLE pending ADD COLUMN IF NOT EXISTS confidence TEXT;', 
      'ALTER TABLE pending ADD COLUMN IF NOT EXISTS similarity DECIMAL(4,3);'
    ];

    for (const sql of sqlCommands) {
      console.log(`🔧 Executing: ${sql}`);
      const { error } = await supabase.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`❌ Error executing SQL: ${sql}`, error);
      } else {
        console.log('✅ Success');
      }
    }

    console.log('🎉 Table update completed!');
    console.log('\n📊 Your pending table now includes:');
    console.log('  - question (original)');
    console.log('  - bot_response (what the bot answered)');
    console.log('  - confidence (high/medium/low)');
    console.log('  - similarity (0.000-1.000)');
    console.log('  - created_at (timestamp)');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the update
updatePendingTable(); 