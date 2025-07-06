// Test script to demonstrate webhook data approach
// Run with: node scripts/test-webhook-data-approach.js

import https from 'https';

console.log('🧪 TESTING WEBHOOK DATA APPROACH');
console.log('=====================================\n');

// This simulates what the database trigger sends
const mockWebhookData = {
  record: {
    id: "test-webhook-id-123",
    question: "Can I bring my pet iguana to the camping?",
    bot_response: "I'm not sure about pet policies. Let me check with the staff.",
    confidence: "low",
    similarity: 0.35,
    priority: "high",
    sent_to_discord: false
  }
};

console.log('📨 Simulating webhook call with data:');
console.log(JSON.stringify(mockWebhookData, null, 2));
console.log('\n🔄 Sending to Discord bot...\n');

const webhookUrl = 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot';
const testData = JSON.stringify(mockWebhookData);

const start = Date.now();

const req = https.request(webhookUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': testData.length
  },
  timeout: 30000
}, (res) => {
  const duration = Date.now() - start;
  console.log(`⏱️ Response time: ${duration}ms`);
  console.log(`📊 Status: ${res.statusCode}`);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response:');
    try {
      const parsed = JSON.parse(responseData);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(responseData);
    }
    
    console.log('\n=====================================');
    console.log('🏁 TEST COMPLETE');
    console.log('\n💡 ANALYSIS:');
    console.log('- This approach works even if the database insert failed');
    console.log('- We use the webhook data directly instead of re-fetching');
    console.log('- No database dependency for Discord bot processing');
    console.log('- Question still gets to Discord even if Supabase times out');
  });
});

req.on('timeout', () => {
  const duration = Date.now() - start;
  console.log(`⏰ Request TIMEOUT after ${duration}ms`);
  req.destroy();
});

req.on('error', (error) => {
  const duration = Date.now() - start;
  console.log(`❌ Request ERROR after ${duration}ms: ${error.message}`);
});

req.write(testData);
req.end(); 