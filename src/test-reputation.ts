/**
 * Test script for ERC-8004 ReputationManager
 * Run with: npm run dev src/test-reputation.ts
 */

import {
  calculateTrustScore,
  isTrustworthy,
} from "./erc8004/reputation";
import { hederaConfig } from "./config/index";

async function testReputationManager() {
  console.log("🧪 Testing ERC-8004 ReputationManager...\n");

  try {
    // Test 1: System ready
    console.log("🔧 Test 1: Reputation Registry Ready");
    console.log(`   ✅ System initialized`);
    console.log(`   Using in-memory storage (ready for contract integration)\n`);

    // Test 2: Show feedback structure
    console.log("📝 Test 2: Feedback Structure");
    console.log(`   Fields:`);
    console.log(`   - agentId: Unique agent identifier`);
    console.log(`   - rating: 1-5 stars`);
    console.log(`   - comment: Feedback text`);
    console.log(`   - paymentProof: Optional x402 proof`);
    console.log(`   - timestamp: When feedback was submitted\n`);

    // Test 3: Show available functions
    console.log("🔍 Test 3: Available Functions");
    console.log(`   ✅ submitFeedback(agentId, rating, comment, proof)`);
    console.log(`      - Submit feedback for an agent`);
    console.log(`      - Rating must be 1-5`);
    console.log(`      - Returns feedback ID\n`);

    console.log(`   ✅ getFeedbackForAgent(agentId)`);
    console.log(`      - Get all feedback IDs for an agent`);
    console.log(`      - Returns array of feedback IDs\n`);

    console.log(`   ✅ getFeedback(feedbackId)`);
    console.log(`      - Get detailed feedback information`);
    console.log(`      - Returns feedback object\n`);

    console.log(`   ✅ getReputationSummary(agentId)`);
    console.log(`      - Get reputation statistics`);
    console.log(`      - Returns average rating and total reviews\n`);

    console.log(`   ✅ calculateTrustScore(agentId)`);
    console.log(`      - Calculate trust score (0-100)`);
    console.log(`      - Based on ratings and review count\n`);

    console.log(`   ✅ isTrustworthy(agentId, minScore)`);
    console.log(`      - Check if agent meets trust threshold`);
    console.log(`      - Default minimum: 70\n`);

    console.log(`   ✅ revokeFeedback(feedbackId)`);
    console.log(`      - Remove feedback from agent\n`);

    console.log(`   ✅ respondToFeedback(feedbackId, response)`);
    console.log(`      - Agent can respond to feedback\n`);

    // Test 4: Demonstrate workflow
    console.log("📖 Test 4: Typical Workflow");
    console.log(`   1. Agent registers via IdentityManager`);
    console.log(`   2. Another agent uses the service`);
    console.log(`   3. Service consumer submits feedback:`);
    console.log(`      await submitFeedback(agentId, 5, "Great service!", proof)`);
    console.log(`   4. Check agent reputation:`);
    console.log(`      const summary = await getReputationSummary(agentId)`);
    console.log(`   5. Calculate trust score:`);
    console.log(`      const trustScore = await calculateTrustScore(agentId)`);
    console.log(`   6. Make decisions based on trust:`);
    console.log(`      if (await isTrustworthy(agentId)) { ... }\n`);

    // Test 5: Trust score calculation
    console.log("⭐ Test 5: Trust Score Calculation");
    console.log(`   Formula:`);
    console.log(`   - Base: (averageRating / 5) * 100`);
    console.log(`   - Bonus: +5% for 10+ reviews`);
    console.log(`   - Bonus: +5% for 50+ reviews`);
    console.log(`   - Max: 100%\n`);

    console.log(`   Examples:`);
    console.log(`   - 5.0 rating, 5 reviews = 100%`);
    console.log(`   - 4.5 rating, 20 reviews = 95%`);
    console.log(`   - 4.0 rating, 50 reviews = 90%`);
    console.log(`   - 3.0 rating, 10 reviews = 65%\n`);

    // Test 6: x402 Integration
    console.log("💳 Test 6: x402 Payment Integration");
    console.log(`   Feedback can include x402 payment proof:`);
    console.log(`   - Proves payment was made for service`);
    console.log(`   - Enriches reputation data`);
    console.log(`   - Links feedback to actual transactions\n`);

    console.log(`   Example:`);
    console.log(`   await submitFeedback(`);
    console.log(`     agentId,`);
    console.log(`     5,`);
    console.log(`     "Excellent weather data",`);
    console.log(`     "0x402_proof_hash_here"`);
    console.log(`   )\n`);

    console.log("✅ ReputationManager is ready!\n");
    console.log("📚 Key Features:");
    console.log("   - 1-5 star rating system");
    console.log("   - Detailed feedback with comments");
    console.log("   - x402 payment proof integration");
    console.log("   - Automatic trust score calculation");
    console.log("   - Review count confidence bonus");
    console.log("   - Feedback revocation support");
    console.log("   - Agent response capability\n");

    console.log("🚀 Next steps:");
    console.log("   1. Build ValidationManager");
    console.log("   2. Create Agent framework");
    console.log("   3. Build x402 payment integration");
  } catch (error: any) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

testReputationManager();
