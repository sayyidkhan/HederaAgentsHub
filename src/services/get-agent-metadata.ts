/**
 * Get Agent Metadata Service
 * Retrieve agent metadata by agent IDs using existing get-agent service
 * Usage: await getAgentMetadata(agentIds)
 */

import { getAgentById } from './get-agent';

export interface GetAgentMetadataRequest {
  agentIds: string[];
}

export interface AgentMetadata {
  agentId: string;
  name: string;
  purpose: string;
  capabilities: string[];
  walletAddress: string;
  topicId: string;
  transactionId: string;
  topicUrl?: string;        // HashScan URL for the topic
  transactionUrl?: string;  // HashScan URL for the transaction
  found: boolean;
  error?: string;
}

export interface GetAgentMetadataResponse {
  success: boolean;
  agents: AgentMetadata[];
  total: number;
  found: number;
  notFound: number;
  error?: string;
}

/**
 * Get agent metadata by agent IDs
 */
export async function getAgentMetadata(request: GetAgentMetadataRequest): Promise<GetAgentMetadataResponse> {
  try {
    console.log(`\n📋 Fetching Agent Metadata\n`);
    console.log(`   Requested Agent IDs: ${request.agentIds.length}`);

    const agents: AgentMetadata[] = [];
    let found = 0;
    let notFound = 0;

    for (const agentId of request.agentIds) {
      const response = await getAgentById(agentId);

      if (response.success && response.agent) {
        const agent = response.agent;
        agents.push({
          agentId: agent.agentId,
          name: agent.name,
          purpose: agent.purpose,
          capabilities: agent.capabilities,
          walletAddress: agent.walletAddress,
          topicId: agent.topicId,
          transactionId: agent.transactionId,
          topicUrl: agent.topicUrl,
          transactionUrl: agent.transactionUrl,
          found: true,
        });
        found++;
      } else {
        agents.push({
          agentId,
          name: '',
          purpose: '',
          capabilities: [],
          walletAddress: '',
          topicId: '',
          transactionId: '',
          found: false,
          error: response.error || `Agent ${agentId} not found`,
        });
        notFound++;
      }
    }

    console.log(`✅ Metadata retrieved`);
    console.log(`   Found: ${found}`);
    console.log(`   Not Found: ${notFound}\n`);

    return {
      success: true,
      agents,
      total: request.agentIds.length,
      found,
      notFound,
    };

  } catch (error: any) {
    console.error(`❌ Failed to fetch metadata:`, error.message);
    return {
      success: false,
      agents: [],
      total: 0,
      found: 0,
      notFound: 0,
      error: error.message,
    };
  }
}
