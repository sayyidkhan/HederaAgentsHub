/**
 * ERC-8004 Identity Registry Manager
 * Handles agent registration and discovery
 */

import { Contract, ethers } from "ethers";
import { getHederaClient } from "../hedera/client";
import { contractAddresses, hederaConfig } from "../config/index";
import IdentityRegistryABI from "./abis/IdentityRegistry.json";
import { Agent, AgentMetadata } from "../types/index";

let identityContract: Contract | null = null;

/**
 * Initialize Identity Registry contract
 */
export function getIdentityContract(): Contract {
  if (identityContract) {
    return identityContract;
  }

  if (!contractAddresses.identityRegistry) {
    throw new Error("IDENTITY_REGISTRY address not configured");
  }

  // Create provider using JSON-RPC endpoint
  const provider = new ethers.JsonRpcProvider(hederaConfig.jsonRpcUrl);

  // Create signer from private key
  const wallet = new ethers.Wallet(hederaConfig.privateKey, provider);

  // Create contract instance
  identityContract = new Contract(
    contractAddresses.identityRegistry,
    IdentityRegistryABI,
    wallet
  );

  return identityContract;
}

/**
 * Register a new agent in the Identity Registry
 * @param metadata - Agent metadata (name, description, capabilities, etc.)
 * @returns Agent ID (token ID)
 */
export async function registerAgent(metadata: AgentMetadata): Promise<string> {
  try {
    const contract = getIdentityContract();

    // Create metadata URI (in production, this would be an IPFS/Arweave URL)
    const metadataUri = JSON.stringify({
      name: metadata.name,
      description: metadata.description,
      capabilities: metadata.capabilities,
      serviceUrl: metadata.serviceUrl,
      price: metadata.price,
      currency: metadata.currency,
      timestamp: Date.now(),
    });

    // Encode metadata as base64 URI
    const encodedUri = `data:application/json;base64,${Buffer.from(metadataUri).toString("base64")}`;

    console.log(`📝 Registering agent: ${metadata.name}`);

    // Call registerAgent function
    const tx = await contract.registerAgent(encodedUri);
    const receipt = await tx.wait();

    // Extract agent ID from transaction receipt
    const agentId = receipt?.logs[0]?.topics[3] || "unknown";

    console.log(`✅ Agent registered with ID: ${agentId}`);
    console.log(`   Transaction: ${receipt?.transactionHash}`);

    return agentId;
  } catch (error: any) {
    console.error("❌ Failed to register agent:", error.message);
    throw error;
  }
}

/**
 * Get agent metadata by ID
 * @param agentId - Agent token ID
 * @returns Agent metadata
 */
export async function getAgentMetadata(agentId: string): Promise<AgentMetadata | null> {
  try {
    const contract = getIdentityContract();

    // Get token URI
    const uri = await contract.tokenURI(agentId);

    if (!uri) {
      console.warn(`⚠️  No metadata found for agent ${agentId}`);
      return null;
    }

    // Decode metadata from URI
    let metadata: AgentMetadata;

    if (uri.startsWith("data:application/json;base64,")) {
      // Decode base64 URI
      const base64Data = uri.replace("data:application/json;base64,", "");
      const jsonData = Buffer.from(base64Data, "base64").toString("utf-8");
      metadata = JSON.parse(jsonData);
    } else {
      // Try to fetch from URL (for IPFS/Arweave)
      const response = await fetch(uri);
      metadata = (await response.json()) as AgentMetadata;
    }

    return metadata;
  } catch (error: any) {
    console.error(`❌ Failed to get agent metadata:`, error.message);
    return null;
  }
}

/**
 * Get agent owner address
 * @param agentId - Agent token ID
 * @returns Owner address
 */
export async function getAgentOwner(agentId: string): Promise<string | null> {
  try {
    const contract = getIdentityContract();
    const owner = await contract.ownerOf(agentId);
    return owner;
  } catch (error: any) {
    console.error(`❌ Failed to get agent owner:`, error.message);
    return null;
  }
}

/**
 * Get number of agents owned by an address
 * @param address - Owner address
 * @returns Number of agents
 */
export async function getAgentCount(address: string): Promise<number> {
  try {
    const contract = getIdentityContract();
    const count = await contract.balanceOf(address);
    return count.toNumber ? count.toNumber() : parseInt(count);
  } catch (error: any) {
    console.error(`❌ Failed to get agent count:`, error.message);
    return 0;
  }
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
  try {
    const contract = getIdentityContract();

    // Create new metadata URI
    const metadataUri = JSON.stringify({
      name: metadata.name,
      description: metadata.description,
      capabilities: metadata.capabilities,
      serviceUrl: metadata.serviceUrl,
      price: metadata.price,
      currency: metadata.currency,
      timestamp: Date.now(),
    });

    const encodedUri = `data:application/json;base64,${Buffer.from(metadataUri).toString("base64")}`;

    console.log(`📝 Updating agent ${agentId} metadata`);

    // Call updateURI function
    const tx = await contract.updateURI(agentId, encodedUri);
    const receipt = await tx.wait();

    console.log(`✅ Agent metadata updated`);
    console.log(`   Transaction: ${receipt?.transactionHash}`);
  } catch (error: any) {
    console.error("❌ Failed to update agent metadata:", error.message);
    throw error;
  }
}

/**
 * Search agents by capability
 * @param capability - Capability to search for
 * @returns List of matching agents
 */
export async function searchAgentsByCapability(
  capability: string
): Promise<Agent[]> {
  try {
    console.log(`🔍 Searching for agents with capability: ${capability}`);

    // Note: This is a simplified implementation
    // In production, you'd use The Graph or similar indexing service
    // For now, we'll return a placeholder

    console.log(`⚠️  Full search requires indexing service (The Graph)`);
    return [];
  } catch (error: any) {
    console.error(`❌ Failed to search agents:`, error.message);
    return [];
  }
}

/**
 * Verify agent exists
 * @param agentId - Agent token ID
 * @returns True if agent exists
 */
export async function agentExists(agentId: string): Promise<boolean> {
  try {
    const contract = getIdentityContract();
    const owner = await contract.ownerOf(agentId);
    return !!owner;
  } catch (error) {
    return false;
  }
}
