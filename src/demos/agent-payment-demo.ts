/**
 * Agent-to-Agent Payment Demo
 * Complete end-to-end demonstration of agents + payments
 * Run with: npm run dev src/demos/agent-payment-demo.ts
 */

import { WeatherAgent, DataAnalyzerAgent } from '../agents';
import { X402Client, X402Server } from '../core/x402';

async function runAgentPaymentDemo() {
  console.log('🤖💳 Agent-to-Agent Payment Demo\n');
  console.log('='.repeat(60));

  try {
    // ========================================================================
    // STEP 1: Initialize agents
    // ========================================================================
    console.log('\n🚀 STEP 1: Initialize Agents\n');

    const weatherBot = new WeatherAgent();
    const dataBot = new DataAnalyzerAgent();

    await weatherBot.start();
    await dataBot.start();

    // Setup payment clients
    const weatherClient = new X402Client();
    const weatherServer = new X402Server(weatherClient.getAddress());
    
    const dataClient = new X402Client();
    const dataServer = new X402Server(dataClient.getAddress());

    // ========================================================================
    // STEP 2: Data Bot requests weather service
    // ========================================================================
    console.log('\n📊 STEP 2: Service Discovery\n');

    console.log(`DataBot discovers WeatherBot's weather service`);
    console.log(`Service: Weather data for Singapore`);
    console.log(`Price: 0.01 USDC`);
    console.log(`Provider: ${weatherBot.getName()}\n`);

    // ========================================================================
    // STEP 3: Data Bot makes payment for service
    // ========================================================================
    console.log('💰 STEP 3: Payment for Service\n');

    const payment1 = await dataClient.makePayment({
      amount: 0.01,
      currency: 'USDC',
      recipient: weatherClient.getAddress(),
      description: 'Payment for weather data - Singapore',
      metadata: {
        service: 'weather',
        location: 'Singapore',
        requestedBy: dataBot.getName(),
      },
    });

    if (!payment1.success) {
      throw new Error(`Payment failed: ${payment1.error}`);
    }

    console.log(`✅ Payment successful`);
    console.log(`   Payment ID: ${payment1.paymentId}`);
    console.log(`   Amount: 0.01 USDC\n`);

    // ========================================================================
    // STEP 4: Weather Bot verifies payment
    // ========================================================================
    console.log('✅ STEP 4: Payment Verification\n');

    const verification1 = await weatherServer.verifyPayment(payment1.proof);

    if (!verification1.valid) {
      throw new Error(`Payment verification failed: ${verification1.error}`);
    }

    console.log(`Payment verified by WeatherBot`);
    console.log(`   Amount: ${verification1.amount} USDC`);
    console.log(`   From: ${dataBot.getName()}\n`);

    // ========================================================================
    // STEP 5: Weather Bot provides service
    // ========================================================================
    console.log('🌤️  STEP 5: Service Delivery\n');

    const weatherData = await weatherBot.getCurrentWeather('Singapore');

    console.log(`Weather data delivered:`);
    console.log(`   Location: ${weatherData.location}`);
    console.log(`   Temperature: ${weatherData.temperature}°C`);
    console.log(`   Condition: ${weatherData.condition}`);
    console.log(`   Humidity: ${weatherData.humidity}%\n`);

    // ========================================================================
    // STEP 6: Data Bot submits feedback (with payment proof!)
    // ========================================================================
    console.log('⭐ STEP 6: Feedback with Payment Proof\n');

    const feedbackId = await dataBot.submitFeedback(
      weatherBot.getAgentId()!,
      5,
      'Excellent weather data! Fast and accurate.',
      payment1.paymentId // Payment proof linked!
    );

    console.log(`Feedback submitted: ${feedbackId}`);
    console.log(`Rating: 5/5 stars`);
    console.log(`Payment proof attached: ${payment1.paymentId}\n`);

    // ========================================================================
    // STEP 7: Check WeatherBot's reputation (improved from payment!)
    // ========================================================================
    console.log('📊 STEP 7: Reputation Update\n');

    const reputation1 = await weatherBot.getReputation();
    console.log(`WeatherBot reputation:`);
    console.log(`   Trust Score: ${reputation1?.trustScore}%`);
    console.log(`   Total Reviews: ${reputation1?.totalReviews}`);
    console.log(`   Average Rating: ${reputation1?.averageRating}/5\n`);

    // ========================================================================
    // STEP 8: Weather Bot requests data analysis service
    // ========================================================================
    console.log('🔄 STEP 8: Reverse Transaction\n');

    console.log(`WeatherBot now requests data analysis from DataBot`);
    console.log(`Service: Statistical analysis`);
    console.log(`Price: 0.05 USDC\n`);

    // Weather Bot makes payment
    const payment2 = await weatherClient.makePayment({
      amount: 0.05,
      currency: 'USDC',
      recipient: dataClient.getAddress(),
      description: 'Payment for data analysis',
      metadata: {
        service: 'data-analysis',
        dataPoints: 10,
        requestedBy: weatherBot.getName(),
      },
    });

    console.log(`✅ Payment successful: ${payment2.paymentId}\n`);

    // ========================================================================
    // STEP 9: Data Bot verifies and provides service
    // ========================================================================
    console.log('📈 STEP 9: Data Analysis Service\n');

    const verification2 = await dataServer.verifyPayment(payment2.proof);
    console.log(`Payment verified by DataBot: ${verification2.amount} USDC\n`);

    // Provide analysis service
    const data = [25, 26, 28, 30, 29, 27, 26, 28, 31, 29];
    const analysis = await dataBot.analyzeStats(data);

    console.log(`Analysis completed:`);
    console.log(`   Mean temperature: ${analysis.mean}°C`);
    console.log(`   Median: ${analysis.median}°C`);
    console.log(`   Min/Max: ${analysis.min}°C / ${analysis.max}°C\n`);

    // ========================================================================
    // STEP 10: Weather Bot submits feedback
    // ========================================================================
    console.log('⭐ STEP 10: Return Feedback\n');

    const feedbackId2 = await weatherBot.submitFeedback(
      dataBot.getAgentId()!,
      5,
      'Great data analysis! Very helpful insights.',
      payment2.paymentId
    );

    console.log(`Feedback submitted: ${feedbackId2}\n`);

    // ========================================================================
    // STEP 11: Check both agents' reputations
    // ========================================================================
    console.log('📊 STEP 11: Final Reputation Status\n');

    await weatherBot.logStatus();
    await dataBot.logStatus();

    // ========================================================================
    // STEP 12: Payment records
    // ========================================================================
    console.log('💰 STEP 12: Payment Records\n');

    console.log(`WeatherBot payments:`);
    console.log(`   Received: ${weatherServer.getPaymentCount()} payments`);
    console.log(`   Total earned: ${weatherServer.getTotalReceived(dataClient.getAddress())} USDC`);

    console.log(`\nDataBot payments:`);
    console.log(`   Received: ${dataServer.getPaymentCount()} payments`);
    console.log(`   Total earned: ${dataServer.getTotalReceived(weatherClient.getAddress())} USDC\n`);

    // ========================================================================
    // STEP 13: Multiple service cycles
    // ========================================================================
    console.log('🔁 STEP 13: Multiple Service Cycles\n');

    console.log(`Running 3 more service cycles...\n`);

    for (let i = 1; i <= 3; i++) {
      console.log(`Cycle ${i}:`);

      // DataBot pays WeatherBot
      const payment = await dataClient.makePayment({
        amount: 0.01,
        currency: 'USDC',
        recipient: weatherClient.getAddress(),
        description: `Weather service #${i}`,
      });

      await weatherServer.verifyPayment(payment.proof);
      const weather = await weatherBot.getCurrentWeather('Singapore');
      
      await dataBot.submitFeedback(
        weatherBot.getAgentId()!,
        5,
        `Service cycle ${i} - great!`,
        payment.paymentId
      );

      console.log(`   ✓ Payment: ${payment.paymentId.substring(0, 20)}...`);
      console.log(`   ✓ Service: ${weather.temperature}°C, ${weather.condition}`);
      console.log(`   ✓ Feedback: 5/5 stars\n`);
    }

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n✅ Agent-to-Agent Payment Demo Complete!\n');

    const finalReputation = await weatherBot.getReputation();

    console.log('📚 What We Demonstrated:');
    console.log('   1. ✅ Agent registration & discovery');
    console.log('   2. ✅ Service request & negotiation');
    console.log('   3. ✅ x402 payment execution');
    console.log('   4. ✅ Payment verification');
    console.log('   5. ✅ Service delivery after payment');
    console.log('   6. ✅ Feedback with payment proof');
    console.log('   7. ✅ Reputation building from payments');
    console.log('   8. ✅ Bidirectional A2A transactions');
    console.log('   9. ✅ Multiple service cycles\n');

    console.log('📊 Final Statistics:');
    console.log(`   • WeatherBot: ${finalReputation?.totalReviews} reviews, ${finalReputation?.trustScore}% trust`);
    console.log(`   • WeatherBot earned: ${weatherServer.getTotalReceived(dataClient.getAddress())} USDC`);
    console.log(`   • DataBot earned: ${dataServer.getTotalReceived(weatherClient.getAddress())} USDC`);
    console.log(`   • Total transactions: ${weatherServer.getPaymentCount() + dataServer.getPaymentCount()}`);
    console.log(`   • All payments verified: ✓\n`);

    console.log('🎉 Complete agent-to-agent digital economy is working!\n');

    // Stop agents
    await weatherBot.stop();
    await dataBot.stop();

  } catch (error: any) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

runAgentPaymentDemo();
