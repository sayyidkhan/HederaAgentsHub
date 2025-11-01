/**
 * Agent Creation Service
 * Service to create ERC-8004 agents on Hedera blockchain
 * Usage: await createAgent(request)
 */

import { HederaAgentRegistry, AgentDefinition } from '../core/erc8004/hedera-agent-registry';
import { hederaConfig } from '../core/config/index';
import { ethers } from 'ethers';

export interface CreateAgentRequest {
  name: string;
  purpose: string;
  capabilities: string[];
  walletAddress: string;
  metadata?: {
    version?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    [key: string]: any;
  };
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
 */
export async function createAgent(request: CreateAgentRequest): Promise<CreateAgentResponse> {
  let registry: HederaAgentRegistry | null = null;

  try {
    console.log(`\n📝 Creating Agent via API\n`);
    console.log(`   Name: ${request.name}`);
    console.log(`   Wallet: ${request.walletAddress}`);
    console.log(`   Capabilities: ${request.capabilities.join(', ')}\n`);

    // Initialize registry
    registry = new HederaAgentRegistry(
      hederaConfig.accountId,
      hederaConfig.privateKey
    );

    await registry.initialize();

    // Create agent definition
    const agentDefinition: AgentDefinition = {
      name: request.name,
      purpose: request.purpose,
      capabilities: request.capabilities,
      walletAddress: request.walletAddress,
      metadata: request.metadata,
    };

    // Register agent
    const registeredAgent = await registry.registerAgent(agentDefinition);

    // Get EVM address from private key
    const wallet = new ethers.Wallet(hederaConfig.privateKey);
    const evmAddress = wallet.address;

    console.log(`✅ Agent created successfully!\n`);
    console.log(`   Agent ID: ${registeredAgent.agentId}`);
    console.log(`   Topic ID: ${registeredAgent.topicId}\n`);

    return {
      success: true,
      agentId: registeredAgent.agentId,
      name: registeredAgent.name,
      purpose: registeredAgent.purpose,         // ← Agent purpose (system prompt)
      capabilities: registeredAgent.capabilities, // ← Agent capabilities
      walletAddress: registeredAgent.walletAddress,
      evmAddress: evmAddress,                   // ← EVM address for wallet access
      privateKey: hederaConfig.privateKey,      // ← Private key for wallet access
      topicId: registeredAgent.topicId,
      transactionId: registeredAgent.transactionId,
    };

  } catch (error: any) {
    console.error(`❌ Agent creation failed:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  } finally {
    if (registry) {
      registry.close();
    }
  }
}

export default createAgent;
