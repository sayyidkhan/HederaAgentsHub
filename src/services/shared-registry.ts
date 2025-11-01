/**
 * Shared Registry Service
 * Provides a single shared registry instance across all services
 * Prevents creating multiple topics for the same account
 */

import { HederaAgentRegistry } from '../core/erc8004/hedera-agent-registry';
import { hederaConfig } from '../core/config/index';

// Shared registry instances (per account)
const registries = new Map<string, HederaAgentRegistry>();

/**
 * Get or initialize shared registry for account
 * Ensures only one registry (and one topic) per account
 */
export async function getSharedRegistry(
  accountId: string = hederaConfig.accountId,
  privateKey: string = hederaConfig.privateKey
): Promise<HederaAgentRegistry> {
  if (!registries.has(accountId)) {
    const registry = new HederaAgentRegistry(accountId, privateKey);
    await registry.initialize();
    registries.set(accountId, registry);
  }
  return registries.get(accountId)!;
}

/**
 * Get existing registry without initializing
 * Returns null if not yet initialized
 */
export function getExistingRegistry(accountId: string = hederaConfig.accountId): HederaAgentRegistry | null {
  return registries.get(accountId) || null;
}

/**
 * Clear all registries (for testing)
 */
export function clearRegistries(): void {
  registries.clear();
}
