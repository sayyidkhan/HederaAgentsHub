/**
 * ERC-8004 Validation Registry Manager
 * Handles independent validations for agents
 */

import { Contract, ethers } from "ethers";
import { contractAddresses, hederaConfig } from "../config/index";
import ValidationRegistryABI from "./abis/ValidationRegistry.json";

interface Validation {
  id: string;
  agentId: string;
  validationType: string;
  description: string;
  stake: number;
  isValid: boolean;
  evidence: string;
  timestamp: number;
  completed: boolean;
}

interface ValidationScore {
  agentId: string;
  totalValidations: number;
  passedValidations: number;
  validationScore: number;
}

let validationContract: Contract | null = null;

/**
 * Initialize Validation Registry contract
 */
export function getValidationContract(): Contract {
  if (validationContract) {
    return validationContract;
  }

  if (!contractAddresses.validationRegistry) {
    throw new Error("VALIDATION_REGISTRY address not configured");
  }

  // Create provider using JSON-RPC endpoint
  const provider = new ethers.JsonRpcProvider(hederaConfig.jsonRpcUrl);

  // Create signer from private key
  const wallet = new ethers.Wallet(hederaConfig.privateKey, provider);

  // Create contract instance
  validationContract = new Contract(
    contractAddresses.validationRegistry,
    ValidationRegistryABI,
    wallet
  );

  return validationContract;
}

/**
 * Request validation for an agent
 * @param agentId - Agent token ID
 * @param validationType - Type of validation (e.g., "stake-re-execution", "zkml", "tee-oracle")
 * @param description - Description of what to validate
 * @param stake - Amount to stake (in wei)
 * @returns Validation ID
 */
export async function requestValidation(
  agentId: string,
  validationType: string,
  description: string,
  stake: number = 0
): Promise<string> {
  try {
    const contract = getValidationContract();

    console.log(`🔍 Requesting validation for agent ${agentId}`);
    console.log(`   Type: ${validationType}`);
    console.log(`   Description: ${description}`);
    console.log(`   Stake: ${stake}`);

    // Call requestValidation function
    const tx = await contract.requestValidation(
      agentId,
      validationType,
      description,
      stake,
      { value: stake }
    );
    const receipt = await tx.wait();

    // Extract validation ID from transaction receipt
    const validationId = receipt?.logs[0]?.topics[1] || "unknown";

    console.log(`✅ Validation requested with ID: ${validationId}`);
    console.log(`   Transaction: ${receipt?.transactionHash}`);

    return validationId;
  } catch (error: any) {
    console.error("❌ Failed to request validation:", error.message);
    throw error;
  }
}

/**
 * Submit validation result
 * @param validationId - Validation ID
 * @param isValid - Whether the validation passed
 * @param evidence - Evidence/proof of validation
 */
export async function submitValidation(
  validationId: string,
  isValid: boolean,
  evidence: string
): Promise<void> {
  try {
    const contract = getValidationContract();

    console.log(`✔️  Submitting validation ${validationId}`);
    console.log(`   Result: ${isValid ? "VALID" : "INVALID"}`);
    console.log(`   Evidence: ${evidence.substring(0, 50)}...`);

    // Call submitValidation function
    const tx = await contract.submitValidation(validationId, isValid, evidence);
    const receipt = await tx.wait();

    console.log(`✅ Validation submitted`);
    console.log(`   Transaction: ${receipt?.transactionHash}`);
  } catch (error: any) {
    console.error("❌ Failed to submit validation:", error.message);
    throw error;
  }
}

/**
 * Get validation details
 * @param validationId - Validation ID
 * @returns Validation object
 */
export async function getValidation(
  validationId: string
): Promise<Validation | null> {
  try {
    const contract = getValidationContract();

    const validation = await contract.getValidation(validationId);

    if (!validation) {
      return null;
    }

    return {
      id: validation.id.toString(),
      agentId: validation.agentId.toString(),
      validationType: validation.validationType,
      description: validation.description,
      stake: validation.stake.toNumber ? validation.stake.toNumber() : parseInt(validation.stake),
      isValid: validation.isValid,
      evidence: validation.evidence,
      timestamp: validation.timestamp.toNumber
        ? validation.timestamp.toNumber()
        : parseInt(validation.timestamp),
      completed: validation.completed,
    };
  } catch (error: any) {
    console.error("❌ Failed to get validation:", error.message);
    return null;
  }
}

/**
 * Get all validations for an agent
 * @param agentId - Agent token ID
 * @returns Array of validation IDs
 */
export async function getValidationsForAgent(agentId: string): Promise<string[]> {
  try {
    const contract = getValidationContract();

    console.log(`📖 Fetching validations for agent ${agentId}`);

    const validationIds = await contract.getValidationsForAgent(agentId);

    console.log(`✅ Found ${validationIds.length} validations`);

    return validationIds.map((id: any) => id.toString());
  } catch (error: any) {
    console.error("❌ Failed to get validations:", error.message);
    return [];
  }
}

/**
 * Get validation score for an agent
 * @param agentId - Agent token ID
 * @returns Validation score object
 */
export async function getValidationScore(agentId: string): Promise<ValidationScore | null> {
  try {
    const contract = getValidationContract();

    console.log(`📊 Fetching validation score for agent ${agentId}`);

    const score = await contract.getValidationScore(agentId);

    if (!score) {
      return null;
    }

    const result: ValidationScore = {
      agentId: score.agentId.toString(),
      totalValidations: score.totalValidations.toNumber
        ? score.totalValidations.toNumber()
        : parseInt(score.totalValidations),
      passedValidations: score.passedValidations.toNumber
        ? score.passedValidations.toNumber()
        : parseInt(score.passedValidations),
      validationScore: score.validationScore,
    };

    console.log(`✅ Validation Score:`);
    console.log(`   Total Validations: ${result.totalValidations}`);
    console.log(`   Passed: ${result.passedValidations}`);
    console.log(`   Score: ${result.validationScore}%`);

    return result;
  } catch (error: any) {
    console.error("❌ Failed to get validation score:", error.message);
    return null;
  }
}

/**
 * Cancel a validation request
 * @param validationId - Validation ID to cancel
 */
export async function cancelValidation(validationId: string): Promise<void> {
  try {
    const contract = getValidationContract();

    console.log(`❌ Canceling validation ${validationId}`);

    const tx = await contract.cancelValidation(validationId);
    const receipt = await tx.wait();

    console.log(`✅ Validation canceled`);
    console.log(`   Transaction: ${receipt?.transactionHash}`);
  } catch (error: any) {
    console.error("❌ Failed to cancel validation:", error.message);
    throw error;
  }
}

/**
 * Calculate validation confidence score
 * @param agentId - Agent token ID
 * @returns Confidence score 0-100
 */
export async function calculateValidationConfidence(agentId: string): Promise<number> {
  try {
    const score = await getValidationScore(agentId);

    if (!score || score.totalValidations === 0) {
      return 0;
    }

    // Confidence = (passed / total) * 100
    const confidence = (score.passedValidations / score.totalValidations) * 100;

    return Math.round(confidence);
  } catch (error: any) {
    console.error("❌ Failed to calculate validation confidence:", error.message);
    return 0;
  }
}

/**
 * Check if agent passed validation
 * @param agentId - Agent token ID
 * @param minConfidence - Minimum confidence required (default 80)
 * @returns True if agent meets validation threshold
 */
export async function isValidated(
  agentId: string,
  minConfidence: number = 80
): Promise<boolean> {
  try {
    const confidence = await calculateValidationConfidence(agentId);
    return confidence >= minConfidence;
  } catch (error: any) {
    console.error("❌ Failed to check validation status:", error.message);
    return false;
  }
}

/**
 * Get validation types
 * @returns Supported validation types
 */
export function getSupportedValidationTypes(): string[] {
  return [
    "stake-re-execution",
    "zkml-proof",
    "tee-oracle",
    "trusted-judge",
    "multi-sig",
  ];
}

/**
 * Validate validation type
 * @param validationType - Type to validate
 * @returns True if valid type
 */
export function isValidValidationType(validationType: string): boolean {
  return getSupportedValidationTypes().includes(validationType);
}
