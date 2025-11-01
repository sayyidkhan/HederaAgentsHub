/**
 * ERC-8004 Reputation Registry Manager
 * Handles feedback, ratings, and trust scoring
 */

import { Contract, ethers } from "ethers";
import { contractAddresses, hederaConfig } from "../config/index";
import ReputationRegistryABI from "./abis/ReputationRegistry.json";
import { Feedback, ReputationScore } from "../types/index";

let reputationContract: Contract | null = null;

/**
 * Initialize Reputation Registry contract
 */
export function getReputationContract(): Contract {
  if (reputationContract) {
    return reputationContract;
  }

  if (!contractAddresses.reputationRegistry) {
    throw new Error("REPUTATION_REGISTRY address not configured");
  }

  // Create provider using JSON-RPC endpoint
  const provider = new ethers.JsonRpcProvider(hederaConfig.jsonRpcUrl);

  // Create signer from private key
  const wallet = new ethers.Wallet(hederaConfig.privateKey, provider);

  // Create contract instance
  reputationContract = new Contract(
    contractAddresses.reputationRegistry,
    ReputationRegistryABI,
    wallet
  );

  return reputationContract;
}

/**
 * Submit feedback for an agent
 * @param agentId - Agent token ID
 * @param rating - Rating 1-5
 * @param comment - Feedback comment
 * @param paymentProof - Optional x402 payment proof
 * @returns Feedback ID
 */
export async function submitFeedback(
  agentId: string,
  rating: number,
  comment: string,
  paymentProof?: string
): Promise<string> {
  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const contract = getReputationContract();

    console.log(`⭐ Submitting feedback for agent ${agentId}`);
    console.log(`   Rating: ${rating}/5`);
    console.log(`   Comment: ${comment}`);

    // Call submitFeedback function
    const tx = await contract.submitFeedback(
      agentId,
      rating,
      comment,
      paymentProof || ""
    );
    const receipt = await tx.wait();

    // Extract feedback ID from transaction receipt
    const feedbackId = receipt?.logs[0]?.topics[1] || "unknown";

    console.log(`✅ Feedback submitted with ID: ${feedbackId}`);
    console.log(`   Transaction: ${receipt?.transactionHash}`);

    return feedbackId;
  } catch (error: any) {
    console.error("❌ Failed to submit feedback:", error.message);
    throw error;
  }
}

/**
 * Get feedback for an agent
 * @param agentId - Agent token ID
 * @returns Array of feedback IDs
 */
export async function getFeedbackForAgent(agentId: string): Promise<string[]> {
  try {
    const contract = getReputationContract();

    console.log(`📖 Fetching feedback for agent ${agentId}`);

    const feedbackIds = await contract.getFeedbackForAgent(agentId);

    console.log(`✅ Found ${feedbackIds.length} feedback entries`);

    return feedbackIds.map((id: any) => id.toString());
  } catch (error: any) {
    console.error("❌ Failed to get feedback:", error.message);
    return [];
  }
}

/**
 * Get specific feedback details
 * @param feedbackId - Feedback ID
 * @returns Feedback object
 */
export async function getFeedback(feedbackId: string): Promise<Feedback | null> {
  try {
    const contract = getReputationContract();

    const feedback = await contract.getFeedback(feedbackId);

    if (!feedback) {
      return null;
    }

    return {
      agentId: feedback.agentId.toString(),
      rating: feedback.rating,
      comment: feedback.comment,
      paymentProof: feedback.paymentProof,
      timestamp: feedback.timestamp.toNumber ? feedback.timestamp.toNumber() : parseInt(feedback.timestamp),
    };
  } catch (error: any) {
    console.error("❌ Failed to get feedback details:", error.message);
    return null;
  }
}

/**
 * Get reputation summary for an agent
 * @param agentId - Agent token ID
 * @returns Reputation score and statistics
 */
export async function getReputationSummary(
  agentId: string
): Promise<ReputationScore | null> {
  try {
    const contract = getReputationContract();

    console.log(`📊 Fetching reputation summary for agent ${agentId}`);

    const summary = await contract.getReputationSummary(agentId);

    if (!summary) {
      return null;
    }

    // Calculate trust score (0-100)
    const averageRating = summary.averageRating || 0;
    const trustScore = (averageRating / 5) * 100;

    const result: ReputationScore = {
      agentId: summary.agentId.toString(),
      averageRating: averageRating,
      totalReviews: summary.totalReviews.toNumber
        ? summary.totalReviews.toNumber()
        : parseInt(summary.totalReviews),
      trustScore: Math.round(trustScore),
    };

    console.log(`✅ Reputation Summary:`);
    console.log(`   Average Rating: ${result.averageRating}/5`);
    console.log(`   Total Reviews: ${result.totalReviews}`);
    console.log(`   Trust Score: ${result.trustScore}%`);

    return result;
  } catch (error: any) {
    console.error("❌ Failed to get reputation summary:", error.message);
    return null;
  }
}

/**
 * Revoke feedback
 * @param feedbackId - Feedback ID to revoke
 */
export async function revokeFeedback(feedbackId: string): Promise<void> {
  try {
    const contract = getReputationContract();

    console.log(`🗑️  Revoking feedback ${feedbackId}`);

    const tx = await contract.revokeFeedback(feedbackId);
    const receipt = await tx.wait();

    console.log(`✅ Feedback revoked`);
    console.log(`   Transaction: ${receipt?.transactionHash}`);
  } catch (error: any) {
    console.error("❌ Failed to revoke feedback:", error.message);
    throw error;
  }
}

/**
 * Respond to feedback
 * @param feedbackId - Feedback ID to respond to
 * @param response - Response message
 */
export async function respondToFeedback(
  feedbackId: string,
  response: string
): Promise<void> {
  try {
    const contract = getReputationContract();

    console.log(`💬 Responding to feedback ${feedbackId}`);

    const tx = await contract.respondToFeedback(feedbackId, response);
    const receipt = await tx.wait();

    console.log(`✅ Response submitted`);
    console.log(`   Transaction: ${receipt?.transactionHash}`);
  } catch (error: any) {
    console.error("❌ Failed to respond to feedback:", error.message);
    throw error;
  }
}

/**
 * Calculate trust score based on reputation
 * @param agentId - Agent token ID
 * @returns Trust score 0-100
 */
export async function calculateTrustScore(agentId: string): Promise<number> {
  try {
    const summary = await getReputationSummary(agentId);

    if (!summary) {
      return 0;
    }

    // Trust score calculation:
    // - Base: average rating (0-5) * 20 = 0-100
    // - Bonus: more reviews = higher confidence
    let trustScore = (summary.averageRating / 5) * 100;

    // Add confidence bonus based on review count
    if (summary.totalReviews >= 10) {
      trustScore = Math.min(100, trustScore + 5);
    }
    if (summary.totalReviews >= 50) {
      trustScore = Math.min(100, trustScore + 5);
    }

    return Math.round(trustScore);
  } catch (error: any) {
    console.error("❌ Failed to calculate trust score:", error.message);
    return 0;
  }
}

/**
 * Check if agent is trustworthy
 * @param agentId - Agent token ID
 * @param minTrustScore - Minimum trust score required (default 70)
 * @returns True if agent meets trust threshold
 */
export async function isTrustworthy(
  agentId: string,
  minTrustScore: number = 70
): Promise<boolean> {
  try {
    const trustScore = await calculateTrustScore(agentId);
    return trustScore >= minTrustScore;
  } catch (error: any) {
    console.error("❌ Failed to check trustworthiness:", error.message);
    return false;
  }
}
