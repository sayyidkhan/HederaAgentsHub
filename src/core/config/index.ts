import dotenv from "dotenv";
import { HederaConfig } from "../types/index";

dotenv.config();

export const hederaConfig: HederaConfig = {
  accountId: process.env.HEDERA_ACCOUNT_ID || "",
  privateKey: process.env.HEDERA_PRIVATE_KEY || "",
  network: (process.env.HEDERA_NETWORK as "testnet" | "mainnet") || "testnet",
  jsonRpcUrl: process.env.JSON_RPC_URL || "https://testnet.hashio.io/api",
  mirrorNodeUrl:
    process.env.MIRROR_NODE_URL ||
    "https://testnet.mirrornode.hedera.com/api/v1",
  chainId: parseInt(process.env.CHAIN_ID || "296"),
};

// Agent Registry Topic ID (optional - if set, reuses existing topic instead of creating new one)
export const agentRegistryTopicId = process.env.AGENT_REGISTRY_TOPIC_ID || null;

export const contractAddresses = {
  identityRegistry: process.env.IDENTITY_REGISTRY || "",
  reputationRegistry: process.env.REPUTATION_REGISTRY || "",
  validationRegistry: process.env.VALIDATION_REGISTRY || "",
  usdcToken: process.env.USDC_TOKEN_ID || "0.0.429274",
};

export const x402Config = {
  facilitatorUrl:
    process.env.FACILITATOR_URL ||
    "https://x402-hedera-production.up.railway.app",
};

export function validateConfig(): boolean {
  const required = [
    "HEDERA_ACCOUNT_ID",
    "HEDERA_PRIVATE_KEY",
    "IDENTITY_REGISTRY",
    "REPUTATION_REGISTRY",
    "VALIDATION_REGISTRY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      "⚠️  Missing environment variables:",
      missing.join(", ")
    );
    console.warn("Please copy .env.example to .env and fill in your values");
    return false;
  }

  return true;
}
