// Simple timeout debugging script
// Run with: node scripts/debug-timeout-simple.js

import https from 'https';

console.log('🔍 SIMPLE TIMEOUT DEBUGGING');
console.log('=====================================\n');

// Test 1: Direct webhook call timing
async function testWebhookTiming() {
  console.log('1. Testing Discord bot response time...');
  
  const webhookUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot';
  const testData = JSON.stringify({
    record: {
      id: 'test-timeout-investigation',
      question: 'Test question for timeout investigation',
      bot_response: 'Test response',
      priority: 'low',
      confidence: 'low',
      similarity: 0.3
    }
  });
  
  const start = Date.now();
  console.log('   ⏱️ Starting webhook call...');
  
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
      console.log(`   ✅ Webhook responded in ${duration}ms`);
      console.log(`   📊 Status: ${res.statusCode}`);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          console.log(`   📝 Response: ${parsed.message || 'Success'}`);
          if (parsed.duration) {
            console.log(`   ⚡ Discord bot processing time: ${parsed.duration}ms`);
          }
        } catch (e) {
          console.log(`   📝 Raw response: ${responseData.substring(0, 100)}...`);
        }
        resolve({ duration, success: true });
      });
    });
    
    req.on('timeout', () => {
      const duration = Date.now() - start;
      console.log(`   ⏰ TIMEOUT after ${duration}ms`);
      req.destroy();
      resolve({ duration, success: false, error: 'timeout' });
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - start;
      console.log(`   ❌ ERROR after ${duration}ms: ${error.message}`);
      resolve({ duration, success: false, error: error.message });
    });
    
    req.write(testData);
    req.end();
  });
}

// Test 2: Multiple concurrent webhook calls
async function testConcurrentWebhooks() {
  console.log('\n2. Testing multiple concurrent webhook calls...');
  
  const webhookUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot';
  
  const promises = [];
  for (let i = 0; i < 3; i++) {
    const testData = JSON.stringify({
      record: {
        id: `test-concurrent-${i}`,
        question: `Concurrent test question ${i}`,
        bot_response: `Test response ${i}`,
        priority: 'low',
        confidence: 'low',
        similarity: 0.3
      }
    });
    
    promises.push(new Promise((resolve) => {
      const start = Date.now();
      console.log(`   🚀 Starting call ${i + 1}...`);
      
      const req = https.request(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': testData.length
        },
        timeout: 30000
      }, (res) => {
        const duration = Date.now() - start;
        console.log(`   ✅ Call ${i + 1} responded in ${duration}ms`);
        resolve({ call: i + 1, duration, success: true });
      });
      
      req.on('timeout', () => {
        const duration = Date.now() - start;
        console.log(`   ⏰ Call ${i + 1} TIMEOUT after ${duration}ms`);
        req.destroy();
        resolve({ call: i + 1, duration, success: false });
      });
      
      req.on('error', (error) => {
        const duration = Date.now() - start;
        console.log(`   ❌ Call ${i + 1} ERROR after ${duration}ms: ${error.message}`);
        resolve({ call: i + 1, duration, success: false });
      });
      
      req.write(testData);
      req.end();
    }));
  }
  
  const start = Date.now();
  const results = await Promise.all(promises);
  const totalDuration = Date.now() - start;
  
  console.log(`   📊 All calls completed in ${totalDuration}ms`);
  
  const successful = results.filter(r => r.success).length;
  const avgDuration = results.reduce((acc, r) => acc + r.duration, 0) / results.length;
  
  console.log(`   ✅ Successful calls: ${successful}/3`);
  console.log(`   ⏱️ Average response time: ${avgDuration.toFixed(0)}ms`);
  
  return { totalDuration, successful, avgDuration };
}

// Test 3: Health check endpoint
async function testHealthCheck() {
  console.log('\n3. Testing Discord bot health check...');
  
  const healthUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot';
  
  const start = Date.now();
  
  return new Promise((resolve) => {
    const req = https.request(healthUrl, {
      method: 'GET',
      timeout: 10000
    }, (res) => {
      const duration = Date.now() - start;
      console.log(`   ✅ Health check responded in ${duration}ms`);
      console.log(`   📊 Status: ${res.statusCode}`);
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          console.log(`   🤖 Bot ready: ${parsed.botReady || 'unknown'}`);
          console.log(`   📝 Message: ${parsed.message || 'No message'}`);
        } catch (e) {
          console.log(`   📝 Raw response: ${responseData.substring(0, 100)}...`);
        }
        resolve({ duration, success: true });
      });
    });
    
    req.on('timeout', () => {
      const duration = Date.now() - start;
      console.log(`   ⏰ Health check TIMEOUT after ${duration}ms`);
      req.destroy();
      resolve({ duration, success: false });
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - start;
      console.log(`   ❌ Health check ERROR after ${duration}ms: ${error.message}`);
      resolve({ duration, success: false });
    });
    
    req.end();
  });
}

// Run all tests
async function runTests() {
  const results = {};
  
  results.webhook = await testWebhookTiming();
  results.concurrent = await testConcurrentWebhooks();
  results.health = await testHealthCheck();
  
  console.log('\n=====================================');
  console.log('🏁 SIMPLE DEBUGGING COMPLETE');
  console.log('=====================================\n');
  
  console.log('📊 RESULTS SUMMARY:');
  console.log(`• Discord bot response time: ${results.webhook.duration}ms`);
  console.log(`• Concurrent calls average: ${results.concurrent.avgDuration.toFixed(0)}ms`);
  console.log(`• Health check time: ${results.health.duration}ms`);
  
  console.log('\n💡 ANALYSIS:');
  if (results.webhook.duration > 10000) {
    console.log('🚨 Discord bot is SLOW (>10s) - This could cause database timeouts');
  } else if (results.webhook.duration > 5000) {
    console.log('⚠️ Discord bot is moderately slow (>5s) - Might cause timeouts under load');
  } else {
    console.log('✅ Discord bot response time is acceptable (<5s)');
  }
  
  if (results.concurrent.successful < 3) {
    console.log('🚨 Discord bot fails under concurrent load');
  } else {
    console.log('✅ Discord bot handles concurrent requests well');
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Check the SQL results from Supabase Dashboard');
  console.log('2. If Discord bot is slow, that\'s likely the timeout cause');
  console.log('3. If Discord bot is fast, the issue is in the database trigger');
  console.log('4. Run the full database scenarios test with credentials');
}

runTests().catch(console.error); 