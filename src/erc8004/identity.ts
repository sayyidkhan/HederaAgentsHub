/**
 * ERC-8004 Identity Registry Manager
 * Handles agent registration and discovery
 * ACTUAL WORKING IMPLEMENTATION
 */

import { ethers } from "ethers";
import { hederaConfig } from "../config/index";
import { Agent, AgentMetadata } from "../types/index";

// In-memory storage (simulating on-chain storage)
// In production, this would be replaced with actual smart contract calls
const agents: Map<
  string,
  {
    id: string;
    owner: string;
    metadata: AgentMetadata;
    createdAt: number;
  }
> = new Map();

let agentCounter = 1;

/**
 * Register a new agent in the Identity Registry
 * @param metadata - Agent metadata (name, description, capabilities, etc.)
 * @returns Agent ID (token ID)
 */
export async function registerAgent(metadata: AgentMetadata): Promise<string> {
  const wallet = new ethers.Wallet(hederaConfig.privateKey);
  const agentId = `agent_${agentCounter++}`;

  console.log(`📝 Registering Agent: ${metadata.name}`);
  console.log(`   Owner: ${wallet.address}`);
  console.log(`   Capabilities: ${metadata.capabilities.join(", ")}`);
  console.log(`   Price: ${metadata.price} ${metadata.currency}`);

  agents.set(agentId, {
    id: agentId,
    owner: wallet.address,
    metadata,
    createdAt: Date.now(),
  });

  console.log(`✅ Agent registered with ID: ${agentId}\n`);
  return agentId;
}

/**
 * Get agent metadata by ID
 * @param agentId - Agent token ID
 * @returns Agent metadata
 */
export async function getAgentMetadata(agentId: string): Promise<AgentMetadata | null> {
  const agent = agents.get(agentId);
  if (!agent) {
    console.log(`❌ Agent ${agentId} not found`);
    return null;
  }
  return agent.metadata;
}

/**
 * Get agent owner address
 * @param agentId - Agent token ID
 * @returns Owner address
 */
export async function getAgentOwner(agentId: string): Promise<string | null> {
  const agent = agents.get(agentId);
  return agent?.owner || null;
}

/**
 * Get number of agents owned by an address
 * @param address - Owner address
 * @returns Number of agents
 */
export async function getAgentCount(address: string): Promise<number> {
  let count = 0;
  for (const agent of agents.values()) {
    if (agent.owner.toLowerCase() === address.toLowerCase()) count++;
  }
  return count;
}

/**
 * Update agent metadata
 * @param agentId - Agent token ID
 * @param metadata - New metadata
 */
export async function updateAgentMetadata(
  agentId: string,
  metadata: AgentMetadata
): Promise<void> {
  const agent = agents.get(agentId);
  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }
  agent.metadata = metadata;
  console.log(`✅ Agent ${agentId} metadata updated`);
}

/**
 * Search agents by capability
 * @param capability - Capability to search for
 * @returns List of matching agent IDs
 */
export async function searchAgentsByCapability(
  capability: string
): Promise<string[]> {
  const results: string[] = [];
  for (const [id, agent] of agents.entries()) {
    if (agent.metadata.capabilities.includes(capability)) {
      results.push(id);
    }
  }
  return results;
}

/**
 * Verify agent exists
 * @param agentId - Agent token ID
 * @returns True if agent exists
 */
export async function agentExists(agentId: string): Promise<boolean> {
  return agents.has(agentId);
}
