/**
 * ERC-8004 Agent Registry on Hedera Blockchain
 * Deploys and manages AI agents on Hedera using HCS (Hedera Consensus Service)
 */

import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicId,
  AccountId,
  PrivateKey,
} from '@hashgraph/sdk';
import { hederaConfig } from '../config/index';

export interface AgentDefinition {
  name: string;
  purpose: string; // System prompt
  capabilities: string[];
  walletAddress: string; // One agent per wallet
  metadata?: {
    version?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    [key: string]: any;
  };
}

export interface RegisteredAgent {
  agentId: string;
  name: string;
  purpose: string;
  capabilities: string[];
  walletAddress: string; // One agent per wallet
  topicId: string; // Hedera Topic ID
  consensusTimestamp: string;
  transactionId: string;
  metadata?: any;
  createdAt: number;
}

export interface AgentUpdate {
  agentId: string;
  updates: {
    purpose?: string;
    capabilities?: string[];
    metadata?: any;
  };
}

/**
 * Hedera Agent Registry
 * Manages ERC-8004 agents on Hedera blockchain using HCS
 */
export class HederaAgentRegistry {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;
  private registryTopicId: TopicId | null = null;
  private agents: Map<string, RegisteredAgent> = new Map();

  constructor(accountId?: string, privateKey?: string) {
    // Initialize Hedera client for testnet
    this.client = Client.forTestnet();

    // Set operator credentials
    this.operatorId = AccountId.fromString(accountId || hederaConfig.accountId);
    this.operatorKey = PrivateKey.fromStringECDSA(privateKey || hederaConfig.privateKey);

    this.client.setOperator(this.operatorId, this.operatorKey);

    console.log(`🔗 Hedera Agent Registry initialized`);
    console.log(`   Account: ${this.operatorId}`);
    console.log(`   Network: Testnet\n`);
  }

  /**
   * Initialize registry by creating a topic for agent registrations
   */
  async initialize(): Promise<string> {
    try {
      console.log(`🚀 Initializing Agent Registry on Hedera...\n`);

      // Create a new topic for agent registry
      const transaction = new TopicCreateTransaction()
        .setTopicMemo('ERC-8004 Agent Registry')
        .setAdminKey(this.operatorKey.publicKey)
        .setSubmitKey(this.operatorKey.publicKey);

      const txResponse = await transaction.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);
      
      this.registryTopicId = receipt.topicId!;

      console.log(`✅ Registry Topic Created`);
      console.log(`   Topic ID: ${this.registryTopicId}`);
      console.log(`   Transaction ID: ${txResponse.transactionId}\n`);

      return this.registryTopicId.toString();

    } catch (error: any) {
      console.error(`❌ Registry initialization failed:`, error.message);
      throw error;
    }
  }

  /**
   * Register a new agent on Hedera blockchain
   * ONE AGENT PER WALLET - enforced
   */
  async registerAgent(definition: AgentDefinition): Promise<RegisteredAgent> {
    try {
      console.log(`\n📝 Registering Agent on Hedera Blockchain\n`);
      console.log(`   Name: ${definition.name}`);
      console.log(`   Wallet: ${definition.walletAddress}`);
      console.log(`   Purpose: ${definition.purpose}`);
      console.log(`   Capabilities: ${definition.capabilities.join(', ')}\n`);

      // Ensure registry is initialized
      if (!this.registryTopicId) {
        await this.initialize();
      }

      // Check if wallet already has an agent (ONE AGENT PER WALLET)
      const existingAgent = Array.from(this.agents.values()).find(
        agent => agent.walletAddress === definition.walletAddress
      );

      if (existingAgent) {
        throw new Error(
          `Wallet ${definition.walletAddress} already has an agent: ${existingAgent.name}. ` +
          `One agent per wallet only. Update the existing agent or use a different wallet.`
        );
      }

      // Generate unique agent ID
      const agentId = this.generateAgentId(definition.name);

      // Create agent data
      const agentData = {
        type: 'AGENT_REGISTRATION',
        agentId,
        name: definition.name,
        purpose: definition.purpose,
        capabilities: definition.capabilities,
        walletAddress: definition.walletAddress,
        metadata: definition.metadata || {},
        timestamp: Date.now(),
      };

      // Submit agent registration to Hedera topic
      console.log(`📤 Submitting to Hedera Consensus Service...`);
      
      const submitTx = new TopicMessageSubmitTransaction()
        .setTopicId(this.registryTopicId!)
        .setMessage(JSON.stringify(agentData));

      const submitResponse = await submitTx.execute(this.client);
      const submitReceipt = await submitResponse.getReceipt(this.client);

      console.log(`✅ Agent registered on blockchain!`);
      console.log(`   Transaction ID: ${submitResponse.transactionId}`);
      console.log(`   Status: ${submitReceipt.status}\n`);

      // Create registered agent record
      const registeredAgent: RegisteredAgent = {
        agentId,
        name: definition.name,
        purpose: definition.purpose,
        capabilities: definition.capabilities,
        walletAddress: definition.walletAddress,
        topicId: this.registryTopicId!.toString(),
        consensusTimestamp: submitReceipt.status.toString(),
        transactionId: submitResponse.transactionId.toString(),
        metadata: definition.metadata,
        createdAt: Date.now(),
      };

      // Store in local cache
      this.agents.set(agentId, registeredAgent);

      console.log(`✅ Agent Registration Complete`);
      console.log(`   Agent ID: ${agentId}`);
      console.log(`   Topic ID: ${this.registryTopicId}`);
      console.log(`   Blockchain TX: ${submitResponse.transactionId}\n`);

      return registeredAgent;

    } catch (error: any) {
      console.error(`❌ Agent registration failed:`, error.message);
      throw error;
    }
  }

  /**
   * Update agent information on blockchain
   */
  async updateAgent(update: AgentUpdate): Promise<boolean> {
    try {
      console.log(`\n🔄 Updating Agent on Hedera Blockchain\n`);
      console.log(`   Agent ID: ${update.agentId}\n`);

      if (!this.registryTopicId) {
        throw new Error('Registry not initialized');
      }

      const agent = this.agents.get(update.agentId);
      if (!agent) {
        throw new Error(`Agent ${update.agentId} not found`);
      }

      // Create update message
      const updateData = {
        type: 'AGENT_UPDATE',
        agentId: update.agentId,
        updates: update.updates,
        timestamp: Date.now(),
      };

      // Submit update to Hedera topic
      const submitTx = new TopicMessageSubmitTransaction()
        .setTopicId(this.registryTopicId)
        .setMessage(JSON.stringify(updateData));

      const submitResponse = await submitTx.execute(this.client);
      const submitReceipt = await submitResponse.getReceipt(this.client);

      console.log(`✅ Agent updated on blockchain!`);
      console.log(`   Transaction ID: ${submitResponse.transactionId}`);
      console.log(`   Status: ${submitReceipt.status}\n`);

      // Update local cache
      if (update.updates.purpose) {
        agent.purpose = update.updates.purpose;
      }
      if (update.updates.capabilities) {
        agent.capabilities = update.updates.capabilities;
      }
      if (update.updates.metadata) {
        agent.metadata = { ...agent.metadata, ...update.updates.metadata };
      }

      return true;

    } catch (error: any) {
      console.error(`❌ Agent update failed:`, error.message);
      return false;
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): RegisteredAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get agent by wallet address (ONE AGENT PER WALLET)
   */
  getAgentByWallet(walletAddress: string): RegisteredAgent | undefined {
    return Array.from(this.agents.values()).find(
      agent => agent.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
  }

  /**
   * Get all registered agents
   */
  getAllAgents(): RegisteredAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Search agents by capability
   */
  searchByCapability(capability: string): RegisteredAgent[] {
    return Array.from(this.agents.values()).filter(agent =>
      agent.capabilities.some(cap => 
        cap.toLowerCase().includes(capability.toLowerCase())
      )
    );
  }

  /**
   * Get registry topic ID
   */
  getRegistryTopicId(): string | null {
    return this.registryTopicId?.toString() || null;
  }

  /**
   * Generate unique agent ID
   */
  private generateAgentId(name: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `agent-${sanitized}-${timestamp}-${random}`;
  }

  /**
   * Close client connection
   */
  close(): void {
    this.client.close();
  }
}

export default HederaAgentRegistry;
