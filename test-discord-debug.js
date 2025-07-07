// Test Discord bot endpoint to debug the issue
const testDiscordBot = async () => {
  console.log('🧪 DEBUGGING DISCORD BOT ENDPOINT');
  console.log('=====================================');
  
  const testData = {
    id: 'test-debug-id-123',
    question: 'Test question for debugging',
    bot_response: 'Test response for debugging',
    confidence: 'low',
    similarity: 0.3,
    priority: 'high'
  };
  
  const webhookUrl = 'https://malnbadens-camping-hwo542oy8-carloaskanders-projects.vercel.app/api/discord-bot-optimized';
  
  console.log(`📞 Testing Discord bot at: ${webhookUrl}`);
  console.log(`📝 Sending data:`, JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log(`📊 Response status: ${response.status}`);
    console.log(`📊 Response statusText: ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error response: ${errorText}`);
      return;
    }
    
    const result = await response.json();
    console.log(`✅ Success response:`, result);
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error(`❌ Error name: ${error.name}`);
    console.error(`❌ Error message: ${error.message}`);
    console.error(`❌ Error stack: ${error.stack}`);
  }
  
  console.log('=====================================');
  console.log('🏁 DISCORD BOT TEST COMPLETE');
};

testDiscordBot(); 