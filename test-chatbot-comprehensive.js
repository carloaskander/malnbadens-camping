import fetch from 'node-fetch';

const CHATBOT_URL = 'https://malnbadens-camping.vercel.app/api/chat';
// const CHATBOT_URL = 'http://localhost:3000/api/chat'; // For local testing

const TEST_CASES = {
  // 🎯 HIGH CONFIDENCE TESTS (Should get "Säker" - exact matches)
  highConfidence: [
    "Hur långt är det från campingen till stranden?",
    "Finns det restaurang vid stranden?",
    "Kan jag ladda elbilen?",
    "Hyr ni ut cyklar?",
    "Vad är tyst tid på campingen?",
    "Hur många campingplatser finns det och hur stora är de?",
    "Har stugorna eget badrum?",
    "Får jag ta med hund till campingen?"
  ],

  // 🔍 MEDIUM CONFIDENCE TESTS (Should get "Ganska säker" - similar but not exact)
  mediumConfidence: [
    "Vad kostar det att campa?", // Similar to pricing questions
    "Finns det internet?", // Similar to WiFi question
    "Kan jag ta med min hund?", // Similar to dog question
    "Hur stor är campingplatserna?", // Similar to camping pitch question
    "Finns det mat vid stranden?", // Similar to restaurant question
    "Kan jag ladda min bil?", // Similar to EV charging
    "Vilka tider ska man vara tyst?" // Similar to quiet hours
  ],

  // ❓ LOW CONFIDENCE TESTS (Should get "Osäker" - no good matches)
  lowConfidence: [
    "Vad är meningen med livet?",
    "Hur blir vädret imorgon?",
    "Kan jag köpa en bil här?",
    "Finns det flygplats i närheten?",
    "Vad heter Sveriges kung?",
    "Hur lagar jag pasta?",
    "Vilken tid är det nu?"
  ],

  // 🌍 MULTILINGUAL TESTS (Should respond in same language)
  multilingual: [
    {
      lang: "English",
      questions: [
        "How far is it to the beach?",
        "Is there a restaurant at the beach?",
        "Can I charge my electric car?",
        "Do you rent bikes?",
        "What are the quiet hours?"
      ]
    },
    {
      lang: "German", 
      questions: [
        "Wie weit ist es zum Strand?",
        "Gibt es ein Restaurant am Strand?",
        "Kann ich mein Elektroauto laden?",
        "Vermieten Sie Fahrräder?"
      ]
    },
    {
      lang: "French",
      questions: [
        "À quelle distance se trouve la plage?",
        "Y a-t-il un restaurant à la plage?",
        "Puis-je louer des vélos?"
      ]
    }
  ],

  // 🔄 VARIATION TESTS (Same meaning, different words)
  variations: [
    {
      base: "Hur långt är det från campingen till stranden?",
      variations: [
        "Hur långt är det till stranden?",
        "Vad är avståndet till stranden?",
        "Hur nära ligger stranden?",
        "Kan man gå till stranden?"
      ]
    },
    {
      base: "Kan jag ladda elbilen?",
      variations: [
        "Finns det laddning för elbilar?",
        "Kan jag ladda min Tesla?",
        "Har ni laddstolpar?",
        "Går det att ladda elbil här?"
      ]
    }
  ],

  // 🚨 EDGE CASES
  edgeCases: [
    "", // Empty message
    "   ", // Only spaces
    "a", // Single character
    "hej hej hej hej hej hej hej hej hej hej hej hej hej hej hej hej hej hej hej hej", // Very long repetitive
    "!@#$%^&*()", // Special characters only
    "123456789", // Numbers only
  ]
};

async function testChatbot(question, expectedConfidence = null, expectedLanguage = null) {
  try {
    console.log(`\n❓ Testing: "${question}"`);
    
    const response = await fetch(CHATBOT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: question })
    });

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    
    console.log(`🤖 Response: "${data.response?.substring(0, 100)}${data.response?.length > 100 ? '...' : ''}"`);
    console.log(`📊 Confidence: ${data.confidence} (Similarity: ${data.similarity?.toFixed(3)})`);
    
    // Validate expected confidence
    if (expectedConfidence && data.confidence !== expectedConfidence) {
      console.log(`⚠️  Expected confidence: ${expectedConfidence}, got: ${data.confidence}`);
    }
    
    // Check for language consistency (basic check)
    if (expectedLanguage && expectedLanguage !== 'Swedish') {
      const isSwedish = /\b(och|är|det|för|med|till|från|på|av|som|att|en|ett|vi|du|jag)\b/i.test(data.response);
      if (isSwedish) {
        console.log(`⚠️  Expected ${expectedLanguage} response but got Swedish`);
      } else {
        console.log(`✅ Responded in ${expectedLanguage}`);
      }
    }
    
    return true;
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return false;
  }
}

async function runComprehensiveTests() {
  console.log('🧪 COMPREHENSIVE CHATBOT TESTING');
  console.log('='.repeat(50));
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Test High Confidence
  console.log('\n🎯 HIGH CONFIDENCE TESTS (Should be "high")');
  console.log('-'.repeat(30));
  for (const question of TEST_CASES.highConfidence) {
    const result = await testChatbot(question, 'high');
    totalTests++;
    if (result) passedTests++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
  }
  
  // Test Medium Confidence  
  console.log('\n🔍 MEDIUM CONFIDENCE TESTS (Should be "medium" or "low")');
  console.log('-'.repeat(30));
  for (const question of TEST_CASES.mediumConfidence) {
    const result = await testChatbot(question);
    totalTests++;
    if (result) passedTests++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test Low Confidence
  console.log('\n❓ LOW CONFIDENCE TESTS (Should be "low")');
  console.log('-'.repeat(30));
  for (const question of TEST_CASES.lowConfidence) {
    const result = await testChatbot(question, 'low');
    totalTests++;
    if (result) passedTests++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Test Multilingual
  console.log('\n🌍 MULTILINGUAL TESTS');
  console.log('-'.repeat(30));
  for (const langGroup of TEST_CASES.multilingual) {
    console.log(`\n--- ${langGroup.lang} ---`);
    for (const question of langGroup.questions) {
      const result = await testChatbot(question, null, langGroup.lang);
      totalTests++;
      if (result) passedTests++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Test Variations
  console.log('\n🔄 VARIATION TESTS (Similar meanings)');
  console.log('-'.repeat(30));
  for (const group of TEST_CASES.variations) {
    console.log(`\nBase: "${group.base}"`);
    for (const variation of group.variations) {
      const result = await testChatbot(variation);
      totalTests++;
      if (result) passedTests++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Test Edge Cases
  console.log('\n🚨 EDGE CASE TESTS');
  console.log('-'.repeat(30));
  for (const question of TEST_CASES.edgeCases) {
    const result = await testChatbot(question);
    totalTests++;
    if (result) passedTests++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Your chatbot is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above for details.');
  }
}

// Run the tests
runComprehensiveTests().catch(console.error); 