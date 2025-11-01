/**
 * ERC-8004 Validation Registry Manager
 * Handles independent validations for agents
 * ACTUAL WORKING IMPLEMENTATION
 */

import { ethers } from "ethers";
import { hederaConfig } from "../config/index";

interface Validation {
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

interface ValidationScore {
  agentId: string;
  totalValidations: number;
  passedValidations: number;
  validationScore: number;
}

// In-memory storage (simulating on-chain storage)
const validations: Map<string, Validation> = new Map();

let validationCounter = 1;

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
  const validationId = `validation_${validationCounter++}`;

  console.log(`\n🔍 Requesting Validation`);
  console.log(`   Agent: ${agentId}`);
  console.log(`   Type: ${validationType}`);
  console.log(`   Description: ${description}`);
  console.log(`   Stake: ${stake}`);

  validations.set(validationId, {
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
 * @param validationId - Validation ID
 * @param isValid - Whether the validation passed
 * @param evidence - Evidence/proof of validation
 */
export async function submitValidation(
  validationId: string,
  isValid: boolean,
  evidence: string
): Promise<void> {
  const val = validations.get(validationId);
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
 * @param validationId - Validation ID
 * @returns Validation object
 */
export async function getValidation(
  validationId: string
): Promise<Validation | null> {
  return validations.get(validationId) || null;
}

/**
 * Get all validations for an agent
 * @param agentId - Agent token ID
 * @returns Array of validation IDs
 */
export async function getValidationsForAgent(agentId: string): Promise<string[]> {
  const results: string[] = [];
  for (const [id, val] of validations.entries()) {
    if (val.agentId === agentId) {
      results.push(id);
    }
  }
  return results;
}

/**
 * Get validation score for an agent
 * @param agentId - Agent token ID
 * @returns Validation score object
 */
export async function getValidationScore(agentId: string): Promise<ValidationScore | null> {
  const validationIds = await getValidationsForAgent(agentId);

  let passedCount = 0;
  for (const valId of validationIds) {
    const val = validations.get(valId);
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
 * Cancel a validation request
 * @param validationId - Validation ID to cancel
 */
export async function cancelValidation(validationId: string): Promise<void> {
  const val = validations.get(validationId);
  if (!val) {
    throw new Error(`Validation ${validationId} not found`);
  }
  validations.delete(validationId);
  console.log(`✅ Validation ${validationId} canceled\n`);
}

/**
 * Calculate validation confidence score
 * @param agentId - Agent token ID
 * @returns Confidence score 0-100
 */
export async function calculateValidationConfidence(agentId: string): Promise<number> {
  const score = await getValidationScore(agentId);
  return score?.validationScore || 0;
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
  const confidence = await calculateValidationConfidence(agentId);
  return confidence >= minConfidence;
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
