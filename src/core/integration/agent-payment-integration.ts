/**
 * Agent-Payment Integration
 * Connects ERC-8004 agent identity/reputation with x402 payments
 */

import { X402Client, X402Server, PaymentRequest, PaymentProof } from '../x402';
import {
  registerAgent,
  getAgentMetadata,
  searchAgentsByCapability,
} from '../erc8004/identity';
import {
  getReputationSummary,
  submitFeedback,
  calculateTrustScore,
} from '../erc8004/reputation';
import { AgentMetadata } from '../types';

export interface AgentPaymentRequest {
  buyerAgentId: string;
  sellerAgentId: string;
  service: string;
  amount: number;
  currency: string;
  description: string;
}

export interface AgentPaymentResult {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  buyerAgent: string;
  sellerAgent: string;
  amount: number;
  status?: string;
  error?: string;
}

export interface AgentTransaction {
  paymentId: string;
  buyerAgentId: string;
  sellerAgentId: string;
  amount: number;
  currency: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  feedback?: {
    rating: number;
    comment: string;
  };
}

/**
 * Agent Payment Manager
 * Orchestrates ERC-8004 agent discovery with x402 payments
 */
export class AgentPaymentManager {
  private transactions: Map<string, AgentTransaction> = new Map();
  private buyerClient: X402Client;
  private sellerServer: X402Server;

  constructor(sellerAddress: string) {
    this.buyerClient = new X402Client();
    this.sellerServer = new X402Server(sellerAddress);
  }

  /**
   * Step 1: Discover agents by capability (ERC-8004)
   */
  async discoverSellerAgents(capability: string): Promise<string[]> {
    console.log(`\n🔍 Step 1: Discover Seller Agents (ERC-8004)\n`);

    const agentIds = await searchAgentsByCapability(capability);

    console.log(`Found ${agentIds.length} agents with capability: ${capability}`);
    for (const agentId of agentIds) {
      const metadata = await getAgentMetadata(agentId);
      const reputation = await getReputationSummary(agentId);

      console.log(`   • ${metadata?.name} (${agentId})`);
      console.log(`     Price: ${metadata?.price} ${metadata?.currency}`);
      console.log(`     Trust: ${reputation?.trustScore || 0}%\n`);
    }

    return agentIds;
  }

  /**
   * Step 2: Select best agent based on reputation (ERC-8004)
   */
  async selectBestAgent(agentIds: string[]): Promise<string | null> {
    console.log(`\n📊 Step 2: Select Best Agent (ERC-8004)\n`);

    let bestAgent: string | null = null;
    let bestScore = -1;

    for (const agentId of agentIds) {
      const reputation = await getReputationSummary(agentId);
      const score = reputation?.trustScore || 0;

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agentId;
      }
    }

    if (bestAgent) {
      const metadata = await getAgentMetadata(bestAgent);
      console.log(`✅ Selected: ${metadata?.name}`);
      console.log(`   Trust Score: ${bestScore}%\n`);
    }

    return bestAgent;
  }

  /**
   * Step 3: Create x402 payment for agent service
   */
  async createAgentPayment(
    request: AgentPaymentRequest
  ): Promise<AgentPaymentResult> {
    console.log(`\n💳 Step 3: Create x402 Payment\n`);

    try {
      // Get seller metadata
      const sellerMetadata = await getAgentMetadata(request.sellerAgentId);
      if (!sellerMetadata) {
        throw new Error(`Seller agent ${request.sellerAgentId} not found`);
      }

      // Create payment proof
      const paymentRequest: PaymentRequest = {
        amount: request.amount,
        currency: request.currency,
        recipient: sellerMetadata.serviceUrl || '', // Use agent's service URL
        description: request.description,
        metadata: {
          buyerAgent: request.buyerAgentId,
          sellerAgent: request.sellerAgentId,
          service: request.service,
          timestamp: Date.now(),
        },
      };

      const paymentResponse = await this.buyerClient.makePayment(paymentRequest);

      if (!paymentResponse.success) {
        throw new Error(`Payment failed: ${paymentResponse.error}`);
      }

      console.log(`✅ Payment proof created`);
      console.log(`   Payment ID: ${paymentResponse.paymentId}`);
      console.log(`   Amount: ${request.amount} ${request.currency}`);
      console.log(`   For: ${request.service}\n`);

      // Store transaction
      const transaction: AgentTransaction = {
        paymentId: paymentResponse.paymentId,
        buyerAgentId: request.buyerAgentId,
        sellerAgentId: request.sellerAgentId,
        amount: request.amount,
        currency: request.currency,
        timestamp: Date.now(),
        status: 'pending',
      };

      this.transactions.set(paymentResponse.paymentId, transaction);

      return {
        success: true,
        paymentId: paymentResponse.paymentId,
        buyerAgent: request.buyerAgentId,
        sellerAgent: request.sellerAgentId,
        amount: request.amount,
      };

    } catch (error: any) {
      console.error(`❌ Payment creation failed: ${error.message}\n`);
      return {
        success: false,
        buyerAgent: request.buyerAgentId,
        sellerAgent: request.sellerAgentId,
        amount: request.amount,
        error: error.message,
      };
    }
  }

  /**
   * Step 4: Verify payment (x402)
   */
  async verifyAgentPayment(paymentProof: string): Promise<boolean> {
    console.log(`\n✅ Step 4: Verify Payment (x402)\n`);

    const verification = await this.sellerServer.verifyPayment(paymentProof);

    if (!verification.valid) {
      console.log(`❌ Payment verification failed: ${verification.error}\n`);
      return false;
    }

    console.log(`✅ Payment verified`);
    console.log(`   Amount: ${verification.amount}`);
    console.log(`   From: ${verification.sender}`);
    console.log(`   To: ${verification.recipient}\n`);

    return true;
  }

  /**
   * Step 5: Submit feedback and update reputation (ERC-8004)
   */
  async submitAgentFeedback(
    paymentId: string,
    rating: number,
    comment: string
  ): Promise<boolean> {
    console.log(`\n⭐ Step 5: Submit Feedback & Update Reputation (ERC-8004)\n`);

    const transaction = this.transactions.get(paymentId);
    if (!transaction) {
      console.log(`❌ Transaction ${paymentId} not found\n`);
      return false;
    }

    try {
      // Submit feedback to seller agent
      await submitFeedback(
        transaction.sellerAgentId,
        rating,
        comment,
        paymentId
      );

      // Update transaction
      transaction.status = 'completed';
      transaction.feedback = { rating, comment };

      // Get updated reputation
      const reputation = await getReputationSummary(transaction.sellerAgentId);

      console.log(`✅ Feedback submitted`);
      console.log(`   Rating: ${rating}/5`);
      console.log(`   Comment: ${comment}`);
      console.log(`   Seller Trust Score: ${reputation?.trustScore || 0}%\n`);

      return true;

    } catch (error: any) {
      console.error(`❌ Feedback submission failed: ${error.message}\n`);
      return false;
    }
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(): AgentTransaction[] {
    return Array.from(this.transactions.values());
  }

  /**
   * Get agent reputation
   */
  async getAgentReputation(agentId: string): Promise<number> {
    const reputation = await getReputationSummary(agentId);
    return reputation?.trustScore || 0;
  }

  /**
   * Complete agent-to-agent transaction flow
   */
  async executeAgentTransaction(
    request: AgentPaymentRequest,
    rating: number,
    feedback: string
  ): Promise<AgentPaymentResult> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🔗 AGENT-TO-AGENT TRANSACTION`);
    console.log(`${'='.repeat(60)}\n`);

    // Step 1: Create payment
    const paymentResult = await this.createAgentPayment(request);

    if (!paymentResult.success) {
      return paymentResult;
    }

    // Step 2: Verify payment
    // (In real scenario, seller would verify)
    const verified = await this.verifyAgentPayment(paymentResult.paymentId!);

    if (!verified) {
      return {
        ...paymentResult,
        success: false,
        error: 'Payment verification failed',
      };
    }

    // Step 3: Submit feedback
    const feedbackSubmitted = await this.submitAgentFeedback(
      paymentResult.paymentId!,
      rating,
      feedback
    );

    if (!feedbackSubmitted) {
      return {
        ...paymentResult,
        success: false,
        error: 'Feedback submission failed',
      };
    }

    console.log(`${'='.repeat(60)}`);
    console.log(`✅ AGENT TRANSACTION COMPLETE\n`);

    return paymentResult;
  }
}

export default AgentPaymentManager;
