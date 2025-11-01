/**
 * Agent Listing & Search Service
 * Service to list and search agents on Hedera blockchain
 * Usage: await listAllAgents() or await searchAgentsByCapability(capability)
 */

import { HederaAgentRegistry, RegisteredAgent } from '../core/erc8004/hedera-agent-registry';
import { hederaConfig } from '../core/config/index';

export interface ListAgentsResponse {
  success: boolean;
  agents?: RegisteredAgent[];
  total?: number;
  error?: string;
}

export interface SearchAgentsResponse {
  success: boolean;
  agents?: RegisteredAgent[];
  capability?: string;
  total?: number;
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
 * List all registered agents
 */
export async function listAllAgents(): Promise<ListAgentsResponse> {
  try {
    console.log(`\n📋 Listing All Agents\n`);

    const registry = await getSharedRegistry();
    const agents = registry.getAllAgents();

    console.log(`✅ Found ${agents.length} agent(s)\n`);
    agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name}`);
      console.log(`   ID: ${agent.agentId}`);
      console.log(`   Wallet: ${agent.walletAddress}`);
      console.log(`   Capabilities: ${agent.capabilities.join(', ')}\n`);
    });

    return {
      success: true,
      agents,
      total: agents.length,
    };

  } catch (error: any) {
    console.error(`❌ Failed to list agents:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Search agents by capability
 */
export async function searchAgentsByCapability(capability: string): Promise<SearchAgentsResponse> {
  try {
    console.log(`\n🔍 Searching Agents by Capability\n`);
    console.log(`   Capability: ${capability}\n`);

    const registry = await getSharedRegistry();
    const agents = registry.searchByCapability(capability);

    console.log(`✅ Found ${agents.length} agent(s) with capability '${capability}'\n`);
    agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name}`);
      console.log(`   ID: ${agent.agentId}`);
      console.log(`   Wallet: ${agent.walletAddress}`);
      console.log(`   Capabilities: ${agent.capabilities.join(', ')}\n`);
    });

    return {
      success: true,
      agents,
      capability,
      total: agents.length,
    };

  } catch (error: any) {
    console.error(`❌ Failed to search agents:`, error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default { listAllAgents, searchAgentsByCapability };
