/**
 * x402 Payment Protocol Integration
 * HTTP-native payments for agent-to-agent transactions
 */

// Client
export { 
  X402Client,
  x402Client,
} from './client';

export type {
  PaymentRequest,
  PaymentResponse,
  PaymentProof,
} from './client';

// Server
export {
  X402Server,
} from './server';

export type {
  PaymentVerificationResult,
  ReceivedPayment,
} from './server';

// Facilitator
export {
  X402Facilitator,
  x402Facilitator,
} from './facilitator';

export type {
  FacilitatorConfig,
  Settlement,
} from './facilitator';

// Verification
export {
  PaymentValidator,
  PaymentTracker,
  PaymentHelpers,
} from './verification';
