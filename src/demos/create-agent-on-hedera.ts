/**
 * Create ERC-8004 Agent on Hedera Blockchain
 * Demonstrates how to register AI agents with name and purpose (system prompt)
 * Run with: npm run dev src/demos/create-agent-on-hedera.ts
 */

import { HederaAgentRegistry, AgentDefinition } from '../core/erc8004/hedera-agent-registry';
import { hederaConfig } from '../core/config/index';

async function createAgentOnHedera() {
  console.log('🚀 Create ERC-8004 Agent on Hedera Blockchain\n');
  console.log('='.repeat(60));

  let registry: HederaAgentRegistry | null = null;

  try {
    // ========================================================================
    // STEP 1: Initialize Hedera Agent Registry
    // ========================================================================
    console.log('\n🔧 STEP 1: Initialize Agent Registry\n');

    registry = new HederaAgentRegistry(
      hederaConfig.accountId,
      hederaConfig.privateKey
    );

    const topicId = await registry.initialize();

    console.log(`✅ Registry initialized on Hedera`);
    console.log(`   Topic ID: ${topicId}`);
    console.log(`   View on HashScan: https://hashscan.io/testnet/topic/${topicId}\n`);

    // ========================================================================
    // STEP 2: Define Agent with Name and Purpose (System Prompt)
    // ========================================================================
    console.log('📋 STEP 2: Define Agent\n');

    const agentDefinition: AgentDefinition = {
      name: 'iPhone Shopping Assistant',
      purpose: `You are an intelligent shopping assistant specialized in helping customers find and purchase iPhones. 

Your responsibilities:
- Understand customer requirements (budget, features, model preferences)
- Recommend the best iPhone model based on needs
- Compare prices across different sellers
- Verify seller reputation and trustworthiness
- Handle payment processing securely
- Track order status and delivery
- Provide post-purchase support

Always be helpful, accurate, and prioritize customer satisfaction. Use the ERC-8004 reputation system to select trusted sellers.`,
      capabilities: [
        'product-search',
        'price-comparison',
        'seller-verification',
        'payment-processing',
        'order-tracking',
        'customer-support'
      ],
      walletAddress: hederaConfig.accountId,
      metadata: {
        version: '1.0.0',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        category: 'e-commerce',
        language: 'en',
      }
    };

    console.log(`Agent Name: ${agentDefinition.name}`);
    console.log(`Agent Purpose (System Prompt):`);
    console.log(`${agentDefinition.purpose.substring(0, 200)}...`);
    console.log(`\nCapabilities: ${agentDefinition.capabilities.join(', ')}\n`);

    // ========================================================================
    // STEP 3: Register Agent on Hedera Blockchain
    // ========================================================================
    console.log('🔗 STEP 3: Register Agent on Blockchain\n');

    const registeredAgent = await registry.registerAgent(agentDefinition);

    // ========================================================================
    // STEP 4: Verify Registration
    // ========================================================================
    console.log('✅ STEP 4: Verify Registration\n');

    const agent = await registry.getAgent(registeredAgent.agentId);

    if (agent) {
      console.log(`✅ Agent successfully registered on Hedera!\n`);
      console.log(`📊 Agent Details:`);
      console.log(`   Agent ID: ${agent.agentId}`);
      console.log(`   Name: ${agent.name}`);
      console.log(`   Wallet: ${agent.walletAddress}`);
      console.log(`   Topic ID: ${agent.topicId}`);
      console.log(`   Transaction ID: ${agent.transactionId}`);
      console.log(`   Created: ${new Date(agent.createdAt).toISOString()}\n`);

      console.log(`📝 System Prompt (Purpose):`);
      console.log(`${agent.purpose}\n`);

      console.log(`🎯 Capabilities:`);
      agent.capabilities.forEach(cap => {
        console.log(`   • ${cap}`);
      });
      console.log();

      console.log(`⚙️  Metadata:`);
      console.log(JSON.stringify(agent.metadata, null, 2));
      console.log();
    }

    // ========================================================================
    // STEP 5: Create Another Agent (Example)
    // ========================================================================
    console.log('\n🤖 STEP 5: Create Another Agent\n');

    const sellerAgent: AgentDefinition = {
      name: 'iPhone Retailer Pro',
      purpose: `You are an authorized iPhone retailer agent responsible for managing inventory and fulfilling orders.

Your responsibilities:
- Maintain accurate inventory of iPhone models
- Process incoming orders from buyer agents
- Verify payment receipts using x402 protocol
- Arrange shipping and delivery
- Provide order status updates
- Handle returns and warranty claims
- Maintain high reputation score through excellent service

Always ensure product authenticity, timely delivery, and customer satisfaction.`,
      capabilities: [
        'inventory-management',
        'order-fulfillment',
        'payment-verification',
        'shipping-logistics',
        'customer-service'
      ],
      walletAddress: hederaConfig.accountId,
      metadata: {
        version: '1.0.0',
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 1500,
        category: 'retail',
        businessType: 'seller',
      }
    };

    const sellerRegistered = await registry.registerAgent(sellerAgent);

    console.log(`✅ Seller agent registered!`);
    console.log(`   Agent ID: ${sellerRegistered.agentId}`);
    console.log(`   Name: ${sellerRegistered.name}\n`);

    // ========================================================================
    // STEP 6: Search Agents by Capability
    // ========================================================================
    console.log('🔍 STEP 6: Search Agents by Capability\n');

    const paymentAgents = registry.searchByCapability('payment');
    
    console.log(`Found ${paymentAgents.length} agents with 'payment' capability:`);
    paymentAgents.forEach(agent => {
      console.log(`   • ${agent.name} (${agent.agentId})`);
    });
    console.log();

    // ========================================================================
    // STEP 7: Update Agent Purpose (Optional)
    // ========================================================================
    console.log('🔄 STEP 7: Update Agent Purpose\n');

    const updateResult = await registry.updateAgent({
      agentId: registeredAgent.agentId,
      updates: {
        purpose: registeredAgent.purpose + '\n\nNOTE: Now also supports trade-in services for old iPhones.',
        metadata: {
          ...registeredAgent.metadata,
          features: ['trade-in-support'],
          updatedAt: Date.now(),
        }
      }
    });

    if (updateResult) {
      console.log(`✅ Agent purpose updated on blockchain!\n`);
    }

    // ========================================================================
    // Summary
    // ========================================================================
    console.log('='.repeat(60));
    console.log('\n✅ Agent Creation Complete!\n');

    const allAgents = registry.getAllAgents();

    console.log(`📊 Summary:`);
    console.log(`   Total Agents Registered: ${allAgents.length}`);
    console.log(`   Registry Topic ID: ${registry.getRegistryTopicId()}`);
    console.log(`   Network: Hedera Testnet\n`);

    console.log(`🔗 View on HashScan Explorer:`);
    console.log(`   Registry: https://hashscan.io/testnet/topic/${registry.getRegistryTopicId()}`);
    console.log(`   Account: https://hashscan.io/testnet/account/${hederaConfig.accountId}\n`);

    console.log(`🎯 What Was Created:`);
    console.log(`   ✅ Hedera Consensus Service topic for agent registry`);
    console.log(`   ✅ ${allAgents.length} AI agents with names and purposes`);
    console.log(`   ✅ All data stored on Hedera blockchain`);
    console.log(`   ✅ Agents searchable by capability`);
    console.log(`   ✅ Full audit trail with transaction IDs\n`);

    console.log(`📝 Agent Details:\n`);
    allAgents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name}`);
      console.log(`   ID: ${agent.agentId}`);
      console.log(`   Capabilities: ${agent.capabilities.join(', ')}`);
      console.log(`   TX: ${agent.transactionId}\n`);
    });

    console.log(`🎉 ERC-8004 Agents Successfully Created on Hedera!\n`);

  } catch (error: any) {
    console.error('\n❌ Agent creation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (registry) {
      registry.close();
    }
  }
}

createAgentOnHedera();
