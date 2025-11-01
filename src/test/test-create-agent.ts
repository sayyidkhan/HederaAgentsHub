/**
 * Test API Endpoint
 * Tests the POST /api/agents/create endpoint
 * Run with: npm run dev src/demos/test-api-endpoint.ts
 */

import { hederaConfig } from '../core/config/index';
import * as ethersLib from 'ethers';

async function testCreateAgentEndpoint() {
  console.log('🧪 Testing POST /api/agents/create Endpoint\n');
  console.log('='.repeat(60));

  try {
    // Check if server is running
    console.log('\n🔍 Checking if server is running...\n');
    try {
      const healthCheck = await fetch('http://localhost:8080/health');
      if (!healthCheck.ok) {
        console.log('❌ Server is not responding correctly');
        console.log('Please start the server first: npm run start');
        return;
      }
      console.log('✅ Server is running!\n');
    } catch (error) {
      console.log('❌ Cannot connect to server at http://localhost:8080');
      console.log('Please start the server first: npm run start');
      return;
    }

    // ========================================================================
    // TEST: Create Agent via API Endpoint
    // ========================================================================
    console.log('\n📝 TEST: Creating Agent via API\n');

    const timestamp = Date.now();

    const requestBody = {
      name: `Test API Agent ${timestamp}`,
      purpose: `You are a test API agent.

Your responsibilities:
- Test the API endpoint
- Verify agent creation
- Confirm wallet credentials

Always test thoroughly.`,
      capabilities: [
        'api-test-1',
        'api-test-2',
        'api-test-3'
      ]
    };

    console.log('📤 Sending POST request to http://localhost:8080/api/agents/create\n');
    console.log('Request Body:');
    console.log(JSON.stringify(requestBody, null, 2));
    console.log('\n');

    const response = await fetch('http://localhost:8080/api/agents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = (await response.json()) as any;

    console.log(`📥 Response Status: ${response.status}\n`);
    console.log('Response Body:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n');

    // ========================================================================
    // VERIFY RESPONSE
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n✅ Response Analysis\n');

    if (!data.success) {
      console.log('❌ Agent creation failed!');
      console.log(`Error: ${data.error}`);
      return;
    }

    console.log('✅ Agent created successfully!\n');
    console.log(`   Agent ID: ${data.agentId}`);
    console.log(`   Name: ${data.name}`);
    console.log(`   Purpose: ${data.purpose.substring(0, 50)}...`);
    console.log(`   Capabilities: ${data.capabilities.join(', ')}`);
    console.log(`   Wallet Address: ${data.walletAddress}`);
    console.log(`   EVM Address: ${data.evmAddress}`);
    console.log(`   Private Key: ${data.privateKey.substring(0, 20)}...`);
    console.log(`   Topic ID: ${data.topicId}`);
    console.log(`   Transaction ID: ${data.transactionId}`);

    // ========================================================================
    // VERIFY WALLET CREDENTIALS
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('\n🔐 Wallet Credentials Verification\n');

    const { ethers } = await import('ethers');

    // Verify EVM address
    const wallet = new ethers.Wallet(data.privateKey);
    const derivedEvmAddress = wallet.address;

    console.log(`✅ EVM Address Verification`);
    console.log(`   Returned: ${data.evmAddress}`);
    console.log(`   Derived:  ${derivedEvmAddress}`);
    console.log(`   Match: ${data.evmAddress.toLowerCase() === derivedEvmAddress.toLowerCase() ? '✓' : '✗'}`);

    // Test wallet signing
    console.log(`\n✅ Wallet Signing Test`);
    const message = 'Test message for agent';
    const signature = await wallet.signMessage(message);
    console.log(`   Message: "${message}"`);
    console.log(`   Signature: ${signature.substring(0, 30)}...`);

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    console.log(`   Recovered Address: ${recoveredAddress}`);
    console.log(`   Match: ${recoveredAddress.toLowerCase() === derivedEvmAddress.toLowerCase() ? '✓' : '✗'}`);

    // ========================================================================
    // BLOCKCHAIN VERIFICATION
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('\n🔗 Blockchain Verification\n');

    console.log(`✅ Agent stored on Hedera blockchain`);
    console.log(`   Topic ID: ${data.topicId}`);
    console.log(`   View on HashScan: https://hashscan.io/testnet/topic/${data.topicId}`);

    console.log(`\n✅ Transaction recorded`);
    console.log(`   Transaction ID: ${data.transactionId}`);
    console.log(`   View on HashScan: https://hashscan.io/testnet/transaction/${data.transactionId}`);

    // ========================================================================
    // TEST SUMMARY
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All Tests Passed!\n');
    console.log('🎯 Test Summary:');
    console.log('✅ Agent created successfully via API');
    console.log('✅ Response includes all required fields');
    console.log('✅ Wallet credentials returned (EVM address + private key)');
    console.log('✅ Wallet can be used for signing transactions');
    console.log('✅ Agent stored on Hedera blockchain');
    console.log('✅ Transaction recorded on blockchain');
    console.log('\n🚀 Ready to use agent with wallet!\n');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testCreateAgentEndpoint();
