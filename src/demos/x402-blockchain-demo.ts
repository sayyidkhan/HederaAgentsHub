/**
 * x402 with Real Blockchain Integration Demo
 * Complete x402 payment flow with actual Hedera blockchain execution
 * Run with: npm run dev src/demos/x402-blockchain-demo.ts
 */

import { X402Client, X402Server, PaymentValidator } from '../core/x402';
import { BlockchainPaymentExecutor } from '../core/x402/blockchain-integration';
import { hederaConfig } from '../core/config/index';

async function runX402BlockchainDemo() {
  console.log('🔗 x402 with Blockchain Integration Demo\n');
  console.log('Complete x402 Payment Flow with Real Hedera Blockchain');
  console.log('='.repeat(60));

  let executor: BlockchainPaymentExecutor | null = null;

  try {
    // ========================================================================
    // SETUP: Initialize clients and blockchain executor
    // ========================================================================
    console.log('\n🔧 SETUP: Initialize Components\n');

    // Buyer and Seller addresses
    const buyerAddress = hederaConfig.accountId; // Your account
    const sellerAddress = '0xc6fea5433c4c96f28d842406b9c79860a5328f53'; // Seller address

    // Create x402 payment clients
    const buyer = new X402Client();
    const seller = new X402Client();

    // Create x402 servers - seller receives payment
    const sellerServer = new X402Server(sellerAddress);

    // Initialize blockchain executor
    executor = new BlockchainPaymentExecutor(
      hederaConfig.accountId,
      hederaConfig.privateKey
    );

    console.log(`🔐 Account Information:`);
    console.log(`   Buyer (You): ${buyerAddress}`);
    console.log(`   Seller: ${sellerAddress}`);
    console.log(`\n📝 In this demo:`);
    console.log(`   Sender: Your account (Buyer)`);
    console.log(`   Recipient: Seller's account`);
    console.log(`   Amount: 0.1 HBAR`);
    console.log(`   Fee: ~0.0005 HBAR (network fee)\n`);

    // ========================================================================
    // STEP 1: Bob creates x402 payment proof
    // ========================================================================
    console.log('💳 STEP 1: Create x402 Payment Proof\n');

    const paymentRequest = {
      amount: 0.1,
      currency: 'HBAR',
      recipient: sellerAddress, // Send to Seller
      description: 'x402 Payment - iPhone Purchase',
      metadata: {
        service: 'iphone-retail',
        product: 'iPhone 15 Pro',
        price: 999,
        currency: 'SGD',
        timestamp: Date.now(),
      },
    };

    const paymentResponse = await buyer.makePayment(paymentRequest);

    if (!paymentResponse.success) {
      throw new Error(`Payment failed: ${paymentResponse.error}`);
    }

    console.log(`✅ Payment proof created`);
    console.log(`   Payment ID: ${paymentResponse.paymentId}`);
    console.log(`   Amount: ${paymentRequest.amount} ${paymentRequest.currency}`);
    console.log(`   From: ${buyerAddress}`);
    console.log(`   To: ${sellerAddress}`);
    console.log(`   Product: ${paymentRequest.metadata.product}`);
    console.log(`   Proof: ${paymentResponse.proof.substring(0, 50)}...\n`);

    // ========================================================================
    // STEP 2: Validate payment proof
    // ========================================================================
    console.log('✅ STEP 2: Validate Payment Proof\n');

    const validation = await PaymentValidator.validateProof(
      paymentResponse.proof,
      sellerAddress
    );

    if (!validation.valid) {
      throw new Error(`Proof validation failed: ${validation.error}`);
    }

    console.log(`✅ Proof structure valid`);
    console.log(`   Signature: Valid ✓`);
    console.log(`   Amount: Valid ✓`);
    console.log(`   Recipient: Valid ✓\n`);

    // ========================================================================
    // STEP 3: Execute payment on blockchain
    // ========================================================================
    console.log('🔗 STEP 3: Execute on Hedera Blockchain\n');

    const proof = X402Client.parseProof(paymentResponse.proof);
    const blockchainResult = await executor.executePayment(paymentRequest, proof);

    if (!blockchainResult.success) {
      throw new Error(`Blockchain execution failed: ${blockchainResult.error}`);
    }

    console.log(`✅ Blockchain execution successful!`);
    console.log(`   Transaction ID: ${blockchainResult.transactionId}`);
    console.log(`   Status: ${blockchainResult.status}`);
    console.log(`   Amount transferred: ${blockchainResult.amount} HBAR\n`);

    // ========================================================================
    // STEP 4: Alice verifies payment
    // ========================================================================
    console.log(`✅ STEP 4: Verify Payment Receipt\n`);

    const verification = await sellerServer.verifyPayment(paymentResponse.proof);

    if (!verification.valid) {
      throw new Error(`Payment verification failed: ${verification.error}`);
    }

    console.log(`✅ Payment verified by Seller`);
    console.log(`   Amount: ${verification.amount} HBAR`);
    console.log(`   From (Buyer): ${verification.sender}`);
    console.log(`   To (Seller): ${verification.recipient}`);
    console.log(`   Payment ID: ${verification.paymentId}\n`);

    // ========================================================================
    // STEP 5: Service delivery
    // ========================================================================
    console.log('📊 STEP 5: Service Delivery\n');

    const serviceData = {
      service: 'iphone-retail',
      product: 'iPhone 15 Pro',
      quantity: 1,
      result: 'Order confirmed and ready for shipment',
      paymentVerified: true,
      paymentId: blockchainResult.transactionId,
    };

    console.log(`📦 Service Delivery (Seller fulfills order):`);
    console.log(`   Product: ${serviceData.product}`);
    console.log(`   Quantity: ${serviceData.quantity}`);
    console.log(`   Status: ${serviceData.result}`);
    console.log(`   Payment Verified: ${serviceData.paymentVerified} ✓\n`);

    // ========================================================================
    // STEP 6: View on explorer
    // ========================================================================
    console.log('🔍 STEP 6: View on HashScan Explorer\n');

    const explorerUrl = `https://hashscan.io/testnet/transaction/${blockchainResult.transactionId}`;
    console.log(`View transaction:`);
    console.log(`${explorerUrl}\n`);

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n✅ x402 Blockchain Integration Demo Complete!\n');

    console.log('\n🎯 iPhone Marketplace Transaction:\n');
    console.log('Buyer → Seller Payment Flow:');
    console.log(`   ✅ Step 1: Buyer (${buyerAddress}) creates payment proof`);
    console.log(`   ✅ Step 2: Validate proof for Seller (${sellerAddress})`);
    console.log('   ✅ Step 3: Execute 0.1 HBAR transfer on blockchain');
    console.log('   ✅ Step 4: Seller verifies payment receipt');
    console.log('   ✅ Step 5: Seller fulfills order (iPhone 15 Pro)');
    console.log('   ✅ Step 6: View transaction on HashScan\n');

    console.log('🔑 Key Features:');
    console.log(`   • x402 payment proof: ✓`);
    console.log(`   • Signature verification: ✓`);
    console.log(`   • Real blockchain execution: ✓`);
    console.log(`   • Balance deduction: ✓`);
    console.log(`   • Receipt confirmation: ✓`);
    console.log(`   • Explorer integration: ✓\n`);

    console.log('📊 Transaction Details:');
    console.log(`   • Buyer: ${buyerAddress}`);
    console.log(`   • Seller: ${sellerAddress}`);
    console.log(`   • Amount: ${blockchainResult.amount} HBAR`);
    console.log(`   • Transaction ID: ${blockchainResult.transactionId}`);
    console.log(`   • Status: ${blockchainResult.status}`);
    console.log(`   • Timestamp: ${new Date(blockchainResult.timestamp).toISOString()}\n`);

    console.log('🎉 iPhone Marketplace Payment Complete!\n');
    console.log('✅ Buyer paid Seller via x402 + Hedera blockchain!\n');

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

runX402BlockchainDemo();
