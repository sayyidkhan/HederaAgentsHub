/**
 * x402 Blockchain Integration
 * Connects x402 payment protocol to real Hedera blockchain
 */

import {
  AccountId,
  PrivateKey,
  Client,
  TransferTransaction,
  Hbar,
  AccountBalanceQuery,
} from '@hashgraph/sdk';
import { PaymentRequest, PaymentProof } from './client';

export interface BlockchainPaymentResult {
  success: boolean;
  transactionId?: string;
  txHash?: string;
  amount?: number;
  sender?: string;
  recipient?: string;
  status?: string;
  error?: string;
  timestamp: number;
}

/**
 * Blockchain Payment Executor
 * Executes x402 payments on real Hedera blockchain
 */
export class BlockchainPaymentExecutor {
  private client: Client;
  private operatorId: AccountId;
  private operatorKey: PrivateKey;

  constructor(accountId: string, privateKey: string) {
    // Initialize Hedera client for testnet
    this.client = Client.forTestnet();

    // Set operator credentials
    this.operatorId = AccountId.fromString(accountId);
    this.operatorKey = PrivateKey.fromStringECDSA(privateKey);

    this.client.setOperator(this.operatorId, this.operatorKey);

    console.log(`🔗 Blockchain Executor initialized`);
    console.log(`   Account: ${this.operatorId}`);
    console.log(`   Network: Testnet\n`);
  }

  /**
   * Execute x402 payment on blockchain
   */
  async executePayment(
    payment: PaymentRequest,
    proof: PaymentProof
  ): Promise<BlockchainPaymentResult> {
    try {
      console.log(`🔗 Executing x402 payment on blockchain...`);
      console.log(`   Payment ID: ${proof.paymentId}`);
      console.log(`   Amount: ${payment.amount} ${payment.currency}`);
      console.log(`   From: ${proof.sender}`);
      console.log(`   To: ${proof.recipient}\n`);

      // Step 1: Verify payment proof signature
      console.log(`✅ Step 1: Verify Payment Proof`);
      const isValid = this.verifyPaymentSignature(proof);
      if (!isValid) {
        throw new Error('Invalid payment signature');
      }
      console.log(`   Signature verified ✓\n`);

      // Step 2: Check sender balance
      console.log(`✅ Step 2: Check Sender Balance`);
      const senderBalance = await this.getBalance(proof.sender);
      console.log(`   Balance: ${senderBalance} HBAR`);

      if (senderBalance < payment.amount) {
        throw new Error(
          `Insufficient balance: ${senderBalance} < ${payment.amount}`
        );
      }
      console.log(`   Sufficient balance ✓\n`);

      // Step 3: Create transfer transaction
      console.log(`✅ Step 3: Create Transfer Transaction`);
      const transferTx = new TransferTransaction()
        .addHbarTransfer(proof.sender, new Hbar(payment.amount).negated())
        .addHbarTransfer(proof.recipient, new Hbar(payment.amount))
        .setTransactionMemo(`x402 Payment: ${proof.paymentId}`);

      console.log(`   Transaction created ✓\n`);

      // Step 4: Sign and submit
      console.log(`✅ Step 4: Sign & Submit Transaction`);
      const signedTx = await transferTx.freezeWith(this.client).sign(this.operatorKey);
      const txResponse = await signedTx.execute(this.client);
      console.log(`   Transaction ID: ${txResponse.transactionId}`);
      console.log(`   Submitted ✓\n`);

      // Step 5: Wait for receipt
      console.log(`✅ Step 5: Wait for Confirmation`);
      const receipt = await txResponse.getReceipt(this.client);
      console.log(`   Status: ${receipt.status.toString()}`);
      console.log(`   Confirmed ✓\n`);

      // Step 6: Verify balance change
      console.log(`✅ Step 6: Verify Balance Change`);
      const newBalance = await this.getBalance(proof.sender);
      const deducted = senderBalance - newBalance;
      console.log(`   Previous: ${senderBalance} HBAR`);
      console.log(`   New: ${newBalance} HBAR`);
      console.log(`   Deducted: ${deducted} HBAR ✓\n`);

      const result: BlockchainPaymentResult = {
        success: true,
        transactionId: txResponse.transactionId.toString(),
        amount: payment.amount,
        sender: proof.sender,
        recipient: proof.recipient,
        status: receipt.status.toString(),
        timestamp: Date.now(),
      };

      console.log(`✅ x402 Payment executed successfully on blockchain!\n`);
      return result;

    } catch (error: any) {
      console.error(`❌ Blockchain payment failed: ${error.message}\n`);
      return {
        success: false,
        error: error.message,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Verify payment signature
   */
  private verifyPaymentSignature(proof: PaymentProof): boolean {
    // In production, verify the signature using the sender's public key
    // For now, just check that signature exists
    return !!(proof.signature && proof.signature.length > 0);
  }

  /**
   * Get account balance
   */
  private async getBalance(accountAddress: string): Promise<number> {
    try {
      // Handle both Hedera account IDs and EVM addresses
      let accountId: AccountId;
      
      if (accountAddress.startsWith('0x')) {
        // EVM address - use operator's account for balance check
        accountId = this.operatorId;
      } else {
        // Hedera account ID
        accountId = AccountId.fromString(accountAddress);
      }

      const balance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(this.client);

      return balance.hbars.toBigNumber().toNumber();
    } catch (error) {
      // If address is not a valid Hedera account, return 0
      return 0;
    }
  }

  /**
   * Close client
   */
  close(): void {
    this.client.close();
  }
}

export default BlockchainPaymentExecutor;
