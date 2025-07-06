// Debug script to test timeout scenarios
// Run with: node scripts/debug-timeout-scenarios.js

import { createClient } from '@supabase/supabase-js';
import https from 'https';

const supabaseUrl = process.env.SUPABASE_URL || 'your-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-key';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 DEBUGGING TIMEOUT SCENARIOS');
console.log('=====================================\n');

// Test 1: Simple insert without trigger
async function testSimpleInsert() {
  console.log('1. Testing simple insert (no trigger)...');
  const start = Date.now();
  
  try {
    // Insert directly, bypass trigger
    const { data, error } = await supabase
      .from('pending')
      .insert([{
        question: 'TEST: Simple insert without webhook',
        bot_response: 'Test response',
        confidence: 'low',
        similarity: 0.3,
        priority: 'low',
        sent_to_discord: true // Set to true to avoid trigger
      }])
      .select();
    
    const duration = Date.now() - start;
    console.log(`   ✅ Success in ${duration}ms`);
    console.log(`   📝 Inserted ID: ${data[0]?.id}`);
    
    // Clean up
    await supabase.from('pending').delete().eq('id', data[0]?.id);
    
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
}

// Test 2: Insert with trigger (but webhook disabled)
async function testInsertWithTrigger() {
  console.log('\n2. Testing insert with trigger (webhook should fire)...');
  const start = Date.now();
  
  try {
    const { data, error } = await supabase
      .from('pending')
      .insert([{
        question: 'TEST: Insert with webhook trigger',
        bot_response: 'Test response',
        confidence: 'low',
        similarity: 0.3,
        priority: 'low',
        sent_to_discord: false // This should trigger webhook
      }])
      .select();
    
    const duration = Date.now() - start;
    console.log(`   ⏱️ Duration: ${duration}ms`);
    
    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log(`   📊 Error code: ${error.code}`);
    } else {
      console.log(`   ✅ Success`);
      console.log(`   📝 Inserted ID: ${data[0]?.id}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Exception: ${error.message}`);
  }
}

// Test 3: Direct webhook call timing
async function testWebhookTiming() {
  console.log('\n3. Testing direct webhook call timing...');
  
  const webhookUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot';
  const testData = JSON.stringify({
    record: {
      id: 'test-timing-id',
      question: 'Test timing question',
      priority: 'low',
      confidence: 'low',
      similarity: 0.3
    }
  });
  
  const start = Date.now();
  
  return new Promise((resolve) => {
    const req = https.request(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': testData.length
      },
      timeout: 30000 // 30 second timeout
    }, (res) => {
      const duration = Date.now() - start;
      console.log(`   ⏱️ Webhook response time: ${duration}ms`);
      console.log(`   📊 Status: ${res.statusCode}`);
      resolve();
    });
    
    req.on('timeout', () => {
      const duration = Date.now() - start;
      console.log(`   ⏰ Webhook TIMEOUT after ${duration}ms`);
      req.destroy();
      resolve();
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - start;
      console.log(`   ❌ Webhook ERROR after ${duration}ms: ${error.message}`);
      resolve();
    });
    
    req.write(testData);
    req.end();
  });
}

// Test 4: Multiple rapid inserts
async function testRapidInserts() {
  console.log('\n4. Testing multiple rapid inserts...');
  
  const promises = [];
  for (let i = 0; i < 3; i++) {
    promises.push(
      supabase
        .from('pending')
        .insert([{
          question: `TEST: Rapid insert ${i}`,
          bot_response: 'Test response',
          confidence: 'low',
          similarity: 0.3,
          priority: 'low',
          sent_to_discord: true // Avoid trigger for this test
        }])
        .select()
    );
  }
  
  const start = Date.now();
  try {
    const results = await Promise.all(promises);
    const duration = Date.now() - start;
    console.log(`   ✅ All 3 inserts completed in ${duration}ms`);
    
    // Clean up
    for (const result of results) {
      if (result.data?.[0]?.id) {
        await supabase.from('pending').delete().eq('id', result.data[0].id);
      }
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  await testSimpleInsert();
  await testInsertWithTrigger();
  await testWebhookTiming();
  await testRapidInserts();
  
  console.log('\n=====================================');
  console.log('🏁 DEBUGGING COMPLETE');
  console.log('\n💡 ANALYSIS:');
  console.log('- If Test 1 is fast but Test 2 is slow → Webhook is the bottleneck');
  console.log('- If Test 3 shows webhook timeout → Discord bot is slow/unreachable');
  console.log('- If Test 4 fails → Database connection issues');
  console.log('- If all tests are slow → General database performance issue');
}

runTests().catch(console.error); 