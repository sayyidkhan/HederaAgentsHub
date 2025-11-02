/**
 * Verify User → Agent Link on Blockchain
 * Queries Hedera Mirror Node to verify ownership link
 */

import { hederaConfig } from '../core/config';

async function verifyLinkOnBlockchain() {
  console.log('\n🔍 Verifying User → Agent Link on Blockchain\n');
  console.log('='.repeat(60));

  // Test data from previous test
  const topicId = '0.0.7179926';
  const userWallet = '0x3C3e4b8992FbB907f75bD901Ce136e7bD18cF2B5';
  const agentWallet = '0x020fE7c7DDfD37CEa6080D3c64069CcE6279613C';

  console.log(`\n📊 Test Data:`);
  console.log(`   Topic ID: ${topicId}`);
  console.log(`   User Wallet: ${userWallet}`);
  console.log(`   Agent Wallet: ${agentWallet}\n`);

  try {
    // ========================================================================
    // STEP 1: Query Hedera Mirror Node for Topic Messages
    // ========================================================================
    console.log('🔗 STEP 1: Query Hedera Mirror Node\n');

    const mirrorNodeUrl = `${hederaConfig.mirrorNodeUrl}/topics/${topicId}/messages`;
    console.log(`   Querying: ${mirrorNodeUrl}\n`);

    const response = await fetch(mirrorNodeUrl);
    
    if (!response.ok) {
      console.error('❌ Failed to fetch topic messages');
      return;
    }

    const data = await response.json() as any;
    console.log(`✅ Found ${data.messages?.length || 0} messages in topic\n`);

    // ========================================================================
    // STEP 2: Parse Messages and Find Agent Registration
    // ========================================================================
    console.log('🔍 STEP 2: Parse Messages\n');

    let foundAgent = false;

    for (const msg of data.messages || []) {
      try {
        // Decode base64 message
        const messageContent = Buffer.from(msg.message, 'base64').toString('utf-8');
        const agentData = JSON.parse(messageContent);

        // Check if this is an agent registration
        if (agentData.type === 'AGENT_REGISTRATION') {
          console.log(`📝 Found Agent Registration:`);
          console.log(`   Agent ID: ${agentData.agentId}`);
          console.log(`   Agent Name: ${agentData.name}`);
          console.log(`   Agent Wallet: ${agentData.walletAddress}`);
          console.log(`   Owner Wallet: ${agentData.ownerWallet || 'NOT SET'}`);
          console.log(`   Timestamp: ${new Date(agentData.timestamp).toISOString()}`);
          console.log(`   Consensus: ${msg.consensus_timestamp}\n`);

          // Verify the link
          if (agentData.walletAddress?.toLowerCase() === agentWallet.toLowerCase()) {
            foundAgent = true;

            console.log('='.repeat(60));
            console.log('\n✅ LINK VERIFICATION\n');

            if (agentData.ownerWallet) {
              const linkMatches = agentData.ownerWallet.toLowerCase() === userWallet.toLowerCase();
              
              console.log(`   Agent Wallet:  ${agentData.walletAddress}`);
              console.log(`   Owner Wallet:  ${agentData.ownerWallet}`);
              console.log(`   Expected User: ${userWallet}`);
              console.log(`   Link Valid:    ${linkMatches ? '✅ YES' : '❌ NO'}\n`);

              if (linkMatches) {
                console.log('🎉 SUCCESS! The link is verified on blockchain!\n');
                console.log('📊 Architecture:');
                console.log(`   User Wallet:  ${agentData.ownerWallet}`);
                console.log(`   ↓ owns (stored on-chain)`);
                console.log(`   Agent Wallet: ${agentData.walletAddress}`);
                console.log(`   ↓ autonomous operations`);
                console.log(`   Hedera Economy\n`);
              } else {
                console.log('❌ Link mismatch! Owner wallet does not match expected user.\n');
              }
            } else {
              console.log('⚠️  WARNING: ownerWallet field not found in blockchain message');
              console.log('   This agent was created before authentication was implemented.\n');
            }

            // Show blockchain proof
            console.log('='.repeat(60));
            console.log('\n🔗 Blockchain Proof\n');
            console.log(`   Topic: https://hashscan.io/testnet/topic/${topicId}`);
            console.log(`   Transaction: https://hashscan.io/testnet/transaction/${msg.payer_account_id}@${msg.consensus_timestamp}`);
            console.log(`   Message Sequence: ${msg.sequence_number}`);
            console.log(`   Consensus Time: ${msg.consensus_timestamp}\n`);

            break;
          }
        }
      } catch (parseError) {
        // Skip messages that aren't valid JSON
        continue;
      }
    }

    if (!foundAgent) {
      console.log('❌ Agent not found in topic messages\n');
    }

    // ========================================================================
    // STEP 3: Show All Agents in Topic
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n📋 All Agents in Topic\n');

    let agentCount = 0;
    for (const msg of data.messages || []) {
      try {
        const messageContent = Buffer.from(msg.message, 'base64').toString('utf-8');
        const agentData = JSON.parse(messageContent);

        if (agentData.type === 'AGENT_REGISTRATION') {
          agentCount++;
          console.log(`${agentCount}. ${agentData.name}`);
          console.log(`   Agent: ${agentData.walletAddress}`);
          console.log(`   Owner: ${agentData.ownerWallet || 'NOT SET'}\n`);
        }
      } catch (parseError) {
        continue;
      }
    }

    console.log(`Total agents in topic: ${agentCount}\n`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

// Run verification
verifyLinkOnBlockchain();
