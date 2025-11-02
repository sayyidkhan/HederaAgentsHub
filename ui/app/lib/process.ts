import { ProcessStep, HcsEvent } from './types';
import { sleep } from './utils';
import { addHcsEvent, addInvoice } from './mockDb';

export async function startAgentOrderProcess(
  orderId: string,
  agentType: 'buyer' | 'seller',
  onUpdate: (steps: ProcessStep[], events: HcsEvent[]) => void,
  config?: {
    prompt?: string;
    minPrice?: number;
    maxPrice?: number;
    productRequirements?: string;
    minSellerReputation?: number;
    autoApprove?: boolean;
  }
): Promise<void> {
  const initialSteps: ProcessStep[] = [
    {
      key: 'discovery',
      title: 'Agent Discovery',
      subtitle: agentType === 'buyer' ? 'Finding suitable seller agents' : 'Finding suitable buyer agents',
      status: 'active',
    },
    {
      key: 'trust',
      title: 'Creating Trust',
      subtitle: 'Verifying identity and reputation',
      status: 'pending',
    },
    {
      key: 'negotiation',
      title: 'Price Negotiation',
      subtitle: 'Negotiating terms within guardrails',
      status: 'pending',
    },
    {
      key: 'handshake',
      title: 'Handshake Agreement',
      subtitle: 'Finalizing transaction terms',
      status: 'pending',
    },
    {
      key: 'payment',
      title: 'Payment Transfer',
      subtitle: 'Processing payment on Hedera',
      status: 'pending',
    },
    {
      key: 'invoice',
      title: 'Invoice Generated',
      subtitle: 'Transaction complete with invoice',
      status: 'pending',
    },
  ];

  const events: HcsEvent[] = [];
  
  // Step 1: Agent Discovery
  const event1: HcsEvent = {
    id: `event-${Date.now()}-1`,
    orderId,
    timestamp: new Date(),
    type: 'AGENT_DISCOVERY',
    summary: agentType === 'buyer' 
      ? `Buyer agent discovering seller agents (Min reputation: ${config?.minSellerReputation || 4.5})`
      : 'Seller agent discovering buyer agents via marketplace',
    data: { 
      agentType, 
      agentsFound: 5, 
      minReputation: config?.minSellerReputation || 4.5,
      prompt: config?.prompt,
      productRequirements: config?.productRequirements
    },
  };
  events.push(event1);
  addHcsEvent(event1);
  onUpdate([...initialSteps], [...events]);
  
  await sleep(2500);
  
  // Step 2: Creating Trust
  initialSteps[0].status = 'done';
  initialSteps[1].status = 'active';
  const event2: HcsEvent = {
    id: `event-${Date.now()}-2`,
    orderId,
    timestamp: new Date(),
    type: 'TRUST_ESTABLISHMENT',
    summary: 'Verifying identity via DID and checking reputation score',
    data: { 
      reputationScore: 4.8, 
      didVerified: true, 
      trustLevel: 'high',
      meetsMinReputation: true
    },
  };
  events.push(event2);
  addHcsEvent(event2);
  onUpdate([...initialSteps], [...events]);
  
  await sleep(2500);
  
  // Step 3: Price Negotiation
  initialSteps[1].status = 'done';
  initialSteps[2].status = 'active';
  const minPrice = config?.minPrice || (agentType === 'buyer' ? 80 : 90);
  const maxPrice = config?.maxPrice || 100;
  const initialPrice = agentType === 'buyer' ? maxPrice + 5 : minPrice - 5;
  const finalPrice = agentType === 'buyer' 
    ? Math.min(maxPrice - 2, 98) 
    : Math.max(minPrice + 3, 93);
  const event3: HcsEvent = {
    id: `event-${Date.now()}-3`,
    orderId,
    timestamp: new Date(),
    type: 'PRICE_NEGOTIATION',
    summary: `Negotiating price within guardrails: ${initialPrice} HBAR → ${finalPrice} HBAR (Range: ${minPrice}-${maxPrice} HBAR)`,
    data: { 
      initialPrice, 
      finalPrice, 
      minPrice,
      maxPrice,
      currency: 'HBAR',
      rounds: 3,
      guardrailsRespected: true,
      autoApproved: config?.autoApprove || false
    },
  };
  events.push(event3);
  addHcsEvent(event3);
  onUpdate([...initialSteps], [...events]);
  
  await sleep(3000);
  
  // Step 4: Handshake Agreement
  initialSteps[2].status = 'done';
  initialSteps[3].status = 'active';
  const event4: HcsEvent = {
    id: `event-${Date.now()}-4`,
    orderId,
    timestamp: new Date(),
    type: 'HANDSHAKE_AGREEMENT',
    summary: config?.autoApprove 
      ? 'Auto-approved: Both parties agreed on terms - creating smart contract'
      : 'Both parties agreed on terms - creating smart contract',
    data: { 
      agreedPrice: finalPrice,
      deliveryTerms: '5-7 business days',
      contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
      autoApproved: config?.autoApprove || false
    },
  };
  events.push(event4);
  addHcsEvent(event4);
  onUpdate([...initialSteps], [...events]);
  
  await sleep(2500);
  
  // Step 5: Payment Transfer
  initialSteps[3].status = 'done';
  initialSteps[4].status = 'active';
  
  const txId = '0.0.1234567@' + (Date.now() / 1000).toFixed(3);
  const event5: HcsEvent = {
    id: `event-${Date.now()}-5`,
    orderId,
    timestamp: new Date(),
    type: 'PAYMENT_TRANSFER',
    summary: `Processing payment of ${finalPrice} HBAR on Hedera network`,
    data: { 
      amount: finalPrice,
      asset: 'HBAR',
      txId,
      network: 'Hedera Testnet'
    },
  };
  events.push(event5);
  addHcsEvent(event5);
  initialSteps[4].meta = { txId };
  onUpdate([...initialSteps], [...events]);
  
  await sleep(3000);
  
  // Step 6: Invoice Generated
  initialSteps[4].status = 'done';
  initialSteps[5].status = 'active';
  
  const invoiceId = `INV-${Date.now()}`;
  addInvoice({
    id: invoiceId,
    orderId,
    amount: finalPrice,
    asset: 'HBAR',
    status: 'paid',
    txId,
    hashscanUrl: `https://hashscan.io/testnet/transaction/${txId}`,
    createdAt: new Date(),
  });
  
  const event6: HcsEvent = {
    id: `event-${Date.now()}-6`,
    orderId,
    timestamp: new Date(),
    type: 'INVOICE_GENERATED',
    summary: `Transaction complete - invoice generated for ${finalPrice} HBAR with payment proof`,
    data: { 
      invoiceId,
      amount: finalPrice,
      asset: 'HBAR',
      txId,
      status: 'paid'
    },
  };
  events.push(event6);
  addHcsEvent(event6);
  initialSteps[5].status = 'done';
  initialSteps[5].meta = { invoiceId, txId };
  onUpdate([...initialSteps], [...events]);
}

export async function startMockProcess(
  orderId: string,
  onUpdate: (steps: ProcessStep[], events: HcsEvent[]) => void
): Promise<void> {
  // Kept for backward compatibility with existing code
  return startAgentOrderProcess(orderId, 'seller', onUpdate);
}

export async function completePayment(
  orderId: string,
  txId: string,
  steps: ProcessStep[],
  events: HcsEvent[],
  onUpdate: (steps: ProcessStep[], events: HcsEvent[]) => void
): Promise<void> {
  // Step 5: Payment Submitted
  const event5: HcsEvent = {
    id: `event-${Date.now()}-5`,
    orderId,
    timestamp: new Date(),
    type: 'PAYMENT_SUBMITTED',
    summary: 'Payment submitted to Hedera Testnet',
    data: { txId },
  };
  events.push(event5);
  addHcsEvent(event5);
  onUpdate([...steps], [...events]);
  
  await sleep(3000);
  
  // Step 6: Payment Verified
  steps[4].status = 'done';
  steps[5].status = 'done';
  steps[5].meta = { txId, hashscanUrl: `https://hashscan.io/testnet/transaction/${txId}` };
  steps[6].status = 'active';
  
  const event6: HcsEvent = {
    id: `event-${Date.now()}-6`,
    orderId,
    timestamp: new Date(),
    type: 'PAYMENT_CONFIRMED',
    summary: 'Payment confirmed via Mirror Node',
    data: { txId, mirrorStatus: 'SUCCESS' },
  };
  events.push(event6);
  addHcsEvent(event6);
  onUpdate([...steps], [...events]);
  
  await sleep(2000);
  
  // Step 7: Resource Delivered
  steps[6].status = 'done';
  const event7: HcsEvent = {
    id: `event-${Date.now()}-7`,
    orderId,
    timestamp: new Date(),
    type: 'RESOURCE_DELIVERED',
    summary: 'Transaction complete - seller can ship item',
    data: { status: 'completed' },
  };
  events.push(event7);
  addHcsEvent(event7);
  onUpdate([...steps], [...events]);
}

