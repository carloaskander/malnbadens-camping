// Test script for async webhook solution
// Run with: node scripts/test-async-solution.js

import https from 'https';

console.log('🧪 TESTING ASYNC WEBHOOK SOLUTION');
console.log('=====================================\n');

// Test 1: Manual job processing
async function testJobProcessor() {
  console.log('1. Testing job processor...');
  
  const processorUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/process-webhook-jobs';
  
  const start = Date.now();
  
  return new Promise((resolve) => {
    const req = https.request(processorUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    }, (res) => {
      const duration = Date.now() - start;
      console.log(`   ⏱️ Job processor responded in ${duration}ms`);
      console.log(`   📊 Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`   📝 Jobs processed: ${parsed.processed || 0}`);
          console.log(`   📝 Jobs failed: ${parsed.failed || 0}`);
          console.log(`   📝 Message: ${parsed.message || 'No message'}`);
          resolve({ success: true, duration, response: parsed });
        } catch (e) {
          console.log(`   📝 Raw response: ${data}`);
          resolve({ success: false, duration, error: 'Parse error' });
        }
      });
    });
    
    req.on('timeout', () => {
      const duration = Date.now() - start;
      console.log(`   ⏰ Job processor TIMEOUT after ${duration}ms`);
      req.destroy();
      resolve({ success: false, duration, error: 'timeout' });
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - start;
      console.log(`   ❌ Job processor ERROR after ${duration}ms: ${error.message}`);
      resolve({ success: false, duration, error: error.message });
    });
    
    req.end();
  });
}

// Test 2: Optimized Discord bot
async function testOptimizedDiscordBot() {
  console.log('\n2. Testing optimized Discord bot...');
  
  const webhookUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot-optimized';
  const testData = JSON.stringify({
    record: {
      id: 'test-optimized-bot',
      question: 'Test question for optimized Discord bot',
      bot_response: 'Test response from optimized bot',
      priority: 'medium',
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
      timeout: 30000
    }, (res) => {
      const duration = Date.now() - start;
      console.log(`   ⏱️ Optimized bot responded in ${duration}ms`);
      console.log(`   📊 Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`   📝 Success: ${parsed.success}`);
          console.log(`   📝 Message: ${parsed.message || 'No message'}`);
          if (parsed.duration) {
            console.log(`   ⚡ Bot processing time: ${parsed.duration}ms`);
          }
          resolve({ success: true, duration, response: parsed });
        } catch (e) {
          console.log(`   📝 Raw response: ${data}`);
          resolve({ success: false, duration, error: 'Parse error' });
        }
      });
    });
    
    req.on('timeout', () => {
      const duration = Date.now() - start;
      console.log(`   ⏰ Optimized bot TIMEOUT after ${duration}ms`);
      req.destroy();
      resolve({ success: false, duration, error: 'timeout' });
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - start;
      console.log(`   ❌ Optimized bot ERROR after ${duration}ms: ${error.message}`);
      resolve({ success: false, duration, error: error.message });
    });
    
    req.write(testData);
    req.end();
  });
}

// Test 3: Compare old vs new bot performance
async function comparePerformance() {
  console.log('\n3. Comparing old vs optimized bot performance...');
  
  const oldBotUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot';
  const newBotUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot-optimized';
  
  const testData = JSON.stringify({
    record: {
      id: 'performance-test',
      question: 'Performance comparison test question',
      bot_response: 'Performance comparison test response',
      priority: 'low',
      confidence: 'low',
      similarity: 0.3
    }
  });
  
  // Test old bot
  console.log('   🔄 Testing old bot...');
  const oldResult = await makeRequest(oldBotUrl, testData);
  
  // Test new bot
  console.log('   🔄 Testing optimized bot...');
  const newResult = await makeRequest(newBotUrl, testData);
  
  console.log(`   📊 Old bot: ${oldResult.duration}ms`);
  console.log(`   📊 Optimized bot: ${newResult.duration}ms`);
  
  if (newResult.duration < oldResult.duration) {
    const improvement = ((oldResult.duration - newResult.duration) / oldResult.duration * 100).toFixed(1);
    console.log(`   ✅ Improvement: ${improvement}% faster`);
  } else {
    console.log(`   ⚠️ Old bot was faster by ${newResult.duration - oldResult.duration}ms`);
  }
  
  return { oldResult, newResult };
}

// Helper function to make HTTP requests
async function makeRequest(url, data) {
  return new Promise((resolve) => {
    const start = Date.now();
    
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 30000
    }, (res) => {
      const duration = Date.now() - start;
      
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({ success: true, duration, status: res.statusCode, data: responseData });
      });
    });
    
    req.on('timeout', () => {
      const duration = Date.now() - start;
      req.destroy();
      resolve({ success: false, duration, error: 'timeout' });
    });
    
    req.on('error', (error) => {
      const duration = Date.now() - start;
      resolve({ success: false, duration, error: error.message });
    });
    
    req.write(data);
    req.end();
  });
}

// Run all tests
async function runTests() {
  const results = {};
  
  results.jobProcessor = await testJobProcessor();
  results.optimizedBot = await testOptimizedDiscordBot();
  results.performance = await comparePerformance();
  
  console.log('\n=====================================');
  console.log('🏁 ASYNC SOLUTION TESTING COMPLETE');
  console.log('=====================================\n');
  
  console.log('📊 RESULTS SUMMARY:');
  console.log(`• Job processor: ${results.jobProcessor.success ? 'PASS' : 'FAIL'} (${results.jobProcessor.duration}ms)`);
  console.log(`• Optimized bot: ${results.optimizedBot.success ? 'PASS' : 'FAIL'} (${results.optimizedBot.duration}ms)`);
  console.log(`• Performance comparison: ${results.performance.oldResult.duration}ms → ${results.performance.newResult.duration}ms`);
  
  console.log('\n💡 ANALYSIS:');
  
  if (results.jobProcessor.success) {
    console.log('✅ Job processor is working - async solution ready');
  } else {
    console.log('❌ Job processor failed - check setup');
  }
  
  if (results.optimizedBot.success && results.optimizedBot.duration < 3000) {
    console.log('✅ Optimized Discord bot is fast enough');
  } else {
    console.log('⚠️ Optimized Discord bot still needs work');
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. If tests pass, apply the async database setup');
  console.log('2. Replace the old Discord bot with the optimized version');
  console.log('3. Set up periodic job processing (every 1-2 minutes)');
  console.log('4. Monitor the webhook_jobs table for any issues');
}

runTests().catch(console.error); 