/**
 * ERC-8004 Integrated Demo - Uses ACTUAL implementations
 * This demonstrates usage of the real ERC-8004 modules
 * Run with: npm run dev src/demo-integrated.ts
 */

import { ethers } from "ethers";
import { hederaConfig } from "./config/index";
import { AgentMetadata } from "./types/index";

// Import ACTUAL implementations
import {
  registerAgent,
  getAgentMetadata,
  getAgentOwner,
  getAgentCount,
  searchAgentsByCapability,
} from "./erc8004/identity";

import {
  submitFeedback,
  getFeedbackForAgent,
  getReputationSummary,
  calculateTrustScore,
  isTrustworthy,
} from "./erc8004/reputation";

import {
  requestValidation,
  submitValidation,
  getValidationScore,
  calculateValidationConfidence,
  isValidated,
} from "./erc8004/validation";

async function runIntegratedDemo() {
  console.log("🎯 ERC-8004 Integrated Demo - Using ACTUAL Implementations\n");
  console.log("=" .repeat(60));

  try {
    const wallet = new ethers.Wallet(hederaConfig.privateKey);

    // ========================================================================
    // STEP 1: Register Agents (Using ACTUAL identity.ts)
    // ========================================================================
    console.log("\n📝 STEP 1: Register Agents (identity.ts)\n");

    const weatherBotMetadata: AgentMetadata = {
      name: "Weather Bot",
      description: "Provides real-time weather data",
      capabilities: ["weather", "forecast", "alerts"],
      serviceUrl: "http://localhost:3001",
      price: 0.01,
      currency: "USDC",
    };

    const weatherBotId = await registerAgent(weatherBotMetadata);

    const dataBotMetadata: AgentMetadata = {
      name: "Data Analyzer",
      description: "Analyzes and processes data",
      capabilities: ["data-analysis", "ml-inference", "reporting"],
      serviceUrl: "http://localhost:3002",
      price: 0.05,
      currency: "USDC",
    };

    const dataBotId = await registerAgent(dataBotMetadata);

    // ========================================================================
    // STEP 2: Submit Feedback (Using ACTUAL reputation.ts)
    // ========================================================================
    console.log("⭐ STEP 2: Submit Feedback (reputation.ts)\n");

    const feedback1 = await submitFeedback(
      weatherBotId,
      5,
      "Excellent weather data! Very accurate.",
      "0x402_proof_1"
    );

    const feedback2 = await submitFeedback(
      weatherBotId,
      4,
      "Good service, minor delays sometimes",
      "0x402_proof_2"
    );

    const feedback3 = await submitFeedback(
      weatherBotId,
      5,
      "Perfect! Exactly what I needed.",
      "0x402_proof_3"
    );

    // ========================================================================
    // STEP 3: Check Reputation (Using ACTUAL reputation.ts)
    // ========================================================================
    console.log("📊 STEP 3: Check Reputation (reputation.ts)\n");

    const reputation = await getReputationSummary(weatherBotId);
    const trustScore = await calculateTrustScore(weatherBotId);
    const isTrusted = await isTrustworthy(weatherBotId);

    console.log(`Is Weather Bot trustworthy? ${isTrusted}\n`);

    // ========================================================================
    // STEP 4: Request Validation (Using ACTUAL validation.ts)
    // ========================================================================
    console.log("🔍 STEP 4: Request Validation (validation.ts)\n");

    const validationId = await requestValidation(
      weatherBotId,
      "stake-re-execution",
      "Verify weather data accuracy for NYC",
      1000000000000000000
    );

    // ========================================================================
    // STEP 5: Submit Validation Result (Using ACTUAL validation.ts)
    // ========================================================================
    console.log("✔️  STEP 5: Submit Validation Result (validation.ts)\n");

    await submitValidation(
      validationId,
      true,
      "Verified: Weather data matches expected output"
    );

    // ========================================================================
    // STEP 6: Check Validation Score (Using ACTUAL validation.ts)
    // ========================================================================
    console.log("📊 STEP 6: Check Validation Score (validation.ts)\n");

    const validationScore = await getValidationScore(weatherBotId);
    const confidence = await calculateValidationConfidence(weatherBotId);
    const validated = await isValidated(weatherBotId);

    console.log(`Is Weather Bot validated? ${validated}\n`);

    // ========================================================================
    // STEP 7: Search by Capability (Using ACTUAL identity.ts)
    // ========================================================================
    console.log("🔍 STEP 7: Search Agents by Capability (identity.ts)\n");

    const weatherAgents = await searchAgentsByCapability("weather");
    console.log(`Agents with 'weather' capability: ${weatherAgents.join(", ")}`);

    const dataAgents = await searchAgentsByCapability("data-analysis");
    console.log(`Agents with 'data-analysis' capability: ${dataAgents.join(", ")}\n`);

    // ========================================================================
    // STEP 8: Get Agent Count (Using ACTUAL identity.ts)
    // ========================================================================
    console.log("📊 STEP 8: Get Agent Count (identity.ts)\n");

    const agentCount = await getAgentCount(wallet.address);
    console.log(`Total agents for ${wallet.address}: ${agentCount}\n`);

    // ========================================================================
    // STEP 9: Get Agent Metadata (Using ACTUAL identity.ts)
    // ========================================================================
    console.log("📖 STEP 9: Get Agent Metadata (identity.ts)\n");

    const metadata = await getAgentMetadata(weatherBotId);
    if (metadata) {
      console.log(`Agent: ${metadata.name}`);
      console.log(`Description: ${metadata.description}`);
      console.log(`Capabilities: ${metadata.capabilities.join(", ")}`);
      console.log(`Service URL: ${metadata.serviceUrl}`);
      console.log(`Price: ${metadata.price} ${metadata.currency}\n`);
    }

    // ========================================================================
    // STEP 10: Get Feedback Details (Using ACTUAL reputation.ts)
    // ========================================================================
    console.log("📋 STEP 10: Get All Feedback (reputation.ts)\n");

    const allFeedback = await getFeedbackForAgent(weatherBotId);
    console.log(`Total feedback entries: ${allFeedback.length}`);
    console.log(`Feedback IDs: ${allFeedback.join(", ")}\n`);

    // Summary
    console.log("=" .repeat(60));
    console.log("\n✅ Integrated Demo Complete!\n");
    console.log("📚 What We Demonstrated:");
    console.log("   1. ✅ Used registerAgent() from identity.ts");
    console.log("   2. ✅ Used submitFeedback() from reputation.ts");
    console.log("   3. ✅ Used getReputationSummary() from reputation.ts");
    console.log("   4. ✅ Used calculateTrustScore() from reputation.ts");
    console.log("   5. ✅ Used requestValidation() from validation.ts");
    console.log("   6. ✅ Used submitValidation() from validation.ts");
    console.log("   7. ✅ Used getValidationScore() from validation.ts");
    console.log("   8. ✅ Used searchAgentsByCapability() from identity.ts");
    console.log("   9. ✅ Used getAgentCount() from identity.ts");
    console.log("   10. ✅ Used getAgentMetadata() from identity.ts");
    console.log("   11. ✅ Used getFeedbackForAgent() from reputation.ts");
    console.log("\n🎉 All functions from the 3 ERC-8004 files are working!");
    console.log("   identity.ts ✅");
    console.log("   reputation.ts ✅");
    console.log("   validation.ts ✅\n");
  } catch (error: any) {
    console.error("❌ Demo failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

runIntegratedDemo();
