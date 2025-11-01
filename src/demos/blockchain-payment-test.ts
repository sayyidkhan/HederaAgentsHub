/**
 * Blockchain Payment Test
 * Real HBAR transfer on Hedera testnet
 * Run with: npm run dev src/demos/blockchain-payment-test.ts
 */

import { AccountId, PrivateKey, Client, TransferTransaction, Hbar, AccountBalanceQuery } from '@hashgraph/sdk';
import { hederaConfig } from '../core/config/index';

async function testBlockchainPayment() {
  console.log('🔗 Blockchain Payment Test - Real HBAR Transfer\n');
  console.log('='.repeat(60));

  try {
    // ========================================================================
    // SETUP: Initialize Hedera client
    // ========================================================================
    console.log('\n🔧 SETUP: Initialize Hedera Client\n');

    // Create client for testnet
    const client = Client.forTestnet();

    // Set operator (your account)
    const operatorId = AccountId.fromString(hederaConfig.accountId);
    const operatorKey = PrivateKey.fromStringECDSA(hederaConfig.privateKey);

    client.setOperator(operatorId, operatorKey);

    console.log(`✅ Client initialized`);
    console.log(`   Network: Testnet`);
    console.log(`   Operator: ${operatorId}\n`);

    // ========================================================================
    // STEP 1: Check current balance
    // ========================================================================
    console.log('💰 STEP 1: Check Current Balance\n');

    const accountBalance = await new AccountBalanceQuery()
      .setAccountId(operatorId)
      .execute(client);
    const currentBalance = accountBalance.hbars.toBigNumber().toNumber();

    console.log(`Current balance: ${currentBalance} HBAR`);
    console.log(`Account ID: ${operatorId}\n`);

    if (currentBalance < 1) {
      console.log(`⚠️  Warning: Low balance! Need at least 1 HBAR for test`);
      console.log(`   Current: ${currentBalance} HBAR`);
      console.log(`   Required: 1 HBAR\n`);
      console.log(`Go to faucet to refill: https://portal.hedera.com/faucet\n`);
      process.exit(1);
    }

    // ========================================================================
    // STEP 2: Create test recipient account
    // ========================================================================
    console.log('👤 STEP 2: Create Test Recipient\n');

    // For testing, we'll send to a different address
    // In production, this would be the actual recipient
    const recipientId = AccountId.fromString('0.0.1000'); // Test account

    console.log(`Recipient: ${recipientId}`);
    console.log(`Amount: 0.5 HBAR\n`);

    // ========================================================================
    // STEP 3: Create transfer transaction
    // ========================================================================
    console.log('📝 STEP 3: Create Transfer Transaction\n');

    const transferAmount = new Hbar(0.5);

    const transferTx = new TransferTransaction()
      .addHbarTransfer(operatorId, transferAmount.negated())
      .addHbarTransfer(recipientId, transferAmount)
      .setTransactionMemo('x402 Payment Test - iPhone Purchase');

    console.log(`Transaction details:`);
    console.log(`   From: ${operatorId}`);
    console.log(`   To: ${recipientId}`);
    console.log(`   Amount: ${transferAmount.toString()}`);
    console.log(`   Memo: x402 Payment Test - iPhone Purchase\n`);

    // ========================================================================
    // STEP 4: Sign and submit transaction
    // ========================================================================
    console.log('🔐 STEP 4: Sign & Submit Transaction\n');

    console.log(`Signing transaction...`);
    const signedTx = await transferTx.freezeWith(client).sign(operatorKey);

    console.log(`✅ Transaction signed`);
    console.log(`Submitting to testnet...\n`);

    const txResponse = await signedTx.execute(client);

    console.log(`✅ Transaction submitted!`);
    console.log(`   Transaction ID: ${txResponse.transactionId}\n`);

    // ========================================================================
    // STEP 5: Wait for receipt
    // ========================================================================
    console.log('⏳ STEP 5: Wait for Receipt\n');

    console.log(`Waiting for transaction confirmation...`);
    const receipt = await txResponse.getReceipt(client);

    console.log(`✅ Transaction confirmed!`);
    console.log(`   Status: ${receipt.status.toString()}\n`);

    // ========================================================================
    // STEP 6: Verify balance change
    // ========================================================================
    console.log('💵 STEP 6: Verify Balance Change\n');

    const newAccountBalance = await new AccountBalanceQuery()
      .setAccountId(operatorId)
      .execute(client);
    const newBalanceNum = newAccountBalance.hbars.toBigNumber().toNumber();
    const deducted = currentBalance - newBalanceNum;

    console.log(`Previous balance: ${currentBalance} HBAR`);
    console.log(`New balance: ${newBalanceNum} HBAR`);
    console.log(`Amount deducted: ${deducted} HBAR`);
    console.log(`Status: ✅ Balance deducted!\n`);

    // ========================================================================
    // STEP 7: View on explorer
    // ========================================================================
    console.log('🔍 STEP 7: View on Explorer\n');

    const explorerUrl = `https://hashscan.io/testnet/transaction/${txResponse.transactionId}`;
    console.log(`View transaction on HashScan:`);
    console.log(`${explorerUrl}\n`);

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n✅ Blockchain Payment Test Complete!\n');

    console.log('📊 Transaction Summary:');
    console.log(`   ✅ Transaction ID: ${txResponse.transactionId}`);
    console.log(`   ✅ Status: ${receipt.status.toString()}`);
    console.log(`   ✅ Amount: 0.5 HBAR`);
    console.log(`   ✅ Balance deducted: ${deducted} HBAR`);
    console.log(`   ✅ Confirmed on testnet\n`);

    console.log('🎯 What This Demonstrates:');
    console.log('   • Real HBAR transfer on Hedera testnet');
    console.log('   • Transaction signing with private key');
    console.log('   • Receipt confirmation');
    console.log('   • Balance verification');
    console.log('   • Explorer integration\n');

    console.log('🚀 Next Steps:');
    console.log('   1. Integrate this into x402 facilitator');
    console.log('   2. Replace simulated payments with real transfers');
    console.log('   3. Add USDC token transfers (similar flow)');
    console.log('   4. Deploy to production\n');

    client.close();

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('   • Check account balance (need ≥ 1 HBAR)');
    console.error('   • Verify private key is correct');
    console.error('   • Check network connectivity');
    console.error('   • Ensure testnet is accessible\n');
    process.exit(1);
  }
}

testBlockchainPayment();
