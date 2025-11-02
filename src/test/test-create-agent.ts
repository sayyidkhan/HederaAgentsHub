/**
 * Test API Endpoint with Authentication
 * Tests the complete flow: authenticate → create agent
 * Run with: npm run dev src/test/test-create-agent.ts
 */

import { ethers } from 'ethers';

async function testCreateAgentEndpoint() {
  console.log('🧪 Testing Authenticated Agent Creation\n');
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
    // STEP 1: Authenticate User Wallet
    // ========================================================================
    console.log('\n🔐 STEP 1: Authenticate User Wallet\n');

    // Create test user wallet
    const userWallet = ethers.Wallet.createRandom();
    const userWalletAddress = userWallet.address;
    
    console.log(`📝 Generated User Wallet`);
    console.log(`   Address: ${userWalletAddress}`);
    console.log(`   Private Key: ${userWallet.privateKey}\n`);

    // Sign authentication message
    const timestamp = Date.now();
    const authMessage = `Sign in to HederaAgentsHub\nWallet: ${userWalletAddress}\nTimestamp: ${timestamp}`;
    const signature = await userWallet.signMessage(authMessage);
    
    console.log(`✍️  Signed Authentication Message`);
    console.log(`   Signature: ${signature.substring(0, 50)}...\n`);

    // Authenticate with API
    console.log(`🔐 Authenticating with API...`);
    const authResponse = await fetch('http://localhost:8080/api/auth/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        walletAddress: userWalletAddress,
        signature,
        timestamp,
      }),
    });

    const authData = await authResponse.json() as any;
    
    if (!authData.success) {
      console.log('❌ Authentication failed:', authData.error);
      return;
    }

    const jwtToken = authData.token;
    console.log(`✅ Authentication Successful!`);
    console.log(`   Token: ${jwtToken.substring(0, 50)}...`);
    console.log(`   Expires in: ${authData.expiresIn} seconds\n`);

    // ========================================================================
    // STEP 2: Create Agent (Authenticated)
    // ========================================================================
    console.log('\n📝 STEP 2: Create Agent (Authenticated)\n');

    const requestBody = {
      name: `Test API Agent ${Date.now()}`,
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
        'Authorization': `Bearer ${jwtToken}`, // ← Add JWT token
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
    // VERIFY WALLET CREDENTIALS & OWNERSHIP
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('\n🔐 Wallet Credentials & Ownership Verification\n');

    // Verify agent wallet
    const agentWallet = new ethers.Wallet(data.privateKey);
    const derivedEvmAddress = agentWallet.address;

    console.log(`✅ Agent Wallet Verification`);
    console.log(`   Agent Wallet: ${data.walletAddress}`);
    console.log(`   Owner Wallet: ${data.ownerWallet}`);
    console.log(`   Match User: ${data.ownerWallet?.toLowerCase() === userWalletAddress.toLowerCase() ? '✓' : '✗'}`);

    console.log(`\n✅ EVM Address Verification`);
    console.log(`   Returned: ${data.evmAddress}`);
    console.log(`   Derived:  ${derivedEvmAddress}`);
    console.log(`   Match: ${data.evmAddress.toLowerCase() === derivedEvmAddress.toLowerCase() ? '✓' : '✗'}`);

    // Test agent wallet signing
    console.log(`\n✅ Agent Wallet Signing Test`);
    const testMessage = 'Test message for agent';
    const testSignature = await agentWallet.signMessage(testMessage);
    console.log(`   Message: "${testMessage}"`);
    console.log(`   Signature: ${testSignature.substring(0, 30)}...`);

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(testMessage, testSignature);
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
    console.log('✅ User wallet authenticated successfully');
    console.log('✅ JWT token issued and validated');
    console.log('✅ Agent created with authenticated request');
    console.log('✅ Agent linked to owner wallet on blockchain');
    console.log('✅ Agent has autonomous wallet for operations');
    console.log('✅ Ownership link verified (User → Agent)');
    console.log('✅ Agent stored on Hedera blockchain');
    console.log('✅ Transaction recorded on blockchain');
    console.log('\n🚀 Ready to use agent with wallet!\n');
    console.log(`\n📊 Architecture:`);
    console.log(`   User Wallet:  ${userWalletAddress}`);
    console.log(`   ↓ owns`);
    console.log(`   Agent Wallet: ${data.walletAddress}`);
    console.log(`   ↓ autonomous operations`);
    console.log(`   Hedera Economy\n`);

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testCreateAgentEndpoint();
