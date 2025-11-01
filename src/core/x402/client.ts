/**
 * x402 Payment Client
 * HTTP-native payment protocol for agent-to-agent transactions
 */

import { ethers } from 'ethers';
import { hederaConfig } from '../config/index';

export interface PaymentRequest {
  amount: number;           // Amount in USDC (e.g., 0.01)
  currency: string;         // "USDC"
  recipient: string;        // Recipient address
  description?: string;     // Payment description
  metadata?: any;          // Additional data
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  proof: string;           // x402 payment proof
  txHash?: string;         // Transaction hash
  timestamp: number;
  error?: string;
}

export interface PaymentProof {
  paymentId: string;
  amount: number;
  currency: string;
  sender: string;
  recipient: string;
  timestamp: number;
  signature: string;
  txHash?: string;
}

/**
 * x402 Payment Client
 * Handles payment requests and proof generation
 */
export class X402Client {
  private wallet: ethers.Wallet;
  private facilitatorUrl: string;

  constructor(privateKey?: string, facilitatorUrl?: string) {
    this.wallet = new ethers.Wallet(
      privateKey || hederaConfig.privateKey
    );
    this.facilitatorUrl = facilitatorUrl || 
      process.env.FACILITATOR_URL || 
      'https://x402-hedera-production.up.railway.app';
  }

  /**
   * Make a payment
   */
  async makePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log(`💳 Making payment: ${request.amount} ${request.currency}`);
      console.log(`   From: ${this.wallet.address}`);
      console.log(`   To: ${request.recipient}`);

      // Generate payment ID
      const paymentId = this.generatePaymentId();

      // Create payment data
      const paymentData = {
        paymentId,
        amount: request.amount,
        currency: request.currency,
        sender: this.wallet.address,
        recipient: request.recipient,
        timestamp: Date.now(),
        description: request.description,
        metadata: request.metadata,
      };

      // Sign payment data
      const signature = await this.signPayment(paymentData);

      // Create proof
      const proof: PaymentProof = {
        paymentId,
        amount: request.amount,
        currency: request.currency,
        sender: this.wallet.address,
        recipient: request.recipient,
        timestamp: paymentData.timestamp,
        signature,
      };

      // In production, submit to facilitator
      // For now, simulate payment
      const response: PaymentResponse = {
        success: true,
        paymentId,
        proof: JSON.stringify(proof),
        timestamp: paymentData.timestamp,
      };

      console.log(`✅ Payment successful: ${paymentId}`);
      
      return response;

    } catch (error: any) {
      console.error(`❌ Payment failed:`, error.message);
      return {
        success: false,
        paymentId: '',
        proof: '',
        timestamp: Date.now(),
        error: error.message,
      };
    }
  }

  /**
   * Sign payment data
   */
  private async signPayment(paymentData: any): Promise<string> {
    const message = ethers.solidityPackedKeccak256(
      ['string', 'uint256', 'string', 'address', 'address', 'uint256'],
      [
        paymentData.paymentId,
        Math.floor(paymentData.amount * 1e6), // Convert to 6 decimals for USDC
        paymentData.currency,
        paymentData.sender,
        paymentData.recipient,
        paymentData.timestamp,
      ]
    );

    return await this.wallet.signMessage(ethers.getBytes(message));
  }

  /**
   * Generate unique payment ID
   */
  private generatePaymentId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `x402_${timestamp}_${random}`;
  }

  /**
   * Get wallet address
   */
  getAddress(): string {
    return this.wallet.address;
  }

  /**
   * Request payment from another party
   */
  async requestPayment(
    from: string,
    amount: number,
    currency: string = 'USDC',
    description?: string
  ): Promise<string> {
    const paymentId = this.generatePaymentId();
    
    const request = {
      paymentId,
      from,
      to: this.wallet.address,
      amount,
      currency,
      description,
      timestamp: Date.now(),
    };

    console.log(`📨 Payment request created: ${paymentId}`);
    console.log(`   Amount: ${amount} ${currency}`);
    console.log(`   From: ${from}`);
    
    return paymentId;
  }

  /**
   * Parse payment proof
   */
  static parseProof(proofString: string): PaymentProof {
    try {
      return JSON.parse(proofString);
    } catch (error) {
      throw new Error('Invalid payment proof format');
    }
  }

  /**
   * Get payment details from proof
   */
  static getPaymentDetails(proofString: string): {
    amount: number;
    sender: string;
    recipient: string;
    timestamp: number;
  } {
    const proof = X402Client.parseProof(proofString);
    return {
      amount: proof.amount,
      sender: proof.sender,
      recipient: proof.recipient,
      timestamp: proof.timestamp,
    };
  }
}

// Export singleton instance
export const x402Client = new X402Client();

export default X402Client;
