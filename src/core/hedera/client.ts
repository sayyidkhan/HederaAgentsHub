import {
  Client,
  AccountId,
  PrivateKey,
  AccountBalance,
} from "@hashgraph/sdk";
import { hederaConfig } from "../config/index";

let hederaClient: Client | null = null;

/**
 * Initialize and return Hedera client
 */
export function getHederaClient(): Client {
  if (hederaClient) {
    return hederaClient;
  }

  if (!hederaConfig.accountId || !hederaConfig.privateKey) {
    throw new Error(
      "Missing HEDERA_ACCOUNT_ID or HEDERA_PRIVATE_KEY in environment"
    );
  }

  // Create client based on network
  if (hederaConfig.network === "mainnet") {
    hederaClient = Client.forMainnet();
  } else {
    hederaClient = Client.forTestnet();
  }

  // Set operator
  const accountId = AccountId.fromString(hederaConfig.accountId);
  
  let privateKey;
  try {
    // Try ECDSA format first
    privateKey = PrivateKey.fromStringECDSA(hederaConfig.privateKey);
  } catch (e) {
    try {
      // Try raw hex format
      privateKey = PrivateKey.fromString(hederaConfig.privateKey);
    } catch (e2) {
      throw new Error(
        `Invalid private key format. Expected ECDSA or raw hex format. Got: ${hederaConfig.privateKey.substring(0, 20)}...`
      );
    }
  }

  hederaClient.setOperator(accountId, privateKey);

  return hederaClient;
}

/**
 * Close Hedera client connection
 */
export function closeHederaClient(): void {
  if (hederaClient) {
    hederaClient.close();
    hederaClient = null;
  }
}

/**
 * Get account balance
 */
export async function getAccountBalance(): Promise<any> {
  const client = getHederaClient();
  const accountId = AccountId.fromString(hederaConfig.accountId);

  // Use query instead of direct method
  const { AccountBalanceQuery } = await import("@hashgraph/sdk");
  return await new AccountBalanceQuery()
    .setAccountId(accountId)
    .execute(client);
}

/**
 * Get account info
 */
export async function getAccountInfo() {
  const client = getHederaClient();
  const accountId = AccountId.fromString(hederaConfig.accountId);

  const { AccountInfoQuery } = await import("@hashgraph/sdk");
  const query = await new AccountInfoQuery()
    .setAccountId(accountId)
    .execute(client);
  return query;
}

/**
 * Format HBAR amount (convert from tinybar)
 */
export function formatHbar(hbar: any): number {
  try {
    // Handle Hbar object with to() method
    if (typeof hbar === "object" && hbar.to) {
      const result = hbar.to("hbar");
      return typeof result === "number" ? result : parseFloat(result);
    }
    // Handle Hbar object with toTinybars() method
    if (typeof hbar === "object" && hbar.toTinybars) {
      const tinybars = hbar.toTinybars();
      return tinybars / 100000000;
    }
    // Handle plain number (tinybar)
    if (typeof hbar === "number") {
      return hbar / 100000000;
    }
    // Handle string
    if (typeof hbar === "string") {
      return parseFloat(hbar) / 100000000;
    }
  } catch (e) {
    console.warn("Error formatting HBAR:", e);
  }
  return 0;
}
