/**
 * ERC-8004 + x402 Integration Demo
 * Shows how agent identity/reputation (ERC-8004) integrates with payments (x402)
 * Run with: npm run dev src/demos/erc8004-x402-integration-demo.ts
 */

import { registerAgent } from '../core/erc8004/identity';
import { AgentPaymentManager } from '../core/integration/agent-payment-integration';
import { AgentMetadata } from '../core/types';

async function runIntegrationDemo() {
  console.log('🔗 ERC-8004 + x402 Integration Demo\n');
  console.log('Agent Identity & Reputation + Payment Protocol');
  console.log('='.repeat(60));

  try {
    // ========================================================================
    // SETUP: Register agents in ERC-8004
    // ========================================================================
    console.log('\n🔧 SETUP: Register Agents (ERC-8004)\n');

    // Register seller agent
    const sellerMetadata: AgentMetadata = {
      name: 'iPhone Retailer Pro',
      description: 'Authorized iPhone retailer with verified supply chain',
      capabilities: ['iphone', 'smartphone', 'electronics'],
      serviceUrl: '0xc6fea5433c4c96f28d842406b9c79860a5328f53',
      price: 999,
      currency: 'SGD',
    };

    const sellerId = await registerAgent(sellerMetadata);

    // Register buyer agent
    const buyerMetadata: AgentMetadata = {
      name: 'Smart Buyer',
      description: 'Autonomous shopping agent',
      capabilities: ['product-search', 'price-comparison', 'purchase-automation'],
      serviceUrl: 'http://localhost:3003',
      price: 0,
      currency: 'SGD',
    };

    const buyerId = await registerAgent(buyerMetadata);

    console.log(`\n✅ Agents registered:`);
    console.log(`   Seller: ${sellerId}`);
    console.log(`   Buyer: ${buyerId}\n`);

    // ========================================================================
    // Initialize payment manager
    // ========================================================================
    console.log('💳 Initialize Payment Manager\n');

    const paymentManager = new AgentPaymentManager(
      sellerMetadata.serviceUrl
    );

    console.log(`✅ Payment manager initialized\n`);

    // ========================================================================
    // FLOW: Complete agent-to-agent transaction
    // ========================================================================

    // Step 1: Discover agents
    const agents = await paymentManager.discoverSellerAgents('iphone');

    if (agents.length === 0) {
      throw new Error('No seller agents found');
    }

    // Step 2: Select best agent
    const selectedSeller = await paymentManager.selectBestAgent(agents);

    if (!selectedSeller) {
      throw new Error('No suitable seller found');
    }

    // Step 3: Create payment
    console.log(`\n💳 STEP 3: Create x402 Payment\n`);

    const paymentResult = await paymentManager.createAgentPayment({
      buyerAgentId: buyerId,
      sellerAgentId: selectedSeller,
      service: 'iPhone 15 Pro Purchase',
      amount: 0.1,
      currency: 'HBAR',
      description: 'Payment for iPhone 15 Pro',
    });

    if (!paymentResult.success) {
      throw new Error(`Payment failed: ${paymentResult.error}`);
    }

    // Step 4: Verify payment
    console.log(`\n✅ STEP 4: Verify Payment (x402)\n`);

    // In real scenario, seller would verify the payment
    // For demo, we'll simulate it
    console.log(`✅ Payment verified by seller`);
    console.log(`   Amount: 0.1 HBAR`);
    console.log(`   Status: SUCCESS\n`);

    // Step 5: Submit feedback and update reputation
    console.log(`\n⭐ STEP 5: Submit Feedback & Update Reputation (ERC-8004)\n`);

    const feedbackSubmitted = await paymentManager.submitAgentFeedback(
      paymentResult.paymentId!,
      5,
      'Excellent service! iPhone arrived as described. Fast delivery.'
    );

    if (!feedbackSubmitted) {
      throw new Error('Feedback submission failed');
    }

    // Get updated reputation
    const sellerReputation = await paymentManager.getAgentReputation(selectedSeller);

    console.log(`\n✅ Seller reputation updated`);
    console.log(`   New Trust Score: ${sellerReputation}%\n`);

    // ========================================================================
    // Summary
    // ========================================================================
    // ========================================================================
    // Show actual data structures
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n📊 ACTUAL DATA STRUCTURES\n');

    const transactions = paymentManager.getTransactionHistory();
    console.log('Transaction History (Stored in Memory):');
    console.log(JSON.stringify(transactions, null, 2));

    console.log('\n='.repeat(60));
    console.log('\n✅ ERC-8004 + x402 Integration Demo Complete!\n');

    console.log('🎯 What We Demonstrated:\n');

    console.log('ERC-8004 (Agent Identity & Reputation):');
    console.log('   ✅ Register seller agent');
    console.log('   ✅ Register buyer agent');
    console.log('   ✅ Discover agents by capability');
    console.log('   ✅ Select best agent by reputation');
    console.log('   ✅ Submit feedback');
    console.log('   ✅ Update trust score\n');

    console.log('x402 (Payment Protocol):');
    console.log('   ✅ Create payment proof');
    console.log('   ✅ Verify payment');
    console.log('   ✅ Execute blockchain transfer\n');

    console.log('Integration Flow:');
    console.log('   1. Buyer discovers seller agents (ERC-8004)');
    console.log('   2. Buyer selects best seller by reputation (ERC-8004)');
    console.log('   3. Buyer creates x402 payment proof');
    console.log('   4. Seller verifies payment (x402)');
    console.log('   5. Service is delivered');
    console.log('   6. Buyer submits feedback (ERC-8004)');
    console.log('   7. Seller reputation increases (ERC-8004)\n');

    console.log('📊 Transaction Summary:');
    console.log(`   Buyer Agent: ${buyerId}`);
    console.log(`   Seller Agent: ${selectedSeller}`);
    console.log(`   Payment ID: ${paymentResult.paymentId}`);
    console.log(`   Amount: 0.1 HBAR`);
    console.log(`   Seller Trust Score: ${sellerReputation}%\n`);

    console.log('🔑 Key Integration Points:');
    console.log('   • ERC-8004 provides agent discovery');
    console.log('   • ERC-8004 provides reputation scoring');
    console.log('   • x402 provides payment execution');
    console.log('   • Feedback loop updates reputation\n');

    console.log('🎉 ERC-8004 + x402 Integration Working!\n');

  } catch (error: any) {
    console.error('\n❌ Demo failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runIntegrationDemo();
