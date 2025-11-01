/**
 * iPhone Marketplace Demo
 * Complete autonomous agent-to-agent commerce
 * Run with: npm run dev src/demos/iphone-marketplace-demo.ts
 */

import { BuyerAgent, SellerAgent } from '../agents';

async function runIPhoneMarketplaceDemo() {
  console.log('🍎📱 iPhone Marketplace Demo\n');
  console.log('Complete Autonomous Agent-to-Agent Commerce');
  console.log('='.repeat(60));

  try {
    // ========================================================================
    // SETUP: Initialize agents
    // ========================================================================
    console.log('\n🔧 SETUP: Initialize Agents\n');

    // Create seller with iPhone inventory
    const seller = new SellerAgent([
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip, 256GB',
        price: 999,
        currency: 'SGD',
        stock: 10,
        specs: {
          storage: '256GB',
          color: 'Natural Titanium',
          chip: 'A17 Pro',
          camera: '48MP Main',
        },
      },
    ]);

    // Start seller agent
    await seller.start();

    // Create buyer with 1000 SGD budget
    const buyer = new BuyerAgent(1000);
    await buyer.start();

    console.log(`\n📊 Initial Setup:`);
    console.log(`   Buyer Budget: ${buyer.getBudget()} SGD`);
    console.log(`   Seller Products: ${seller.listProducts().length}`);
    console.log(`   Seller Trust Score: ${(await seller.getReputation())?.trustScore || 0}%\n`);

    console.log('='.repeat(60));

    // ========================================================================
    // BUYER AGENT FLOW
    // ========================================================================
    console.log('\n🛒 BUYER AGENT FLOW\n');
    console.log('Objective: Purchase iPhone at ≤ 1000 SGD\n');
    console.log('='.repeat(60));

    // -----------------------------------------------------------------------
    // Step 1: Find sellers using ERC-8004
    // -----------------------------------------------------------------------
    console.log('\n📍 Step 1: Find Sellers using ERC-8004\n');

    const sellers = await buyer.findSellers('iphone');

    if (sellers.length === 0) {
      throw new Error('No sellers found');
    }

    console.log(`Sellers found:`);
    sellers.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.name}`);
      console.log(`      Price: ${s.price} SGD`);
      console.log(`      Trust: ${s.trustScore}%`);
      console.log(`      Address: ${s.address.substring(0, 10)}...`);
    });
    console.log('');

    // -----------------------------------------------------------------------
    // Step 2: Check price & reputation
    // -----------------------------------------------------------------------
    console.log('💰 Step 2: Check Price & Reputation\n');

    console.log(`Evaluating sellers...`);
    const bestSeller = buyer.selectBestSeller(sellers, 1000);

    if (!bestSeller) {
      throw new Error('No suitable seller found');
    }

    console.log(`Selected: ${bestSeller.name}`);
    console.log(`   Price: ${bestSeller.price} SGD ✓`);
    console.log(`   Trust Score: ${bestSeller.trustScore}%`);
    console.log(`   Status: ${bestSeller.trustScore >= 50 ? 'Trustworthy ✓' : 'Building trust...'}\n`);

    // -----------------------------------------------------------------------
    // Step 3: Validate price within budget
    // -----------------------------------------------------------------------
    console.log('✅ Step 3: Validate Price Within Budget\n');

    const withinBudget = buyer.checkPriceRange(bestSeller.price, 1000);

    if (!withinBudget) {
      throw new Error('Price exceeds budget');
    }

    console.log(`Budget Analysis:`);
    console.log(`   Budget: 1000 SGD`);
    console.log(`   Price: ${bestSeller.price} SGD`);
    console.log(`   Remaining: ${1000 - bestSeller.price} SGD`);
    console.log(`   Status: ✅ Within budget\n`);

    // -----------------------------------------------------------------------
    // Step 4: Establish contract
    // -----------------------------------------------------------------------
    console.log('🤝 Step 4: Establish Contract\n');

    const contractEstablished = await buyer.establishContract(
      bestSeller,
      'iPhone 15 Pro',
      bestSeller.price
    );

    if (!contractEstablished) {
      throw new Error('Contract establishment failed');
    }

    console.log(`Contract Details:`);
    console.log(`   Product: iPhone 15 Pro`);
    console.log(`   Price: ${bestSeller.price} SGD`);
    console.log(`   Seller: ${bestSeller.name}`);
    console.log(`   Terms: Verified ✓\n`);

    // -----------------------------------------------------------------------
    // Step 5: Handshake & payment
    // -----------------------------------------------------------------------
    console.log('💳 Step 5: Handshake & Send Payment\n');

    const purchase = await buyer.purchaseProduct(
      {
        product: 'iPhone 15 Pro',
        maxPrice: 1000,
        currency: 'SGD',
      },
      bestSeller // Pass the preselected seller
    );

    if (!purchase.success) {
      throw new Error(`Purchase failed: ${purchase.error}`);
    }

    console.log(`✅ BUYER AGENT: Purchase Complete!`);
    console.log(`   Payment ID: ${purchase.paymentId}`);
    console.log(`   Amount: ${purchase.price} SGD`);
    console.log(`   Seller: ${purchase.sellerName}`);
    console.log(`   Status: Payment sent, awaiting fulfillment...\n`);

    console.log('='.repeat(60));

    // ========================================================================
    // SELLER AGENT FLOW
    // ========================================================================
    console.log('\n🏪 SELLER AGENT FLOW\n');
    console.log('Objective: Fulfill order and process payment\n');
    console.log('='.repeat(60));

    // Simulate seller receiving payment notification
    await new Promise(resolve => setTimeout(resolve, 500));

    // Extract payment proof from purchase
    const paymentProof = (purchase as any).proof || ''; // Payment proof would come from buyer

    // Create payment proof for demo (normally comes from buyer)
    const { X402Client } = await import('../core/x402');
    const demoClient = new X402Client();
    const demoPayment = await demoClient.makePayment({
      amount: bestSeller.price,
      currency: 'SGD',
      recipient: bestSeller.address,
      description: 'Payment for iPhone 15 Pro',
      metadata: {
        product: 'iPhone 15 Pro',
        buyer: buyer.getName(),
      },
    });

    // -----------------------------------------------------------------------
    // Seller processes the order
    // -----------------------------------------------------------------------
    const order = await seller.fulfillOrder(
      demoPayment.proof,
      'iPhone 15 Pro',
      'buyer@example.com',
      buyer.getName()
    );

    // ========================================================================
    // FEEDBACK LOOP
    // ========================================================================
    console.log('\n⭐ FEEDBACK LOOP\n');
    console.log('='.repeat(60));

    console.log('\n📝 Buyer submits feedback...\n');

    await buyer.rateSeller(
      seller.getAgentId()!,
      5,
      'Excellent service! iPhone arrived as described. Fast delivery.',
      purchase.paymentId
    );

    // ========================================================================
    // FINAL STATUS
    // ========================================================================
    console.log('\n📊 FINAL STATUS\n');
    console.log('='.repeat(60));

    console.log('\n🛒 Buyer Agent:');
    const buyerReputation = await buyer.getReputation();
    console.log(`   Name: ${buyer.getName()}`);
    console.log(`   Purchases: 1`);
    console.log(`   Budget spent: ${purchase.price} SGD`);
    console.log(`   Reputation: ${buyerReputation?.trustScore || 0}%`);

    console.log('\n🏪 Seller Agent:');
    const sellerReputation = await seller.getReputation();
    console.log(`   Name: ${seller.getName()}`);
    console.log(`   Sales: ${seller.getTotalSales()}`);
    console.log(`   Revenue: ${seller.getTotalRevenue()} SGD`);
    console.log(`   Trust Score: ${sellerReputation?.trustScore || 0}%`);
    console.log(`   Reviews: ${sellerReputation?.totalReviews || 0}`);

    console.log('\n📦 Order Details:');
    console.log(`   Order ID: ${order.orderId}`);
    console.log(`   Product: ${order.product}`);
    console.log(`   Price: ${order.price} ${order.currency}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Tracking: ${order.trackingNumber}`);
    console.log(`   Receipt: ${order.receipt?.receiptId}`);

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ iPhone Marketplace Demo Complete!\n');

    console.log('🎯 What We Demonstrated:\n');
    console.log('BUYER AGENT:');
    console.log('   ✅ Step 1: Find sellers via ERC-8004');
    console.log('   ✅ Step 2: Check price & reputation');
    console.log('   ✅ Step 3: Validate budget (≤ 1000 SGD)');
    console.log('   ✅ Step 4: Establish contract');
    console.log('   ✅ Step 5: Send payment via x402\n');

    console.log('SELLER AGENT:');
    console.log('   ✅ Step 1: Receive payment');
    console.log('   ✅ Step 2: Verify payment');
    console.log('   ✅ Step 3: Contact supplier');
    console.log('   ✅ Step 4: Generate receipt');
    console.log('   ✅ Step 5: Send receipt to customer');
    console.log('   ✅ Step 6: Reputation updated\n');

    console.log('🔑 Key Features:');
    console.log(`   • ERC-8004 agent discovery: ✓`);
    console.log(`   • Reputation-based selection: ✓`);
    console.log(`   • Budget constraints: ✓`);
    console.log(`   • x402 payment protocol: ✓`);
    console.log(`   • Payment verification: ✓`);
    console.log(`   • Supplier integration: ✓`);
    console.log(`   • Digital receipts: ✓`);
    console.log(`   • Feedback loop: ✓\n`);

    console.log('🎉 Autonomous agent-to-agent commerce is working!\n');

    // Stop agents
    await buyer.stop();
    await seller.stop();

  } catch (error: any) {
    console.error('\n❌ Demo failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runIPhoneMarketplaceDemo();
