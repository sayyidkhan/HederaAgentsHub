/**
 * BaseAgent - Foundation for autonomous agents
 * Handles identity, reputation, validation, and payments
 */

import { ethers } from 'ethers';
import { hederaConfig } from '../core/config/index';
import { AgentMetadata } from '../core/types/index';

// Import ERC-8004 functions
import {
  registerAgent,
  getAgentMetadata,
  updateAgentMetadata,
} from '../core/erc8004/identity';

import {
  submitFeedback,
  getReputationSummary,
  calculateTrustScore,
  isTrustworthy,
} from '../core/erc8004/reputation';

import {
  requestValidation,
  submitValidation,
  getValidationScore,
  isValidated,
} from '../core/erc8004/validation';

export interface AgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  serviceUrl?: string;
  price?: number;
  currency?: string;
}

export abstract class BaseAgent {
  protected agentId?: string;
  protected wallet: ethers.Wallet;
  protected metadata: AgentMetadata;
  protected isRegistered: boolean = false;

  constructor(config: AgentConfig) {
    this.wallet = new ethers.Wallet(hederaConfig.privateKey);
    this.metadata = {
      name: config.name,
      description: config.description,
      capabilities: config.capabilities,
      serviceUrl: config.serviceUrl || '',
      price: config.price || 0,
      currency: config.currency || 'USDC',
    };
  }

  // ========================================================================
  // IDENTITY MANAGEMENT
  // ========================================================================

  /**
   * Register agent on-chain
   */
  async register(): Promise<string> {
    if (this.isRegistered) {
      console.log(`⚠️  Agent ${this.metadata.name} already registered`);
      return this.agentId!;
    }

    console.log(`📝 Registering agent: ${this.metadata.name}`);
    this.agentId = await registerAgent(this.metadata);
    this.isRegistered = true;

    console.log(`✅ Registered with ID: ${this.agentId}`);
    return this.agentId;
  }

  /**
   * Update agent metadata
   */
  async updateMetadata(updates: Partial<AgentMetadata>): Promise<void> {
    if (!this.isRegistered || !this.agentId) {
      throw new Error('Agent not registered yet');
    }

    this.metadata = { ...this.metadata, ...updates };
    await updateAgentMetadata(this.agentId, this.metadata);
    console.log(`✅ Metadata updated for ${this.metadata.name}`);
  }

  /**
   * Get agent metadata
   */
  async getMetadata(): Promise<AgentMetadata | null> {
    if (!this.agentId) {
      return this.metadata;
    }
    return await getAgentMetadata(this.agentId);
  }

  // ========================================================================
  // REPUTATION MANAGEMENT
  // ========================================================================

  /**
   * Submit feedback for another agent
   */
  async submitFeedback(
    targetAgentId: string,
    rating: number,
    comment: string,
    paymentProof?: string
  ): Promise<string> {
    console.log(`⭐ Submitting feedback for ${targetAgentId}`);
    return await submitFeedback(targetAgentId, rating, comment, paymentProof);
  }

  /**
   * Get own reputation
   */
  async getReputation() {
    if (!this.agentId) {
      throw new Error('Agent not registered yet');
    }
    return await getReputationSummary(this.agentId);
  }

  /**
   * Get own trust score
   */
  async getTrustScore(): Promise<number> {
    if (!this.agentId) {
      return 0;
    }
    return await calculateTrustScore(this.agentId);
  }

  /**
   * Check if trustworthy
   */
  async isTrustworthy(minScore: number = 70): Promise<boolean> {
    if (!this.agentId) {
      return false;
    }
    return await isTrustworthy(this.agentId, minScore);
  }

  // ========================================================================
  // VALIDATION MANAGEMENT
  // ========================================================================

  /**
   * Request validation for own work
   */
  async requestValidation(
    validationType: string,
    description: string,
    stake: number = 0
  ): Promise<string> {
    if (!this.agentId) {
      throw new Error('Agent not registered yet');
    }

    console.log(`🔍 Requesting ${validationType} validation`);
    return await requestValidation(this.agentId, validationType, description, stake);
  }

  /**
   * Submit validation for another agent
   */
  async submitValidationResult(
    validationId: string,
    isValid: boolean,
    evidence: string
  ): Promise<void> {
    console.log(`✔️  Submitting validation result for ${validationId}`);
    await submitValidation(validationId, isValid, evidence);
  }

  /**
   * Get own validation score
   */
  async getValidationScore(): Promise<any> {
    if (!this.agentId) {
      throw new Error('Agent not registered yet');
    }
    return await getValidationScore(this.agentId);
  }

  /**
   * Check if validated
   */
  async isValidated(minConfidence: number = 80): Promise<boolean> {
    if (!this.agentId) {
      return false;
    }
    return await isValidated(this.agentId, minConfidence);
  }

  // ========================================================================
  // SERVICE METHODS (Abstract - Override in subclasses)
  // ========================================================================

  /**
   * Main service logic - override in subclass
   */
  abstract performService(input: any): Promise<any>;

  /**
   * Start agent - override for custom behavior
   */
  async start(): Promise<void> {
    console.log(`🚀 Starting agent: ${this.metadata.name}`);
    
    // Register if not already
    if (!this.isRegistered) {
      await this.register();
    }

    // Log status
    const reputation = await this.getReputation();
    console.log(`📊 Trust Score: ${reputation?.trustScore || 0}%`);
    
    console.log(`✅ Agent ${this.metadata.name} is ready!`);
  }

  /**
   * Stop agent - override for cleanup
   */
  async stop(): Promise<void> {
    console.log(`🛑 Stopping agent: ${this.metadata.name}`);
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  /**
   * Get agent ID
   */
  getAgentId(): string | undefined {
    return this.agentId;
  }

  /**
   * Get wallet address
   */
  getAddress(): string {
    return this.wallet.address;
  }

  /**
   * Get agent name
   */
  getName(): string {
    return this.metadata.name;
  }

  /**
   * Get capabilities
   */
  getCapabilities(): string[] {
    return this.metadata.capabilities;
  }

  /**
   * Check if has capability
   */
  hasCapability(capability: string): boolean {
    return this.metadata.capabilities.includes(capability);
  }

  /**
   * Log status
   */
  async logStatus(): Promise<void> {
    console.log(`\n📊 Agent Status: ${this.metadata.name}`);
    console.log(`   ID: ${this.agentId || 'Not registered'}`);
    console.log(`   Address: ${this.wallet.address}`);
    console.log(`   Capabilities: ${this.metadata.capabilities.join(', ')}`);
    
    if (this.agentId) {
      const reputation = await this.getReputation();
      const validationScore = await this.getValidationScore();
      
      console.log(`   Trust Score: ${reputation?.trustScore || 0}%`);
      console.log(`   Total Reviews: ${reputation?.totalReviews || 0}`);
      console.log(`   Validation Confidence: ${validationScore?.validationScore || 0}%`);
    }
    console.log();
  }
}

export default BaseAgent;
