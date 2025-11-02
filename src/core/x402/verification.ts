/**
 * x402 Payment Verification Utilities
 * Helper functions for payment verification and validation
 */

import { PaymentProof } from './client';
import { X402Server, PaymentVerificationResult } from './server';

/**
 * Payment validator
 */
export class PaymentValidator {
  /**
   * Validate payment amount
   */
  static validateAmount(amount: number, min: number = 0, max?: number): boolean {
    if (amount <= min) {
      return false;
    }
    if (max && amount > max) {
      return false;
    }
    return true;
  }

  /**
   * Validate payment currency
   */
  static validateCurrency(currency: string, allowed: string[] = ['USDC', 'HBAR']): boolean {
    return allowed.includes(currency.toUpperCase());
  }

  /**
   * Validate Ethereum address
   */
  static validateAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Validate payment proof structure
   */
  static validateProofStructure(proof: any): boolean {
    const required = [
      'paymentId',
      'amount',
      'currency',
      'sender',
      'recipient',
      'timestamp',
      'signature',
    ];

    for (const field of required) {
      if (!(field in proof)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Validate payment proof
   */
  static async validateProof(
    proofString: string,
    expectedRecipient?: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      // Parse proof
      const proof: PaymentProof = JSON.parse(proofString);

      // Check structure
      if (!this.validateProofStructure(proof)) {
        return { valid: false, error: 'Invalid proof structure' };
      }

      // Validate amount
      if (!this.validateAmount(proof.amount, 0)) {
        return { valid: false, error: 'Invalid amount' };
      }

      // Validate currency
      if (!this.validateCurrency(proof.currency)) {
        return { valid: false, error: 'Unsupported currency' };
      }

      // Validate addresses
      if (!this.validateAddress(proof.sender)) {
        return { valid: false, error: 'Invalid sender address' };
      }
      if (!this.validateAddress(proof.recipient)) {
        return { valid: false, error: 'Invalid recipient address' };
      }

      // Check recipient if specified
      if (expectedRecipient && proof.recipient.toLowerCase() !== expectedRecipient.toLowerCase()) {
        return { valid: false, error: 'Recipient mismatch' };
      }

      // Check timestamp (not in future, not too old)
      const now = Date.now();
      if (proof.timestamp > now) {
        return { valid: false, error: 'Proof timestamp in future' };
      }
      if (now - proof.timestamp > 24 * 60 * 60 * 1000) {
        return { valid: false, error: 'Proof expired (>24h)' };
      }

      return { valid: true };

    } catch (error: any) {
      return { valid: false, error: `Validation failed: ${error.message}` };
    }
  }

  /**
   * Compare two payment proofs
   */
  static compareProofs(proof1: PaymentProof, proof2: PaymentProof): boolean {
    return (
      proof1.paymentId === proof2.paymentId &&
      proof1.amount === proof2.amount &&
      proof1.currency === proof2.currency &&
      proof1.sender.toLowerCase() === proof2.sender.toLowerCase() &&
      proof1.recipient.toLowerCase() === proof2.recipient.toLowerCase() &&
      proof1.signature === proof2.signature
    );
  }
}

/**
 * Payment tracker
 * Tracks payment states and history
 */
export class PaymentTracker {
  private payments: Map<string, {
    proof: PaymentProof;
    status: 'pending' | 'verified' | 'failed';
    verifiedAt?: number;
    error?: string;
  }> = new Map();

  /**
   * Add payment to tracker
   */
  addPayment(proof: PaymentProof): void {
    this.payments.set(proof.paymentId, {
      proof,
      status: 'pending',
    });
    console.log(`📝 Tracking payment: ${proof.paymentId}`);
  }

  /**
   * Mark payment as verified
   */
  markVerified(paymentId: string): void {
    const payment = this.payments.get(paymentId);
    if (payment) {
      payment.status = 'verified';
      payment.verifiedAt = Date.now();
      console.log(`✅ Payment verified: ${paymentId}`);
    }
  }

  /**
   * Mark payment as failed
   */
  markFailed(paymentId: string, error: string): void {
    const payment = this.payments.get(paymentId);
    if (payment) {
      payment.status = 'failed';
      payment.error = error;
      console.log(`❌ Payment failed: ${paymentId} - ${error}`);
    }
  }

  /**
   * Get payment status
   */
  getStatus(paymentId: string): 'pending' | 'verified' | 'failed' | 'unknown' {
    const payment = this.payments.get(paymentId);
    return payment ? payment.status : 'unknown';
  }

  /**
   * Get payment details
   */
  getPayment(paymentId: string) {
    return this.payments.get(paymentId);
  }

  /**
   * Get all verified payments
   */
  getVerifiedPayments(): PaymentProof[] {
    return Array.from(this.payments.values())
      .filter(p => p.status === 'verified')
      .map(p => p.proof);
  }

  /**
   * Get payment count by status
   */
  getCountByStatus(status: 'pending' | 'verified' | 'failed'): number {
    return Array.from(this.payments.values())
      .filter(p => p.status === status)
      .length;
  }

  /**
   * Clear old payments
   */
  clearOldPayments(olderThanMs: number = 24 * 60 * 60 * 1000): number {
    const cutoff = Date.now() - olderThanMs;
    let cleared = 0;

    for (const [paymentId, payment] of this.payments.entries()) {
      if (payment.proof.timestamp < cutoff) {
        this.payments.delete(paymentId);
        cleared++;
      }
    }

    return cleared;
  }
}

/**
 * Payment helper functions
 */
export class PaymentHelpers {
  /**
   * Format amount for display
   */
  static formatAmount(amount: number, currency: string): string {
    return `${amount.toFixed(6)} ${currency}`;
  }

  /**
   * Calculate service fee (if applicable)
   */
  static calculateFee(amount: number, feePercent: number = 1): number {
    return amount * (feePercent / 100);
  }

  /**
   * Get net amount after fee
   */
  static getNetAmount(amount: number, feePercent: number = 1): number {
    return amount - this.calculateFee(amount, feePercent);
  }

  /**
   * Convert USDC to smallest unit (6 decimals)
   */
  static toSmallestUnit(amount: number): bigint {
    return BigInt(Math.floor(amount * 1e6));
  }

  /**
   * Convert from smallest unit to USDC
   */
  static fromSmallestUnit(amount: bigint): number {
    return Number(amount) / 1e6;
  }

  /**
   * Generate payment description
   */
  static generateDescription(
    service: string,
    provider: string,
    timestamp?: number
  ): string {
    const time = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    return `${service} from ${provider} at ${time}`;
  }
}

export default {
  PaymentValidator,
  PaymentTracker,
  PaymentHelpers,
};
