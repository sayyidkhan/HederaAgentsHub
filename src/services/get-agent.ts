/**
 * Agent Retrieval Service
 * Service to retrieve agent information from Hedera blockchain
 * Usage: await getAgentById(agentId) or await getAgentByWallet(walletAddress)
 */

import { HederaAgentRegistry, RegisteredAgent } from '../core/erc8004/hedera-agent-registry';
import { hederaConfig } from '../core/config/index';

export interface GetAgentResponse {
  success: boolean;
  agent?: RegisteredAgent;
  error?: string;
}

// Shared registry instance to avoid creating new topics
let sharedRegistry: HederaAgentRegistry | null = null;

/**
 * Get or initialize shared registry
 */
async function getSharedRegistry(): Promise<HederaAgentRegistry> {
  if (!sharedRegistry) {
    sharedRegistry = new HederaAgentRegistry(
      hederaConfig.accountId,
      hederaConfig.privateKey
    );
    await sharedRegistry.initialize();
  }
  return sharedRegistry;
}

/**
 * Get agent by ID
 */
export async function getAgentById(agentId: string): Promise<GetAgentResponse> {
  try {
    console.log(`\n🔍 Retrieving Agent by ID\n`);
    console.log(`   Agent ID: ${agentId}\n`);

    const registry = await getSharedRegistry();
    const agent = registry.getAgent(agentId);

    if (!agent) {
      return {
        success: false,
        error: `Agent ${agentId} not found`,
      };
    }

    console.log(`✅ Agent found!\n`);
    console.log(`   Name: ${agent.name}`);
    console.log(`   Wallet: ${agent.walletAddress}\n`);

    return {
      success: true,
      agent,
    };

  } catch (error: any) {
    console.error(`❌ Failed to retrieve agent:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get agent by wallet address (ONE AGENT PER WALLET)
 */
export async function getAgentByWallet(walletAddress: string): Promise<GetAgentResponse> {
  try {
    console.log(`\n🔍 Retrieving Agent by Wallet\n`);
    console.log(`   Wallet: ${walletAddress}\n`);

    const registry = await getSharedRegistry();
    const agent = registry.getAgentByWallet(walletAddress);

    if (!agent) {
      return {
        success: false,
        error: `No agent found for wallet ${walletAddress}`,
      };
    }

    console.log(`✅ Agent found!\n`);
    console.log(`   Name: ${agent.name}`);
    console.log(`   Agent ID: ${agent.agentId}\n`);

    return {
      success: true,
      agent,
    };

  } catch (error: any) {
    console.error(`❌ Failed to retrieve agent:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default { getAgentById, getAgentByWallet };
