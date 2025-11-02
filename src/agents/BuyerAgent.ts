/**
 * BuyerAgent - Autonomous shopping agent
 * Searches for products, negotiates, and completes purchases
 */

import { BaseAgent } from './BaseAgent';
import { X402Client } from '../core/x402';
import { searchAgentsByCapability, getAgentMetadata, getAgentOwner } from '../core/erc8004/identity';
import { getReputationSummary } from '../core/erc8004/reputation';

export interface PurchaseRequest {
  product: string;
  maxPrice: number;
  currency: string;
  requirements?: string[];
}

export interface PurchaseResult {
  success: boolean;
  seller: string;
  sellerName?: string;
  product: string;
  price: number;
  paymentId: string;
  receipt?: any;
  error?: string;
}

export interface SellerInfo {
  agentId: string;
  name: string;
  address: string;
  price: number;
  trustScore: number;
  description: string;
}

export class BuyerAgent extends BaseAgent {
  private paymentClient: X402Client;
  private budget: number;

  constructor(budget: number = 1000) {
    super({
      name: 'Smart Buyer',
      description: 'Autonomous shopping agent that finds best deals',
      capabilities: ['product-search', 'price-comparison', 'purchase-automation'],
      serviceUrl: 'http://localhost:3003',
      price: 0,
      currency: 'SGD',
    });

    this.budget = budget;
    this.paymentClient = new X402Client();
  }

  /**
   * Find sellers for a product
   */
  async findSellers(productType: string): Promise<SellerInfo[]> {
    console.log(`🔍 Searching for ${productType} sellers via ERC-8004...`);

    // Search for agents with matching capabilities
    const agentIds = await searchAgentsByCapability(productType.toLowerCase());
    const sellers: SellerInfo[] = [];

    for (const agentId of agentIds) {
      // Get metadata
      const metadata = await getAgentMetadata(agentId);
      if (!metadata) continue;
      
      // Get owner address
      const owner = await getAgentOwner(agentId);
      if (!owner) continue;

      // Get reputation
      const reputation = await getReputationSummary(agentId);

      // Extract price from metadata
      const price = metadata.price || 999;

      sellers.push({
        agentId,
        name: metadata.name,
        address: owner,
        price,
        trustScore: reputation?.trustScore || 0,
        description: metadata.description,
      });
    }

    console.log(`Found ${sellers.length} sellers\n`);
    return sellers;
  }

  /**
   * Check if price is within budget
   */
  checkPriceRange(price: number, maxPrice?: number): boolean {
    const limit = maxPrice || this.budget;
    const withinBudget = price <= limit;

    console.log(`💰 Price Check:`);
    console.log(`   Price: ${price} SGD`);
    console.log(`   Budget: ${limit} SGD`);
    console.log(`   Status: ${withinBudget ? '✓ Within budget' : '✗ Over budget'}\n`);

    return withinBudget;
  }

  /**
   * Select best seller based on price and reputation
   */
  selectBestSeller(sellers: SellerInfo[], maxPrice?: number): SellerInfo | null {
    console.log(`📊 Evaluating sellers...\n`);

    // Filter by budget
    const affordable = sellers.filter(s => this.checkPriceRange(s.price, maxPrice));

    if (affordable.length === 0) {
      console.log(`❌ No sellers within budget\n`);
      return null;
    }

    // Sort by trust score (descending), then by price (ascending)
    affordable.sort((a, b) => {
      if (b.trustScore !== a.trustScore) {
        return b.trustScore - a.trustScore;
      }
      return a.price - b.price;
    });

    const best = affordable[0];
    console.log(`✅ Best seller selected:`);
    console.log(`   Name: ${best.name}`);
    console.log(`   Price: ${best.price} SGD`);
    console.log(`   Trust Score: ${best.trustScore}%\n`);

    return best;
  }

  /**
   * Establish contract with seller
   */
  async establishContract(
    seller: SellerInfo,
    product: string,
    price: number
  ): Promise<boolean> {
    console.log(`🤝 Establishing contract with ${seller.name}...`);
    console.log(`   Product: ${product}`);
    console.log(`   Price: ${price} SGD`);
    console.log(`   Seller Trust: ${seller.trustScore}%\n`);

    // Check if seller is trustworthy (minimum 50% for medium-stake)
    if (seller.trustScore < 50 && seller.trustScore > 0) {
      console.log(`⚠️  Warning: Low trust score (${seller.trustScore}%)`);
      console.log(`   Proceeding with caution...\n`);
    }

    // Simulate contract negotiation
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log(`✅ Contract established successfully\n`);
    return true;
  }

  /**
   * Complete purchase
   */
  async purchaseProduct(
    request: PurchaseRequest,
    preSelectedSeller?: SellerInfo
  ): Promise<PurchaseResult> {
    try {
      console.log(`\n🛒 BUYER AGENT: Starting Purchase Flow`);
      console.log(`   Product: ${request.product}`);
      console.log(`   Budget: ${request.maxPrice} ${request.currency}\n`);
      console.log('='.repeat(60));

      // If seller already selected, skip search
      if (preSelectedSeller) {
        const seller = preSelectedSeller;

        // Check price within range
        if (!this.checkPriceRange(seller.price, request.maxPrice)) {
          throw new Error(`Price ${seller.price} exceeds budget ${request.maxPrice}`);
        }

        // Send payment via x402
        console.log(`💳 Sending payment to ${seller.name}...`);
        const payment = await this.paymentClient.makePayment({
          amount: seller.price,
          currency: request.currency,
          recipient: seller.address,
          description: `Payment for ${request.product}`,
          metadata: {
            product: request.product,
            seller: seller.name,
            buyerAgent: this.getName(),
          },
        });

        if (!payment.success) {
          throw new Error(`Payment failed: ${payment.error}`);
        }

        console.log(`✅ Payment successful!`);
        console.log(`   Payment ID: ${payment.paymentId}`);
        console.log(`   Amount: ${seller.price} ${request.currency}\n`);

        const result: PurchaseResult = {
          success: true,
          seller: seller.agentId,
          sellerName: seller.name,
          product: request.product,
          price: seller.price,
          paymentId: payment.paymentId,
        };

        console.log(`✅ Purchase completed successfully!\n`);
        console.log('='.repeat(60));

        return result;
      }

      // Step 1: Find sellers using ERC-8004
      const sellers = await this.findSellers(request.product);

      if (sellers.length === 0) {
        throw new Error('No sellers found for this product');
      }

      // Step 2: Check prices and select best seller
      const seller = this.selectBestSeller(sellers, request.maxPrice);

      if (!seller) {
        throw new Error('No sellers within budget');
      }

      // Step 3: Check price within range
      if (!this.checkPriceRange(seller.price, request.maxPrice)) {
        throw new Error(`Price ${seller.price} exceeds budget ${request.maxPrice}`);
      }

      // Step 4: Establish contract
      const contractEstablished = await this.establishContract(
        seller,
        request.product,
        seller.price
      );

      if (!contractEstablished) {
        throw new Error('Failed to establish contract');
      }

      // Step 5: Send payment via x402
      console.log(`💳 Sending payment to seller...`);
      const payment = await this.paymentClient.makePayment({
        amount: seller.price,
        currency: request.currency,
        recipient: seller.address,
        description: `Payment for ${request.product}`,
        metadata: {
          product: request.product,
          seller: seller.name,
          buyerAgent: this.getName(),
        },
      });

      if (!payment.success) {
        throw new Error(`Payment failed: ${payment.error}`);
      }

      console.log(`✅ Payment successful!`);
      console.log(`   Payment ID: ${payment.paymentId}`);
      console.log(`   Amount: ${seller.price} ${request.currency}\n`);

      // Step 6: Return purchase result
      const result: PurchaseResult = {
        success: true,
        seller: seller.agentId,
        sellerName: seller.name,
        product: request.product,
        price: seller.price,
        paymentId: payment.paymentId,
      };

      console.log(`✅ Purchase completed successfully!\n`);
      console.log('='.repeat(60));

      return result;

    } catch (error: any) {
      console.error(`❌ Purchase failed: ${error.message}\n`);
      return {
        success: false,
        seller: '',
        product: request.product,
        price: 0,
        paymentId: '',
        error: error.message,
      };
    }
  }

  /**
   * Rate seller after purchase
   */
  async rateSeller(
    sellerId: string,
    rating: number,
    comment: string,
    paymentId: string
  ): Promise<void> {
    console.log(`⭐ Rating seller...`);
    await this.submitFeedback(sellerId, rating, comment, paymentId);
    console.log(`✅ Feedback submitted\n`);
  }

  /**
   * Get budget
   */
  getBudget(): number {
    return this.budget;
  }

  /**
   * Set budget
   */
  setBudget(amount: number): void {
    this.budget = amount;
    console.log(`💰 Budget updated: ${amount} SGD`);
  }

  /**
   * Perform service (not applicable for buyer)
   */
  async performService(input: any): Promise<any> {
    throw new Error('BuyerAgent does not provide services');
  }
}

export default BuyerAgent;
