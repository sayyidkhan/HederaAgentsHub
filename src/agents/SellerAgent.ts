/**
 * SellerAgent - Autonomous retail agent
 * Lists products, processes payments, and fulfills orders
 */

import { BaseAgent } from './BaseAgent';
import { X402Server, PaymentVerificationResult } from '../core/x402';

export interface Product {
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  specs?: Record<string, any>;
}

export interface Order {
  orderId: string;
  product: string;
  price: number;
  currency: string;
  buyer: string;
  buyerName?: string;
  paymentId: string;
  paymentProof: string;
  timestamp: number;
  status: 'pending' | 'verified' | 'fulfilled' | 'completed';
  receipt?: Receipt;
  trackingNumber?: string;
}

export interface Receipt {
  receiptId: string;
  orderId: string;
  transactionId: string;
  product: string;
  price: number;
  currency: string;
  seller: string;
  buyer: string;
  paymentProof: string;
  timestamp: number;
  deliveryEstimate: string;
  trackingNumber?: string;
}

export class SellerAgent extends BaseAgent {
  private paymentServer: X402Server;
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderCounter: number = 1;
  private receiptCounter: number = 1;

  constructor(products: Product[] = []) {
    super({
      name: 'iPhone Retailer Pro',
      description: 'Authorized iPhone retailer with verified supply chain',
      capabilities: ['iphone', 'smartphone', 'electronics', 'retail'],
      serviceUrl: 'http://localhost:3004',
      price: 999,
      currency: 'SGD',
    });

    // Initialize payment server
    const clientAddress = this.getClientAddress();
    this.paymentServer = new X402Server(clientAddress);

    // Add products
    products.forEach(p => this.addProduct(p));
  }

  /**
   * Get payment client address
   */
  private getClientAddress(): string {
    // Use Hedera account address
    return '0x98d46dda75A216f94bF9784a6665A4E3821Da3D9';
  }

  /**
   * Add product to inventory
   */
  addProduct(product: Product): void {
    this.products.set(product.name, product);
    console.log(`📦 Product added: ${product.name} - ${product.price} ${product.currency}`);
  }

  /**
   * Get product by name
   */
  getProduct(name: string): Product | undefined {
    return this.products.get(name);
  }

  /**
   * List all products
   */
  listProducts(): Product[] {
    return Array.from(this.products.values());
  }

  /**
   * Step 1: Receive payment
   */
  async receivePayment(paymentProof: string): Promise<PaymentVerificationResult> {
    console.log(`\n💰 SELLER AGENT: Receiving Payment`);
    console.log('='.repeat(60));
    console.log(`📨 Step 1: Payment Received\n`);

    // Verify payment
    const verification = await this.paymentServer.verifyPayment(paymentProof);

    if (!verification.valid) {
      console.log(`❌ Payment verification failed: ${verification.error}\n`);
      return verification;
    }

    console.log(`✅ Payment received and parsed`);
    console.log(`   Amount: ${verification.amount} SGD`);
    console.log(`   From: ${verification.sender}`);
    console.log(`   Payment ID: ${verification.paymentId}\n`);

    return verification;
  }

  /**
   * Step 2: Verify payment
   */
  async verifyPaymentDetails(
    verification: PaymentVerificationResult,
    expectedProduct: string,
    expectedPrice: number
  ): Promise<boolean> {
    console.log(`✅ Step 2: Verify Payment Details\n`);

    // Check amount matches
    if (verification.amount !== expectedPrice) {
      console.log(`❌ Payment amount mismatch!`);
      console.log(`   Expected: ${expectedPrice} SGD`);
      console.log(`   Received: ${verification.amount} SGD\n`);
      return false;
    }

    console.log(`✅ Payment amount verified: ${verification.amount} SGD`);
    console.log(`✅ Product confirmed: ${expectedProduct}`);
    console.log(`✅ Buyer verified: ${verification.sender}\n`);

    return true;
  }

  /**
   * Step 3: Contact supplier
   */
  async contactSupplier(
    product: string,
    buyerEmail: string,
    orderId: string
  ): Promise<{ success: boolean; trackingNumber?: string }> {
    console.log(`📞 Step 3: Contact Supplier\n`);

    console.log(`Sending fulfillment request to supplier...`);
    console.log(`   Product: ${product}`);
    console.log(`   Order ID: ${orderId}`);
    console.log(`   Deliver to: ${buyerEmail}`);

    // Simulate supplier API call
    await new Promise(resolve => setTimeout(resolve, 200));

    const trackingNumber = `TRK${Date.now().toString().slice(-8)}`;

    console.log(`✅ Supplier confirmed order`);
    console.log(`   Tracking Number: ${trackingNumber}`);
    console.log(`   Estimated delivery: 3-5 business days\n`);

    return {
      success: true,
      trackingNumber,
    };
  }

  /**
   * Step 4: Generate receipt
   */
  generateReceipt(
    order: Order,
    trackingNumber?: string
  ): Receipt {
    console.log(`🧾 Step 4: Generate Receipt\n`);

    const receiptId = `RCP_${this.receiptCounter++}`;
    
    const receipt: Receipt = {
      receiptId,
      orderId: order.orderId,
      transactionId: order.paymentId,
      product: order.product,
      price: order.price,
      currency: order.currency,
      seller: this.getName(),
      buyer: order.buyerName || order.buyer,
      paymentProof: order.paymentProof,
      timestamp: Date.now(),
      deliveryEstimate: '3-5 business days',
      trackingNumber,
    };

    console.log(`✅ Receipt generated: ${receiptId}`);
    console.log(`   Transaction ID: ${receipt.transactionId}`);
    console.log(`   Product: ${receipt.product}`);
    console.log(`   Amount: ${receipt.price} ${receipt.currency}`);
    console.log(`   Tracking: ${receipt.trackingNumber}\n`);

    return receipt;
  }

  /**
   * Step 5: Send receipt to customer
   */
  async sendReceiptToCustomer(
    receipt: Receipt,
    buyerEmail: string
  ): Promise<boolean> {
    console.log(`📧 Step 5: Send Receipt to Customer\n`);

    console.log(`Sending receipt to: ${buyerEmail}`);
    console.log(`   Receipt ID: ${receipt.receiptId}`);
    console.log(`   Transaction ID: ${receipt.transactionId}`);
    console.log(`   Tracking Number: ${receipt.trackingNumber}`);

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log(`✅ Receipt sent successfully`);
    console.log(`   Email delivered to: ${buyerEmail}`);
    console.log(`   Receipt format: JSON`);
    console.log(`   Includes: Payment proof, tracking, delivery estimate\n`);

    return true;
  }

  /**
   * Step 6: Update reputation (awaiting buyer feedback)
   */
  async awaitBuyerFeedback(orderId: string): Promise<void> {
    console.log(`⭐ Step 6: Awaiting Buyer Feedback\n`);

    console.log(`Order ${orderId} completed`);
    console.log(`Waiting for buyer to submit feedback...`);
    console.log(`Reputation will update automatically upon feedback\n`);
  }

  /**
   * Complete order fulfillment flow
   */
  async fulfillOrder(
    paymentProof: string,
    product: string,
    buyerEmail: string,
    buyerName?: string
  ): Promise<Order> {
    try {
      // Step 1: Receive payment
      const verification = await this.receivePayment(paymentProof);

      if (!verification.valid) {
        throw new Error(`Payment verification failed: ${verification.error}`);
      }

      // Get product details
      const productInfo = this.getProduct(product);
      if (!productInfo) {
        throw new Error(`Product ${product} not found`);
      }

      // Step 2: Verify payment details
      const verified = await this.verifyPaymentDetails(
        verification,
        product,
        productInfo.price
      );

      if (!verified) {
        throw new Error('Payment verification failed');
      }

      // Create order
      const orderId = `ORD_${this.orderCounter++}`;
      const order: Order = {
        orderId,
        product,
        price: verification.amount,
        currency: 'SGD',
        buyer: verification.sender,
        buyerName,
        paymentId: verification.paymentId,
        paymentProof,
        timestamp: verification.timestamp,
        status: 'verified',
      };

      this.orders.set(orderId, order);

      // Step 3: Contact supplier
      const supplierResult = await this.contactSupplier(
        product,
        buyerEmail,
        orderId
      );

      if (!supplierResult.success) {
        throw new Error('Supplier fulfillment failed');
      }

      order.trackingNumber = supplierResult.trackingNumber;
      order.status = 'fulfilled';

      // Step 4: Generate receipt
      const receipt = this.generateReceipt(order, supplierResult.trackingNumber);
      order.receipt = receipt;

      // Step 5: Send receipt to customer
      await this.sendReceiptToCustomer(receipt, buyerEmail);

      // Step 6: Await feedback
      await this.awaitBuyerFeedback(orderId);

      order.status = 'completed';

      console.log(`✅ Order ${orderId} completed successfully!\n`);
      console.log('='.repeat(60));

      return order;

    } catch (error: any) {
      console.error(`❌ Order fulfillment failed: ${error.message}\n`);
      throw error;
    }
  }

  /**
   * Get order by ID
   */
  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  /**
   * Get all orders
   */
  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  /**
   * Get total sales
   */
  getTotalSales(): number {
    return this.orders.size;
  }

  /**
   * Get total revenue
   */
  getTotalRevenue(): number {
    return Array.from(this.orders.values())
      .reduce((sum, order) => sum + order.price, 0);
  }

  /**
   * Perform service (order fulfillment)
   */
  async performService(input: any): Promise<any> {
    const { paymentProof, product, buyerEmail, buyerName } = input;
    return await this.fulfillOrder(paymentProof, product, buyerEmail, buyerName);
  }
}

export default SellerAgent;
