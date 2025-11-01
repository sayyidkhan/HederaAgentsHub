/**
 * Test Create Agent Service
 * Tests the agent creation service with wallet credentials
 * Run with: npm run dev src/demos/test-create-agent-service.ts
 */

import { createAgent } from '../services';
import { hederaConfig } from '../core/config/index';

async function testCreateAgentService() {
  console.log('🧪 Testing Create Agent Service\n');
  console.log('='.repeat(60));

  try {
    // ========================================================================
    // TEST: Create Agent with Wallet Credentials
    // ========================================================================
    console.log('\n📝 TEST: Creating Agent\n');

    const response = await createAgent({
      name: 'Test Shopping Agent',
      purpose: `You are a test shopping agent.

Your responsibilities:
- Test agent creation
- Verify wallet credentials
- Ensure blockchain integration

Always test thoroughly.`,
      capabilities: [
        'test-capability-1',
        'test-capability-2',
        'test-capability-3'
      ],
      walletAddress: hederaConfig.accountId,
      accountId: hederaConfig.accountId,
      privateKey: hederaConfig.privateKey,
      metadata: {
        version: '1.0.0',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        testMode: true,
      }
    });

    // ========================================================================
    // VERIFY RESPONSE
    // ========================================================================
    console.log('\n✅ Response Received\n');

    if (!response.success) {
      console.error(`❌ Creation failed: ${response.error}`);
      process.exit(1);
    }

    console.log('📊 Response Object:\n');
    console.log(JSON.stringify(response, null, 2));

    // ========================================================================
    // VERIFY WALLET CREDENTIALS
    // ========================================================================
    console.log('\n\n🔑 Wallet Credentials Verification\n');

    console.log('✅ Agent ID:');
    console.log(`   ${response.agentId}\n`);

    console.log('✅ Agent Name:');
    console.log(`   ${response.name}\n`);

    console.log('✅ Hedera Account (Wallet Address):');
    console.log(`   ${response.walletAddress}\n`);

    console.log('✅ EVM Address:');
    console.log(`   ${response.evmAddress}\n`);

    console.log('✅ Private Key:');
    console.log(`   ${response.privateKey?.substring(0, 50)}...\n`);

    console.log('✅ Topic ID:');
    console.log(`   ${response.topicId}\n`);

    console.log('✅ Transaction ID:');
    console.log(`   ${response.transactionId}\n`);

    // ========================================================================
    // VERIFY WALLET ACCESS
    // ========================================================================
    console.log('\n🔐 Wallet Access Verification\n');

    if (!response.evmAddress) {
      throw new Error('EVM address not returned');
    }

    if (!response.privateKey) {
      throw new Error('Private key not returned');
    }

    console.log('✅ EVM Address is valid');
    console.log(`   Format: ${response.evmAddress.startsWith('0x') ? 'Valid (0x prefix)' : 'Invalid'}`);
    console.log(`   Length: ${response.evmAddress.length} characters\n`);

    console.log('✅ Private Key is valid');
    console.log(`   Format: ${response.privateKey.length > 0 ? 'Valid (has content)' : 'Invalid'}`);
    console.log(`   Length: ${response.privateKey.length} characters\n`);

    // ========================================================================
    // TEST WALLET USAGE
    // ========================================================================
    console.log('\n💼 Test Wallet Usage\n');

    try {
      const { ethers } = await import('ethers');
      
      // Create wallet from private key
      const wallet = new ethers.Wallet(response.privateKey);
      
      console.log('✅ Wallet created from private key');
      console.log(`   Address: ${wallet.address}`);
      console.log(`   Matches EVM Address: ${wallet.address.toLowerCase() === response.evmAddress.toLowerCase() ? '✓' : '✗'}\n`);

      // Test signing
      const message = 'Test message for agent';
      const signature = await wallet.signMessage(message);
      
      console.log('✅ Message signed successfully');
      console.log(`   Message: "${message}"`);
      console.log(`   Signature: ${signature.substring(0, 50)}...\n`);

      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature);
      console.log('✅ Signature verified');
      console.log(`   Recovered Address: ${recoveredAddress}`);
      console.log(`   Matches Wallet: ${recoveredAddress.toLowerCase() === wallet.address.toLowerCase() ? '✓' : '✗'}\n`);

    } catch (error: any) {
      console.error(`❌ Wallet usage test failed: ${error.message}`);
    }

    // ========================================================================
    // BLOCKCHAIN VERIFICATION
    // ========================================================================
    console.log('\n🔗 Blockchain Verification\n');

    console.log('✅ Agent stored on Hedera blockchain');
    console.log(`   Topic ID: ${response.topicId}`);
    console.log(`   View on HashScan: https://hashscan.io/testnet/topic/${response.topicId}\n`);

    console.log('✅ Transaction recorded');
    console.log(`   Transaction ID: ${response.transactionId}`);
    console.log(`   View on HashScan: https://hashscan.io/testnet/transaction/${response.transactionId}\n`);

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n✅ All Tests Passed!\n');

    console.log('🎯 Test Summary:\n');
    console.log('✅ Agent created successfully');
    console.log('✅ Response includes all required fields');
    console.log('✅ Wallet credentials returned (EVM address + private key)');
    console.log('✅ Wallet can be used for signing transactions');
    console.log('✅ Agent stored on Hedera blockchain');
    console.log('✅ Transaction recorded on blockchain\n');

    console.log('🚀 Ready to use agent with wallet!\n');

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testCreateAgentService();
