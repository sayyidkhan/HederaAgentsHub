/**
 * x402 Payment Server
 * Receives and verifies x402 payments
 */

import { ethers } from 'ethers';
import { PaymentProof } from './client';

export interface PaymentVerificationResult {
  valid: boolean;
  paymentId: string;
  amount: number;
  sender: string;
  recipient: string;
  timestamp: number;
  error?: string;
}

export interface ReceivedPayment {
  paymentId: string;
  amount: number;
  currency: string;
  sender: string;
  recipient: string;
  timestamp: number;
  verified: boolean;
  proof: string;
}

/**
 * x402 Payment Server
 * Handles payment receipt and verification
 */
export class X402Server {
  private receivedPayments: Map<string, ReceivedPayment> = new Map();
  private expectedAddress: string;

  constructor(expectedAddress: string) {
    this.expectedAddress = expectedAddress;
  }

  /**
   * Verify payment proof
   */
  async verifyPayment(proofString: string): Promise<PaymentVerificationResult> {
    try {
      // Parse proof
      const proof: PaymentProof = JSON.parse(proofString);

      console.log(`🔍 Verifying payment: ${proof.paymentId}`);
      console.log(`   Amount: ${proof.amount} ${proof.currency}`);
      console.log(`   From: ${proof.sender}`);
      console.log(`   To: ${proof.recipient}`);

      // Check recipient matches expected address
      if (proof.recipient.toLowerCase() !== this.expectedAddress.toLowerCase()) {
        throw new Error(`Payment not for this recipient. Expected: ${this.expectedAddress}, Got: ${proof.recipient}`);
      }

      // Verify signature
      const isValid = await this.verifySignature(proof);
      
      if (!isValid) {
        throw new Error('Invalid payment signature');
      }

      // Check if not expired (24 hours)
      const age = Date.now() - proof.timestamp;
      if (age > 24 * 60 * 60 * 1000) {
        throw new Error('Payment proof expired');
      }

      // Check if not already processed
      if (this.receivedPayments.has(proof.paymentId)) {
        console.log(`⚠️  Payment already processed: ${proof.paymentId}`);
        return {
          valid: false,
          paymentId: proof.paymentId,
          amount: proof.amount,
          sender: proof.sender,
          recipient: proof.recipient,
          timestamp: proof.timestamp,
          error: 'Payment already processed',
        };
      }

      // Store verified payment
      this.receivedPayments.set(proof.paymentId, {
        paymentId: proof.paymentId,
        amount: proof.amount,
        currency: proof.currency,
        sender: proof.sender,
        recipient: proof.recipient,
        timestamp: proof.timestamp,
        verified: true,
        proof: proofString,
      });

      console.log(`✅ Payment verified: ${proof.paymentId}`);

      return {
        valid: true,
        paymentId: proof.paymentId,
        amount: proof.amount,
        sender: proof.sender,
        recipient: proof.recipient,
        timestamp: proof.timestamp,
      };

    } catch (error: any) {
      console.error(`❌ Payment verification failed:`, error.message);
      return {
        valid: false,
        paymentId: '',
        amount: 0,
        sender: '',
        recipient: '',
        timestamp: Date.now(),
        error: error.message,
      };
    }
  }

  /**
   * Verify payment signature
   */
  private async verifySignature(proof: PaymentProof): Promise<boolean> {
    try {
      // Reconstruct message
      const message = ethers.solidityPackedKeccak256(
        ['string', 'uint256', 'string', 'address', 'address', 'uint256'],
        [
          proof.paymentId,
          Math.floor(proof.amount * 1e6), // Convert to 6 decimals for USDC
          proof.currency,
          proof.sender,
          proof.recipient,
          proof.timestamp,
        ]
      );

      // Recover signer from signature
      const recoveredAddress = ethers.verifyMessage(
        ethers.getBytes(message),
        proof.signature
      );

      // Check if signer matches sender
      return recoveredAddress.toLowerCase() === proof.sender.toLowerCase();

    } catch (error) {
      return false;
    }
  }

  /**
   * Get received payment by ID
   */
  getPayment(paymentId: string): ReceivedPayment | null {
    return this.receivedPayments.get(paymentId) || null;
  }

  /**
   * Get all received payments
   */
  getAllPayments(): ReceivedPayment[] {
    return Array.from(this.receivedPayments.values());
  }

  /**
   * Get payments from specific sender
   */
  getPaymentsFrom(sender: string): ReceivedPayment[] {
    return Array.from(this.receivedPayments.values())
      .filter(p => p.sender.toLowerCase() === sender.toLowerCase());
  }

  /**
   * Get total received from sender
   */
  getTotalReceived(sender: string): number {
    return this.getPaymentsFrom(sender)
      .reduce((sum, p) => sum + p.amount, 0);
  }

  /**
   * Check if payment exists
   */
  hasPayment(paymentId: string): boolean {
    return this.receivedPayments.has(paymentId);
  }

  /**
   * Get payment count
   */
  getPaymentCount(): number {
    return this.receivedPayments.size;
  }

  /**
   * Clear old payments (older than 30 days)
   */
  clearOldPayments(): number {
    const cutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
    let cleared = 0;

    for (const [paymentId, payment] of this.receivedPayments.entries()) {
      if (payment.timestamp < cutoff) {
        this.receivedPayments.delete(paymentId);
        cleared++;
      }
    }

    if (cleared > 0) {
      console.log(`🧹 Cleared ${cleared} old payments`);
    }

    return cleared;
  }

  /**
   * Export payment records
   */
  exportPayments(): string {
    return JSON.stringify(this.getAllPayments(), null, 2);
  }
}

export default X402Server;
