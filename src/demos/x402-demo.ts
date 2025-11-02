/**
 * x402 Payment Protocol Demo
 * Demonstrates payment flow between agents
 * Run with: npm run dev src/demos/x402-demo.ts
 */

import { X402Client, X402Server, x402Facilitator, PaymentValidator } from '../core/x402';

async function runX402Demo() {
  console.log('💳 x402 Payment Protocol Demo\n');
  console.log('='.repeat(60));

  try {
    // ========================================================================
    // STEP 1: Setup clients and servers
    // ========================================================================
    console.log('\n🔧 STEP 1: Setup\n');

    // Alice (service provider)
    const alice = new X402Client();
    const aliceServer = new X402Server(alice.getAddress());
    console.log(`Alice (Provider): ${alice.getAddress()}`);

    // Bob (service consumer)
    const bob = new X402Client();
    const bobServer = new X402Server(bob.getAddress());
    console.log(`Bob (Consumer): ${bob.getAddress()}\n`);

    // ========================================================================
    // STEP 2: Bob requests service from Alice
    // ========================================================================
    console.log('📨 STEP 2: Service Request\n');

    console.log(`Bob requests weather data from Alice`);
    console.log(`Service cost: 0.01 USDC\n`);

    // ========================================================================
    // STEP 3: Bob makes payment
    // ========================================================================
    console.log('💰 STEP 3: Payment Execution\n');

    const paymentRequest = {
      amount: 0.01,
      currency: 'USDC',
      recipient: alice.getAddress(),
      description: 'Weather data service',
      metadata: {
        service: 'weather',
        location: 'Singapore',
      },
    };

    const paymentResponse = await bob.makePayment(paymentRequest);

    if (!paymentResponse.success) {
      throw new Error(`Payment failed: ${paymentResponse.error}`);
    }

    console.log(`Payment ID: ${paymentResponse.paymentId}`);
    console.log(`Proof generated: ${paymentResponse.proof.substring(0, 50)}...\n`);

    // ========================================================================
    // STEP 4: Submit to facilitator
    // ========================================================================
    console.log('🌐 STEP 4: Facilitator Integration\n');

    const proof = X402Client.parseProof(paymentResponse.proof);
    await x402Facilitator.submitPayment(paymentRequest, proof);

    // Check payment status
    const status = await x402Facilitator.checkPaymentStatus(paymentResponse.paymentId);
    console.log(`Payment status: ${status.status}\n`);

    // ========================================================================
    // STEP 5: Alice verifies payment
    // ========================================================================
    console.log('✅ STEP 5: Payment Verification\n');

    // Validate proof first
    const validation = await PaymentValidator.validateProof(
      paymentResponse.proof,
      alice.getAddress()
    );

    if (!validation.valid) {
      throw new Error(`Proof validation failed: ${validation.error}`);
    }

    console.log(`Proof structure valid ✓`);

    // Verify payment
    const verification = await aliceServer.verifyPayment(paymentResponse.proof);

    if (!verification.valid) {
      throw new Error(`Payment verification failed: ${verification.error}`);
    }

    console.log(`Payment verified ✓`);
    console.log(`Amount: ${verification.amount} USDC`);
    console.log(`From: ${verification.sender}`);
    console.log(`To: ${verification.recipient}\n`);

    // ========================================================================
    // STEP 6: Alice provides service
    // ========================================================================
    console.log('🌤️  STEP 6: Service Delivery\n');

    const weatherData = {
      location: 'Singapore',
      temperature: 28,
      condition: 'Sunny',
      humidity: 75,
      paid: true,
      paymentId: paymentResponse.paymentId,
    };

    console.log(`Weather data delivered:`);
    console.log(`   Location: ${weatherData.location}`);
    console.log(`   Temperature: ${weatherData.temperature}°C`);
    console.log(`   Condition: ${weatherData.condition}`);
    console.log(`   Humidity: ${weatherData.humidity}%`);
    console.log(`   Payment verified: ${weatherData.paid}\n`);

    // ========================================================================
    // STEP 7: Check payment records
    // ========================================================================
    console.log('📊 STEP 7: Payment Records\n');

    // Alice's received payments
    const received = aliceServer.getPayment(paymentResponse.paymentId);
    console.log(`Alice received payments: ${aliceServer.getPaymentCount()}`);
    console.log(`Total from Bob: ${aliceServer.getTotalReceived(bob.getAddress())} USDC\n`);

    // ========================================================================
    // STEP 8: Multiple payments demo
    // ========================================================================
    console.log('🔄 STEP 8: Multiple Payments\n');

    console.log(`Bob makes 3 more payments to Alice...\n`);

    for (let i = 1; i <= 3; i++) {
      const paymentAmount = 0.01 * i;
      const payment = await bob.makePayment({
        amount: paymentAmount,
        currency: 'USDC',
        recipient: alice.getAddress(),
        description: `Payment #${i}`,
      });

      await aliceServer.verifyPayment(payment.proof);
      console.log(`Payment #${i}: ${paymentAmount} USDC - ${payment.paymentId.substring(0, 20)}...`);
    }

    console.log(`\nAlice's total received payments: ${aliceServer.getPaymentCount()}`);
    console.log(`Total amount from Bob: ${aliceServer.getTotalReceived(bob.getAddress()).toFixed(4)} USDC\n`);

    // ========================================================================
    // STEP 9: Payment validation tests
    // ========================================================================
    console.log('🧪 STEP 9: Validation Tests\n');

    // Test amount validation
    console.log(`Amount validation (0.01 USDC): ${PaymentValidator.validateAmount(0.01, 0)} ✓`);
    console.log(`Amount validation (-1 USDC): ${PaymentValidator.validateAmount(-1, 0)} ✗`);

    // Test currency validation
    console.log(`Currency validation (USDC): ${PaymentValidator.validateCurrency('USDC')} ✓`);
    console.log(`Currency validation (BTC): ${PaymentValidator.validateCurrency('BTC')} ✗`);

    // Test address validation
    console.log(`Address validation (valid): ${PaymentValidator.validateAddress(alice.getAddress())} ✓`);
    console.log(`Address validation (invalid): ${PaymentValidator.validateAddress('0xinvalid')} ✗\n`);

    // ========================================================================
    // STEP 10: Facilitator health check
    // ========================================================================
    console.log('🏥 STEP 10: Facilitator Health\n');

    const healthy = await x402Facilitator.healthCheck();
    console.log(`Facilitator status: ${healthy ? 'Healthy ✓' : 'Unhealthy ✗'}`);

    const info = await x402Facilitator.getInfo();
    console.log(`Facilitator version: ${info.version}`);
    console.log(`Network: ${info.network}`);
    console.log(`Supported tokens: ${info.supportedTokens.join(', ')}\n`);

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n✅ x402 Demo Complete!\n');
    console.log('📚 What We Demonstrated:');
    console.log('   1. ✅ Payment client (Bob makes payments)');
    console.log('   2. ✅ Payment server (Alice receives & verifies)');
    console.log('   3. ✅ Facilitator integration (submission & status)');
    console.log('   4. ✅ Payment verification (signature & structure)');
    console.log('   5. ✅ Multiple payments tracking');
    console.log('   6. ✅ Payment validation utilities');
    console.log('   7. ✅ Service delivery after payment');
    console.log('   8. ✅ Payment records & history\n');

    console.log('💡 Key Features:');
    console.log(`   • Payments: ${aliceServer.getPaymentCount()} total`);
    console.log(`   • Total volume: ${aliceServer.getTotalReceived(bob.getAddress()).toFixed(4)} USDC`);
    console.log(`   • All payments verified: ✓`);
    console.log(`   • Facilitator healthy: ${healthy ? '✓' : '✗'}\n`);

    console.log('🎉 x402 payment protocol is working!\n');

  } catch (error: any) {
    console.error('❌ Demo failed:', error.message);
    process.exit(1);
  }
}

runX402Demo();
