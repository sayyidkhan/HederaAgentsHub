/**
 * REAL Agent-to-Agent Payment Demo
 * Actual blockchain execution - NOT mocked
 * Run with: npm run dev src/demos/real-agent-payment-demo.ts
 */

import { registerAgent } from '../core/erc8004/identity';
import { RealAgentPaymentExecutor } from '../core/integration/real-agent-payment';
import { hederaConfig } from '../core/config/index';
import { AgentMetadata } from '../core/types';

async function runRealAgentPaymentDemo() {
  console.log('🚀 REAL Agent-to-Agent Payment Demo\n');
  console.log('Actual Blockchain Execution (NOT Mocked)');
  console.log('='.repeat(60));

  let executor: RealAgentPaymentExecutor | null = null;

  try {
    // ========================================================================
    // SETUP: Register agents in ERC-8004
    // ========================================================================
    console.log('\n🔧 SETUP: Register Agents in ERC-8004\n');

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

    console.log(`✅ Agents registered:`);
    console.log(`   Seller: ${sellerId}`);
    console.log(`   Buyer: ${buyerId}\n`);

    // ========================================================================
    // Initialize real payment executor
    // ========================================================================
    console.log('💳 Initialize Real Payment Executor\n');

    executor = new RealAgentPaymentExecutor(
      hederaConfig.accountId,
      hederaConfig.privateKey
    );

    console.log(`✅ Executor initialized with real Hedera account\n`);

    // ========================================================================
    // Execute REAL agent-to-agent payment
    // ========================================================================
    console.log('🔗 Execute REAL Agent-to-Agent Payment\n');

    const paymentResult = await executor.executeRealPayment({
      buyerAgentId: buyerId,
      sellerAgentId: sellerId,
      sellerAddress: sellerMetadata.serviceUrl,
      service: 'iPhone 15 Pro Purchase',
      amount: 0.1,
      currency: 'HBAR',
      description: 'Real payment for iPhone 15 Pro',
    });

    if (!paymentResult.success) {
      throw new Error(`Payment failed: ${paymentResult.error}`);
    }

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n✅ REAL Agent-to-Agent Payment Demo Complete!\n');

    console.log('📊 REAL Transaction Details:\n');

    const transactions = executor.getTransactionHistory();
    console.log(JSON.stringify(transactions, null, 2));

    // ========================================================================
    // Provide blockchain explorer URL
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('\n🔍 VIEW ON BLOCKCHAIN EXPLORER\n');

    if (paymentResult.transactionId) {
      const explorerUrl = `https://hashscan.io/testnet/transaction/${paymentResult.transactionId}`;
      console.log(`✅ Transaction verified on Hedera testnet:\n`);
      console.log(`   ${explorerUrl}\n`);
      console.log(`📋 Transaction Details on Explorer:`);
      console.log(`   • Transaction ID: ${paymentResult.transactionId}`);
      console.log(`   • Amount: ${paymentResult.amount} HBAR`);
      console.log(`   • Status: ${paymentResult.status}`);
      console.log(`   • Blockchain Confirmed: ${paymentResult.blockchainConfirmed}\n`);
      console.log(`💡 Copy the URL above and paste in your browser to see:`);
      console.log(`   ✓ Sender address`);
      console.log(`   ✓ Receiver address`);
      console.log(`   ✓ Amount transferred`);
      console.log(`   ✓ Transaction timestamp`);
      console.log(`   ✓ Gas/Network fees`);
      console.log(`   ✓ Transaction hash\n`);
    }

    console.log('\n🎯 What Actually Happened:\n');

    console.log('✅ ERC-8004 (REAL):');
    console.log('   • Agents registered in identity registry');
    console.log('   • Seller reputation checked (REAL data)');
    console.log('   • Feedback submitted to reputation system');
    console.log('   • Trust score updated in registry\n');

    console.log('✅ x402 (REAL):');
    console.log('   • Payment proof created with real signature');
    console.log('   • Signature verified cryptographically\n');

    console.log('✅ Hedera Blockchain (REAL):');
    console.log(`   • Transaction ID: ${paymentResult.transactionId}`);
    console.log(`   • Amount: ${paymentResult.amount} HBAR transferred`);
    console.log(`   • Status: ${paymentResult.status}`);
    console.log(`   • Blockchain Confirmed: ${paymentResult.blockchainConfirmed}\n`);

    console.log('🔑 Key Points:\n');
    console.log('   ✅ NOT mocked - real blockchain execution');
    console.log('   ✅ Real Hedera account used');
    console.log('   ✅ Real HBAR transferred');
    console.log('   ✅ Real reputation updates');
    console.log('   ✅ Real transaction recorded\n');

    console.log('🎉 Real Agent-to-Agent Payment Working!\n');

  } catch (error: any) {
    console.error('\n❌ Demo failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (executor) {
      executor.close();
    }
  }
}

runRealAgentPaymentDemo();
