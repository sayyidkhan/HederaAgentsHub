/**
 * Create Your Own ERC-8004 Agent on Hedera
 * Simple template to create agents with custom name and purpose
 * Run with: npm run dev src/demos/create-my-agent.ts
 */

import { HederaAgentRegistry, AgentDefinition } from '../core/erc8004/hedera-agent-registry';
import { hederaConfig } from '../core/config/index';

async function createMyAgent() {
  console.log('🚀 Create My Agent on Hedera Blockchain\n');
  console.log('='.repeat(60));

  let registry: HederaAgentRegistry | null = null;

  try {
    // ========================================================================
    // CUSTOMIZE YOUR AGENT HERE
    // ========================================================================
    
    const myAgent: AgentDefinition = {
      // Agent Name (e.g., "Customer Support Bot", "Data Analyst", etc.)
      name: 'My Custom Agent',

      // Agent Purpose - This is your system prompt
      // Define what your agent does and how it should behave
      purpose: `You are a helpful AI assistant.

Your responsibilities:
- Help users with their questions
- Provide accurate information
- Be friendly and professional

Always prioritize user satisfaction and accuracy.`,

      // Agent Capabilities - What can your agent do?
      capabilities: [
        'question-answering',
        'information-retrieval',
        'customer-support'
      ],

      // Wallet Address - ONE AGENT PER WALLET
      walletAddress: hederaConfig.accountId,

      // Optional metadata
      metadata: {
        version: '1.0.0',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
      }
    };

    // ========================================================================
    // DEPLOY TO HEDERA BLOCKCHAIN
    // ========================================================================
    
    console.log('\n🔧 Initializing Registry...\n');
    
    registry = new HederaAgentRegistry();
    await registry.initialize();

    console.log('📝 Registering Agent...\n');
    console.log(`   Name: ${myAgent.name}`);
    console.log(`   Capabilities: ${myAgent.capabilities.join(', ')}\n`);

    const registeredAgent = await registry.registerAgent(myAgent);

    // ========================================================================
    // SUCCESS!
    // ========================================================================
    
    console.log('='.repeat(60));
    console.log('\n✅ Agent Successfully Created!\n');

    console.log(`📊 Agent Details:`);
    console.log(`   Agent ID: ${registeredAgent.agentId}`);
    console.log(`   Name: ${registeredAgent.name}`);
    console.log(`   Topic ID: ${registeredAgent.topicId}`);
    console.log(`   Transaction ID: ${registeredAgent.transactionId}\n`);

    console.log(`📝 System Prompt:`);
    console.log(`${registeredAgent.purpose}\n`);

    console.log(`🔗 View on HashScan:`);
    console.log(`   https://hashscan.io/testnet/topic/${registeredAgent.topicId}\n`);

    console.log(`🎉 Your agent is now live on Hedera blockchain!\n`);

  } catch (error: any) {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  } finally {
    if (registry) {
      registry.close();
    }
  }
}

createMyAgent();
