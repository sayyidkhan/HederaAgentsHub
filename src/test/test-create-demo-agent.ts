/**
 * Test script to create a demo agent
 * Run: npm run dev src/test/test-create-demo-agent.ts
 */

import { createAgent } from '../services';

async function testCreateDemoAgent() {
  console.log('🧪 Creating Demo Agent...\n');

  const DEMO_OWNER_WALLET = '0.0.7174687';

  try {
    const result = await createAgent({
      name: 'Demo Agent #' + Date.now(),
      purpose: 'A test agent created for demonstration purposes',
      capabilities: ['chat', 'analysis', 'automation'],
      ownerWallet: DEMO_OWNER_WALLET, // Link to owner wallet
    });

    console.log('\n✅ Agent Created Successfully!');
    console.log('Agent ID:', result.agentId);
    console.log('EVM Address:', result.evmAddress);
    console.log('Topic ID:', result.topicId);
    console.log('Transaction ID:', result.transactionId);
    console.log('\nView on HashScan:');
    console.log(`https://hashscan.io/testnet/topic/${result.topicId}`);
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
}

testCreateDemoAgent()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
