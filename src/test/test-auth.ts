/**
 * Test Authentication Flow
 * Simulates wallet signature and tests auth API
 */

import { ethers } from 'ethers';

async function testAuth() {
  console.log('\n🧪 Testing Authentication Flow\n');

  // 1. Create a test wallet (simulating user's wallet)
  const testWallet = ethers.Wallet.createRandom();
  const walletAddress = testWallet.address;
  
  console.log('📝 Step 1: Generate Test Wallet');
  console.log(`   Address: ${walletAddress}`);
  console.log(`   Private Key: ${testWallet.privateKey}\n`);

  // 2. Create message to sign
  const timestamp = Date.now();
  const message = `Sign in to HederaAgentsHub\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
  
  console.log('📝 Step 2: Create Message');
  console.log(`   Message: ${message.replace(/\n/g, '\\n')}\n`);

  // 3. Sign message
  const signature = await testWallet.signMessage(message);
  
  console.log('✍️  Step 3: Sign Message');
  console.log(`   Signature: ${signature}\n`);

  // 4. Call auth API
  console.log('🔐 Step 4: Authenticate with API');
  const authResponse = await fetch('http://localhost:8080/api/auth/wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      signature,
      timestamp,
    }),
  });

  const authData = await authResponse.json() as any;
  
  if (authData.success) {
    console.log('✅ Authentication Successful!');
    console.log(`   Token: ${authData.token.substring(0, 50)}...`);
    console.log(`   Expires in: ${authData.expiresIn} seconds\n`);

    // 5. Test creating agent with token
    console.log('📝 Step 5: Create Agent (Authenticated)');
    const agentResponse = await fetch('http://localhost:8080/api/agents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`,
      },
      body: JSON.stringify({
        name: 'Test Shopping Assistant',
        purpose: 'Help users find and compare products',
        capabilities: ['search', 'compare', 'recommend'],
      }),
    });

    const agentData = await agentResponse.json() as any;
    
    if (agentData.success) {
      console.log('✅ Agent Created Successfully!');
      console.log(`   Agent ID: ${agentData.agentId}`);
      console.log(`   Agent Wallet: ${agentData.walletAddress}`);
      console.log(`   Owner Wallet: ${agentData.ownerWallet}`);
      console.log(`   Topic ID: ${agentData.topicId}`);
      console.log(`   View on HashScan: https://hashscan.io/testnet/topic/${agentData.topicId}\n`);
    } else {
      console.error('❌ Agent Creation Failed:', agentData.error);
    }

  } else {
    console.error('❌ Authentication Failed:', authData.error);
  }
}

// Run test
testAuth().catch(console.error);
