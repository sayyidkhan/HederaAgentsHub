/**
 * ERC-8004 Demo - Real Implementation Example
 * This demonstrates actual usage of the ERC-8004 system
 * Run with: npm run dev src/demo-erc8004.ts
 */

import { ethers } from "ethers";
import { hederaConfig } from "../core/config/index";
import { AgentMetadata, Feedback, ReputationScore } from "../core/types/index";

// ============================================================================
// DEMO: Real Agent System Implementation
// ============================================================================

/**
 * In-memory storage for demo (in production, this would be on-chain)
 * This demonstrates the data structures and workflows
 */
class DemoAgentSystem {
  // Agents registry (simulating Identity Registry)
  private agents: Map<
    string,
    {
      id: string;
      owner: string;
      metadata: AgentMetadata;
      createdAt: number;
    }
  > = new Map();

  // Feedback registry (simulating Reputation Registry)
  private feedback: Map<
    string,
    {
      id: string;
      agentId: string;
      reviewer: string;
      rating: number;
      comment: string;
      paymentProof?: string;
      timestamp: number;
    }
  > = new Map();

  // Validations registry (simulating Validation Registry)
  private validations: Map<
    string,
    {
      id: string;
      agentId: string;
      validationType: string;
      description: string;
      stake: number;
      isValid?: boolean;
      evidence?: string;
      timestamp: number;
      completed: boolean;
    }
  > = new Map();

  private agentCounter = 1;
  private feedbackCounter = 1;
  private validationCounter = 1;

  // ========================================================================
  // IDENTITY MANAGER - Agent Registration & Discovery
  // ========================================================================

  /**
   * Register a new agent
   */
  async registerAgent(metadata: AgentMetadata): Promise<string> {
    const wallet = new ethers.Wallet(hederaConfig.privateKey);
    const agentId = `agent_${this.agentCounter++}`;

    console.log(`\n📝 Registering Agent: ${metadata.name}`);
    console.log(`   Owner: ${wallet.address}`);
    console.log(`   Capabilities: ${metadata.capabilities.join(", ")}`);
    console.log(`   Price: ${metadata.price} ${metadata.currency}`);

    this.agents.set(agentId, {
      id: agentId,
      owner: wallet.address,
      metadata,
      createdAt: Date.now(),
    });

    console.log(`✅ Agent registered with ID: ${agentId}\n`);
    return agentId;
  }

  /**
   * Get agent metadata
   */
  async getAgentMetadata(agentId: string): Promise<AgentMetadata | null> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      console.log(`❌ Agent ${agentId} not found`);
      return null;
    }
    return agent.metadata;
  }

  /**
   * Get agent owner
   */
  async getAgentOwner(agentId: string): Promise<string | null> {
    const agent = this.agents.get(agentId);
    return agent?.owner || null;
  }

  /**
   * Get agent count for owner
   */
  async getAgentCount(owner: string): Promise<number> {
    let count = 0;
    for (const agent of this.agents.values()) {
      if (agent.owner === owner) count++;
    }
    return count;
  }

  /**
   * Check if agent exists
   */
  async agentExists(agentId: string): Promise<boolean> {
    return this.agents.has(agentId);
  }

  /**
   * Update agent metadata
   */
  async updateAgentMetadata(
    agentId: string,
    metadata: AgentMetadata
  ): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    agent.metadata = metadata;
    console.log(`✅ Agent ${agentId} metadata updated`);
  }

  /**
   * Search agents by capability
   */
  async searchAgentsByCapability(capability: string): Promise<string[]> {
    const results: string[] = [];
    for (const [id, agent] of this.agents.entries()) {
      if (agent.metadata.capabilities.includes(capability)) {
        results.push(id);
      }
    }
    return results;
  }

  // ========================================================================
  // REPUTATION MANAGER - Feedback & Trust Scoring
  // ========================================================================

  /**
   * Submit feedback for an agent
   */
  async submitFeedback(
    agentId: string,
    rating: number,
    comment: string,
    paymentProof?: string
  ): Promise<string> {
    if (!this.agents.has(agentId)) {
      throw new Error(`Agent ${agentId} not found`);
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const wallet = new ethers.Wallet(hederaConfig.privateKey);
    const feedbackId = `feedback_${this.feedbackCounter++}`;

    console.log(`\n⭐ Submitting Feedback`);
    console.log(`   Agent: ${agentId}`);
    console.log(`   Rating: ${rating}/5`);
    console.log(`   Comment: ${comment}`);
    if (paymentProof) console.log(`   Payment Proof: ${paymentProof}`);

    this.feedback.set(feedbackId, {
      id: feedbackId,
      agentId,
      reviewer: wallet.address,
      rating,
      comment,
      paymentProof,
      timestamp: Date.now(),
    });

    console.log(`✅ Feedback submitted with ID: ${feedbackId}\n`);
    return feedbackId;
  }

  /**
   * Get all feedback for an agent
   */
  async getFeedbackForAgent(agentId: string): Promise<string[]> {
    const results: string[] = [];
    for (const [id, fb] of this.feedback.entries()) {
      if (fb.agentId === agentId) {
        results.push(id);
      }
    }
    return results;
  }

  /**
   * Get feedback details
   */
  async getFeedback(feedbackId: string): Promise<Feedback | null> {
    const fb = this.feedback.get(feedbackId);
    if (!fb) return null;

    return {
      agentId: fb.agentId,
      rating: fb.rating,
      comment: fb.comment,
      paymentProof: fb.paymentProof,
      timestamp: fb.timestamp,
    };
  }

  /**
   * Get reputation summary
   */
  async getReputationSummary(agentId: string): Promise<ReputationScore | null> {
    const feedbackIds = await this.getFeedbackForAgent(agentId);

    if (feedbackIds.length === 0) {
      return {
        agentId,
        averageRating: 0,
        totalReviews: 0,
        trustScore: 0,
      };
    }

    let totalRating = 0;
    for (const fbId of feedbackIds) {
      const fb = this.feedback.get(fbId);
      if (fb) totalRating += fb.rating;
    }

    const averageRating = totalRating / feedbackIds.length;
    let trustScore = (averageRating / 5) * 100;

    // Add confidence bonus
    if (feedbackIds.length >= 10) trustScore += 5;
    if (feedbackIds.length >= 50) trustScore += 5;

    trustScore = Math.min(100, trustScore);

    console.log(`📊 Reputation Summary for ${agentId}`);
    console.log(`   Average Rating: ${averageRating.toFixed(2)}/5`);
    console.log(`   Total Reviews: ${feedbackIds.length}`);
    console.log(`   Trust Score: ${Math.round(trustScore)}%\n`);

    return {
      agentId,
      averageRating: Math.round(averageRating * 100) / 100,
      totalReviews: feedbackIds.length,
      trustScore: Math.round(trustScore),
    };
  }

  /**
   * Calculate trust score
   */
  async calculateTrustScore(agentId: string): Promise<number> {
    const summary = await this.getReputationSummary(agentId);
    return summary?.trustScore || 0;
  }

  /**
   * Check if agent is trustworthy
   */
  async isTrustworthy(
    agentId: string,
    minScore: number = 70
  ): Promise<boolean> {
    const trustScore = await this.calculateTrustScore(agentId);
    return trustScore >= minScore;
  }

  /**
   * Revoke feedback
   */
  async revokeFeedback(feedbackId: string): Promise<void> {
    const fb = this.feedback.get(feedbackId);
    if (!fb) {
      throw new Error(`Feedback ${feedbackId} not found`);
    }
    this.feedback.delete(feedbackId);
    console.log(`✅ Feedback ${feedbackId} revoked\n`);
  }

  // ========================================================================
  // VALIDATION MANAGER - Independent Validations
  // ========================================================================

  /**
   * Request validation
   */
  async requestValidation(
    agentId: string,
    validationType: string,
    description: string,
    stake: number = 0
  ): Promise<string> {
    if (!this.agents.has(agentId)) {
      throw new Error(`Agent ${agentId} not found`);
    }

    const validationId = `validation_${this.validationCounter++}`;

    console.log(`\n🔍 Requesting Validation`);
    console.log(`   Agent: ${agentId}`);
    console.log(`   Type: ${validationType}`);
    console.log(`   Description: ${description}`);
    console.log(`   Stake: ${stake}`);

    this.validations.set(validationId, {
      id: validationId,
      agentId,
      validationType,
      description,
      stake,
      timestamp: Date.now(),
      completed: false,
    });

    console.log(`✅ Validation requested with ID: ${validationId}\n`);
    return validationId;
  }

  /**
   * Submit validation result
   */
  async submitValidation(
    validationId: string,
    isValid: boolean,
    evidence: string
  ): Promise<void> {
    const val = this.validations.get(validationId);
    if (!val) {
      throw new Error(`Validation ${validationId} not found`);
    }

    console.log(`\n✔️  Submitting Validation Result`);
    console.log(`   Validation: ${validationId}`);
    console.log(`   Result: ${isValid ? "VALID" : "INVALID"}`);
    console.log(`   Evidence: ${evidence}`);

    val.isValid = isValid;
    val.evidence = evidence;
    val.completed = true;

    console.log(`✅ Validation result submitted\n`);
  }

  /**
   * Get validation details
   */
  async getValidation(validationId: string): Promise<any | null> {
    return this.validations.get(validationId) || null;
  }

  /**
   * Get all validations for agent
   */
  async getValidationsForAgent(agentId: string): Promise<string[]> {
    const results: string[] = [];
    for (const [id, val] of this.validations.entries()) {
      if (val.agentId === agentId) {
        results.push(id);
      }
    }
    return results;
  }

  /**
   * Get validation score
   */
  async getValidationScore(agentId: string): Promise<any> {
    const validationIds = await this.getValidationsForAgent(agentId);

    let passedCount = 0;
    for (const valId of validationIds) {
      const val = this.validations.get(valId);
      if (val?.completed && val?.isValid) {
        passedCount++;
      }
    }

    const confidence =
      validationIds.length > 0
        ? (passedCount / validationIds.length) * 100
        : 0;

    console.log(`📊 Validation Score for ${agentId}`);
    console.log(`   Total Validations: ${validationIds.length}`);
    console.log(`   Passed: ${passedCount}`);
    console.log(`   Confidence: ${Math.round(confidence)}%\n`);

    return {
      agentId,
      totalValidations: validationIds.length,
      passedValidations: passedCount,
      validationScore: Math.round(confidence),
    };
  }

  /**
   * Calculate validation confidence
   */
  async calculateValidationConfidence(agentId: string): Promise<number> {
    const score = await this.getValidationScore(agentId);
    return score.validationScore;
  }

  /**
   * Check if agent is validated
   */
  async isValidated(
    agentId: string,
    minConfidence: number = 80
  ): Promise<boolean> {
    const confidence = await this.calculateValidationConfidence(agentId);
    return confidence >= minConfidence;
  }

  /**
   * Cancel validation
   */
  async cancelValidation(validationId: string): Promise<void> {
    const val = this.validations.get(validationId);
    if (!val) {
      throw new Error(`Validation ${validationId} not found`);
    }
    this.validations.delete(validationId);
    console.log(`✅ Validation ${validationId} canceled\n`);
  }
}

// ============================================================================
// DEMO WORKFLOW
// ============================================================================

async function runDemo() {
  console.log("🎯 ERC-8004 Demo - Real Implementation\n");
  console.log("=".repeat(60));

  const system = new DemoAgentSystem();

  try {
    // Step 1: Register agents
    console.log("\n📝 STEP 1: Register Agents\n");

    const weatherBotMetadata: AgentMetadata = {
      name: "Weather Bot",
      description: "Provides real-time weather data",
      capabilities: ["weather", "forecast", "alerts"],
      serviceUrl: "http://localhost:3001",
      price: 0.01,
      currency: "USDC",
    };

    const weatherBotId = await system.registerAgent(weatherBotMetadata);

    const dataBotMetadata: AgentMetadata = {
      name: "Data Analyzer",
      description: "Analyzes and processes data",
      capabilities: ["data-analysis", "ml-inference", "reporting"],
      serviceUrl: "http://localhost:3002",
      price: 0.05,
      currency: "USDC",
    };

    const dataBotId = await system.registerAgent(dataBotMetadata);

    // Step 2: Submit feedback
    console.log("⭐ STEP 2: Submit Feedback\n");

    const feedback1 = await system.submitFeedback(
      weatherBotId,
      5,
      "Excellent weather data! Very accurate.",
      "0x402_proof_1"
    );

    const feedback2 = await system.submitFeedback(
      weatherBotId,
      4,
      "Good service, minor delays sometimes",
      "0x402_proof_2"
    );

    const feedback3 = await system.submitFeedback(
      weatherBotId,
      5,
      "Perfect! Exactly what I needed.",
      "0x402_proof_3"
    );

    // Step 3: Check reputation
    console.log("📊 STEP 3: Check Reputation\n");

    const reputation = await system.getReputationSummary(weatherBotId);
    console.log(`Is Weather Bot trustworthy? ${await system.isTrustworthy(weatherBotId)}`);

    // Step 4: Request validation
    console.log("\n🔍 STEP 4: Request Validation\n");

    const validationId = await system.requestValidation(
      weatherBotId,
      "stake-re-execution",
      "Verify weather data accuracy for NYC",
      1000000000000000000
    );

    // Step 5: Submit validation result
    console.log("✔️  STEP 5: Submit Validation Result\n");

    await system.submitValidation(
      validationId,
      true,
      "Verified: Weather data matches expected output"
    );

    // Step 6: Check validation score
    console.log("📊 STEP 6: Check Validation Score\n");

    const validationScore = await system.getValidationScore(weatherBotId);
    console.log(
      `Is Weather Bot validated? ${await system.isValidated(weatherBotId)}`
    );

    // Step 7: Search by capability
    console.log("\n🔍 STEP 7: Search Agents by Capability\n");

    const weatherAgents = await system.searchAgentsByCapability("weather");
    console.log(`Agents with 'weather' capability: ${weatherAgents.join(", ")}`);

    const dataAgents = await system.searchAgentsByCapability("data-analysis");
    console.log(`Agents with 'data-analysis' capability: ${dataAgents.join(", ")}\n`);

    // Step 8: Get agent count
    console.log("📊 STEP 8: Get Agent Count\n");

    const wallet = new ethers.Wallet(hederaConfig.privateKey);
    const agentCount = await system.getAgentCount(wallet.address);
    console.log(`Total agents for ${wallet.address}: ${agentCount}\n`);

    // Summary
    console.log("=".repeat(60));
    console.log("\n✅ Demo Complete!\n");
    console.log("📚 What We Demonstrated:");
    console.log("   1. ✅ Agent Registration (IdentityManager)");
    console.log("   2. ✅ Feedback Submission (ReputationManager)");
    console.log("   3. ✅ Trust Score Calculation");
    console.log("   4. ✅ Validation Requests (ValidationManager)");
    console.log("   5. ✅ Validation Results");
    console.log("   6. ✅ Confidence Scoring");
    console.log("   7. ✅ Agent Discovery by Capability");
    console.log("   8. ✅ Agent Count Tracking");
    console.log("\n🚀 This is a working prototype of the ERC-8004 system!");
    console.log("   Ready to integrate with actual smart contracts.\n");
  } catch (error: any) {
    console.error("❌ Demo failed:", error.message);
    process.exit(1);
  }
}

runDemo();
