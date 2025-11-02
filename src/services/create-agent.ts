/**
 * Agent Creation Service
 * Service to create ERC-8004 agents on Hedera blockchain
 * Usage: await createAgent(request)
 */

import { AgentDefinition } from '../core/erc8004/hedera-agent-registry';
import { hederaConfig } from '../core/config/index';
import { getSharedRegistry } from './shared-registry';
import { ethers } from 'ethers';

export interface CreateAgentRequest {
  name: string;
  purpose: string;
  capabilities: string[];
  ownerWallet?: string; // User's wallet (authenticated via JWT)
  accountId?: string; // Account ID to use for creating agent
  privateKey?: string; // Private key to use for creating agent
}

export interface CreateAgentResponse {
  success: boolean;
  agentId?: string;
  name?: string;
  purpose?: string;           // ← Agent purpose (system prompt)
  capabilities?: string[];    // ← Agent capabilities
  walletAddress?: string;     // ← Agent's autonomous wallet
  ownerWallet?: string;       // ← User's wallet (owner)
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

    // Use provided credentials or fall back to env
    const accountId = request.accountId || hederaConfig.accountId;
    const privateKey = request.privateKey || hederaConfig.privateKey;
    
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
      ownerWallet: request.ownerWallet, // Link to user's wallet
    };

    // Register agent
    const registeredAgent = await registry.registerAgent(agentDefinition);

    // Get EVM address from private key
    const wallet = new ethers.Wallet(privateKey);
    const evmAddress = wallet.address;

    console.log(`✅ Agent created successfully!\n`);
    console.log(`   Agent ID: ${registeredAgent.agentId}`);
    console.log(`   Topic ID: ${registeredAgent.topicId}\n`);

    return {
      success: true,
      agentId: registeredAgent.agentId,
      name: registeredAgent.name,
      purpose: registeredAgent.purpose,
      capabilities: registeredAgent.capabilities,
      walletAddress: registeredAgent.walletAddress,
      ownerWallet: registeredAgent.ownerWallet,
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
