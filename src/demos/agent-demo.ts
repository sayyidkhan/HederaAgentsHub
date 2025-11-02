/**
 * Agent Demo - Using BaseAgent framework
 * Run with: npm run dev src/demos/agent-demo.ts
 */

import { WeatherAgent, DataAnalyzerAgent } from '../agents';

async function runAgentDemo() {
  console.log('🎯 Agent Framework Demo\n');
  console.log('=' .repeat(60));

  try {
    // ========================================================================
    // STEP 1: Create and start agents
    // ========================================================================
    console.log('\n🚀 STEP 1: Initialize Agents\n');

    const weatherBot = new WeatherAgent();
    const dataBot = new DataAnalyzerAgent();

    await weatherBot.start();
    await dataBot.start();

    // ========================================================================
    // STEP 2: Weather bot provides service
    // ========================================================================
    console.log('\n🌤️  STEP 2: Weather Bot Service\n');

    const weather = await weatherBot.getCurrentWeather('Singapore');
    console.log(`Weather in ${weather.location}:`);
    console.log(`   Temperature: ${weather.temperature}°C`);
    console.log(`   Condition: ${weather.condition}`);
    console.log(`   Humidity: ${weather.humidity}%\n`);

    // ========================================================================
    // STEP 3: Data bot submits feedback for weather bot
    // ========================================================================
    console.log('⭐ STEP 3: Submit Feedback\n');

    const feedbackId = await dataBot.submitFeedback(
      weatherBot.getAgentId()!,
      5,
      'Excellent weather data! Very accurate.',
      '0x402_proof_1'
    );

    console.log(`Feedback submitted: ${feedbackId}\n`);

    // ========================================================================
    // STEP 4: Check weather bot reputation
    // ========================================================================
    console.log('📊 STEP 4: Check Reputation\n');

    const reputation = await weatherBot.getReputation();
    console.log(`Weather Bot Reputation:`);
    console.log(`   Average Rating: ${reputation?.averageRating}/5`);
    console.log(`   Total Reviews: ${reputation?.totalReviews}`);
    console.log(`   Trust Score: ${reputation?.trustScore}%`);
    console.log(`   Trustworthy: ${await weatherBot.isTrustworthy()}\n`);

    // ========================================================================
    // STEP 5: Data bot provides service
    // ========================================================================
    console.log('\n📊 STEP 5: Data Analyzer Service\n');

    const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const analysis = await dataBot.analyzeStats(data);

    console.log(`Data Analysis Results:`);
    console.log(`   Mean: ${analysis.mean}`);
    console.log(`   Median: ${analysis.median}`);
    console.log(`   Sum: ${analysis.sum}`);
    console.log(`   Min: ${analysis.min}`);
    console.log(`   Max: ${analysis.max}`);
    console.log(`   Count: ${analysis.count}\n`);

    // ========================================================================
    // STEP 6: Weather bot submits feedback for data bot
    // ========================================================================
    console.log('⭐ STEP 6: Return Feedback\n');

    const feedback2 = await weatherBot.submitFeedback(
      dataBot.getAgentId()!,
      5,
      'Great data analysis service!',
      '0x402_proof_2'
    );

    console.log(`Feedback submitted: ${feedback2}\n`);

    // ========================================================================
    // STEP 7: Request validation
    // ========================================================================
    console.log('🔍 STEP 7: Request Validation\n');

    const validationId = await weatherBot.requestValidation(
      'stake-re-execution',
      'Verify weather data accuracy for Singapore',
      1000000000000000000
    );

    console.log(`Validation requested: ${validationId}\n`);

    // ========================================================================
    // STEP 8: Submit validation result
    // ========================================================================
    console.log('✔️  STEP 8: Submit Validation Result\n');

    await dataBot.submitValidationResult(
      validationId,
      true,
      'Verified: Weather data matches expected values'
    );

    // ========================================================================
    // STEP 9: Check validation scores
    // ========================================================================
    console.log('📊 STEP 9: Check Validation Scores\n');

    const valScore = await weatherBot.getValidationScore();
    console.log(`Weather Bot Validation:`);
    console.log(`   Total Validations: ${valScore?.totalValidations}`);
    console.log(`   Passed: ${valScore?.passedValidations}`);
    console.log(`   Confidence: ${valScore?.validationScore}%`);
    console.log(`   Validated: ${await weatherBot.isValidated()}\n`);

    // ========================================================================
    // STEP 10: Log final status
    // ========================================================================
    console.log('📋 STEP 10: Final Status\n');

    await weatherBot.logStatus();
    await dataBot.logStatus();

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('=' .repeat(60));
    console.log('\n✅ Agent Demo Complete!\n');
    console.log('📚 What We Demonstrated:');
    console.log('   1. ✅ Agent registration (BaseAgent)');
    console.log('   2. ✅ Service provision (WeatherAgent, DataAnalyzerAgent)');
    console.log('   3. ✅ Feedback submission (Agent-to-Agent)');
    console.log('   4. ✅ Reputation tracking');
    console.log('   5. ✅ Validation requests');
    console.log('   6. ✅ Validation submission');
    console.log('   7. ✅ Trust and confidence scoring');
    console.log('   8. ✅ Autonomous agent interactions\n');
    console.log('🎉 Agents successfully interacted autonomously!\n');

    // Stop agents
    await weatherBot.stop();
    await dataBot.stop();

  } catch (error: any) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

runAgentDemo();
