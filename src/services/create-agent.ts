/**
 * Agent Creation Service
 * Service to create ERC-8004 agents on Hedera blockchain
 * Usage: await createAgent(request)
 */

import { AgentDefinition } from '../core/erc8004/hedera-agent-registry';
import { hederaConfig } from '../core/config/index';
import { getSharedRegistry } from './shared-registry';
import { ethers } from 'ethers';
import { supabaseService } from './supabase';

export interface CreateAgentRequest {
  name: string;
  purpose: string;
  capabilities: string[];
}

export interface CreateAgentResponse {
  success: boolean;
  agentId?: string;
  name?: string;
  purpose?: string;           // ← Agent purpose (system prompt)
  capabilities?: string[];    // ← Agent capabilities
  walletAddress?: string;
  evmAddress?: string;        // ← EVM address for wallet access
  privateKey?: string;        // ← Private key for wallet access
  topicId?: string;
  transactionId?: string;
  error?: string;
}

/**
 * Create a new agent on Hedera blockchain
 * Only requires: name, purpose, capabilities
 * Everything else is generated dynamically
 */
export async function createAgent(request: CreateAgentRequest): Promise<CreateAgentResponse> {
  try {
    console.log(`\n📝 Creating Agent via API\n`);
    console.log(`   Name: ${request.name}`);
    console.log(`   Capabilities: ${request.capabilities.join(', ')}\n`);

    // Generate dynamic fields
    const accountId = hederaConfig.accountId;
    const privateKey = hederaConfig.privateKey;
    
    // Generate random wallet for this agent
    const generatedWallet = ethers.Wallet.createRandom();
    const walletAddress = generatedWallet.address;

    console.log(`   Generated Wallet: ${walletAddress}\n`);

    // Get shared registry for this account (reuse existing topic)
    const registry = await getSharedRegistry(accountId, privateKey);

    // Create agent definition
    const agentDefinition: AgentDefinition = {
      name: request.name,
      purpose: request.purpose,
      capabilities: request.capabilities,
      walletAddress: walletAddress,
    };

    // Register agent
    const registeredAgent = await registry.registerAgent(agentDefinition);

    // Get EVM address from private key
    const wallet = new ethers.Wallet(privateKey);
    const evmAddress = wallet.address;

    console.log(`✅ Agent created successfully!\n`);
    console.log(`   Agent ID: ${registeredAgent.agentId}`);
    console.log(`   Topic ID: ${registeredAgent.topicId}\n`);

    // Store agent data in Supabase
    try {
      await supabaseService.storeAgent({
        agent_id: registeredAgent.agentId,
        name: registeredAgent.name,
        purpose: registeredAgent.purpose,
        capabilities: registeredAgent.capabilities,
        wallet_address: registeredAgent.walletAddress,
        evm_address: evmAddress,
        topic_id: registeredAgent.topicId,
      });
      console.log(`   Agent data stored in Supabase\n`);
    } catch (supabaseError: any) {
      console.warn(`⚠️  Failed to store agent in Supabase: ${supabaseError.message}`);
      console.warn(`   Agent was created on Hedera but not stored in database\n`);
    }

    return {
      success: true,
      agentId: registeredAgent.agentId,
      name: registeredAgent.name,
      purpose: registeredAgent.purpose,
      capabilities: registeredAgent.capabilities,
      walletAddress: registeredAgent.walletAddress,
      evmAddress: evmAddress,
      privateKey: privateKey,
      topicId: registeredAgent.topicId,
      transactionId: registeredAgent.transactionId,
    };

  } catch (error: any) {
    console.error(`❌ Agent creation failed:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default createAgent;
