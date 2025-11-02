/**
 * Core type definitions for HederaAgentsHub
 */

// ERC-8004 Types
export interface Agent {
  id: string;
  name: string;
  address: string;
  capabilities: string[];
  serviceUrl: string;
  price: number;
  reputation: number;
  createdAt: number;
}

export interface AgentMetadata {
  name: string;
  description: string;
  capabilities: string[];
  serviceUrl: string;
  price: number;
  currency: string;
}

export interface Feedback {
  agentId: string;
  rating: number;
  comment: string;
  paymentProof?: string;
  timestamp: number;
}

export interface ReputationScore {
  agentId: string;
  averageRating: number;
  totalReviews: number;
  trustScore: number;
}

// x402 Payment Types
export interface PaymentRequirement {
  scheme: string;
  network: string;
  maxAmountRequired: string;
  resource: string;
  description: string;
  mimeType: string;
  payTo: string;
  maxTimeoutSeconds: number;
  asset: string;
  extra?: Record<string, unknown>;
}

export interface PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: Record<string, unknown>;
}

export interface PaymentResponse {
  success: boolean;
  error?: string;
  txHash?: string;
  networkId?: string;
}

// Hedera Types
export interface HederaConfig {
  accountId: string;
  privateKey: string;
  network: "testnet" | "mainnet";
  jsonRpcUrl: string;
  mirrorNodeUrl: string;
  chainId: number;
}

export interface TokenInfo {
  tokenId: string;
  balance: string;
  decimals: number;
}

// Service Request/Response
export interface ServiceRequest {
  agentId: string;
  input: unknown;
  amount: number;
  currency: string;
}

export interface ServiceResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  paymentTxHash?: string;
}
