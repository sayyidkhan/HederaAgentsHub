import { ProcessStep, HcsEvent } from './types';
import { sleep } from './utils';
import { addHcsEvent, addInvoice } from './mockDb';

export async function startMockProcess(
  orderId: string,
  onUpdate: (steps: ProcessStep[], events: HcsEvent[]) => void
): Promise<void> {
  const initialSteps: ProcessStep[] = [
    {
      key: 'listed',
      title: 'Seller Item Listed',
      subtitle: 'Item posted to marketplace',
      status: 'done',
    },
    {
      key: 'discovering',
      title: 'Agent Discovering Buyer Agents',
      subtitle: 'ERC-8004 Standard',
      status: 'active',
    },
    {
      key: 'trust',
      title: 'Trust Established',
      subtitle: 'Identity + Reputation Verified',
      status: 'pending',
    },
    {
      key: 'payment_requested',
      title: 'Payment Requested',
      subtitle: 'x402 Invoice Generated',
      status: 'pending',
    },
    {
      key: 'payment_processing',
      title: 'Blockchain Payment in Process',
      subtitle: 'Hedera Testnet, Mirror Node pending',
      status: 'pending',
    },
    {
      key: 'payment_verified',
      title: 'Payment Verified',
      subtitle: 'View on HashScan',
      status: 'pending',
    },
    {
      key: 'completed',
      title: 'Transaction Complete',
      subtitle: 'Seller ships the item',
      status: 'pending',
    },
  ];

  const events: HcsEvent[] = [];
  
  // Step 1: Item Listed (already done)
  const event1: HcsEvent = {
    id: `event-${Date.now()}-1`,
    orderId,
    timestamp: new Date(),
    type: 'SELLER_ITEM_LISTED',
    summary: 'Seller listed item on marketplace',
    data: { status: 'completed' },
  };
  events.push(event1);
  addHcsEvent(event1);
  onUpdate([...initialSteps], [...events]);
  
  await sleep(2000);
  
  // Step 2: Discovering
  initialSteps[1].status = 'done';
  initialSteps[2].status = 'active';
  const event2: HcsEvent = {
    id: `event-${Date.now()}-2`,
    orderId,
    timestamp: new Date(),
    type: 'AGENT_DISCOVERING_BUYER_AGENTS',
    summary: 'Discovering buyer agents via ERC-8004 registry',
    data: { agentsFound: 3, minReputation: 700 },
  };
  events.push(event2);
  addHcsEvent(event2);
  onUpdate([...initialSteps], [...events]);
  
  await sleep(2000);
  
  // Step 3: Trust Established
  initialSteps[2].status = 'done';
  initialSteps[3].status = 'active';
  const event3: HcsEvent = {
    id: `event-${Date.now()}-3`,
    orderId,
    timestamp: new Date(),
    type: 'TRUST_ESTABLISHED',
    summary: 'Identity and reputation verified',
    data: { reputationScore: 875, verified: true },
  };
  events.push(event3);
  addHcsEvent(event3);
  onUpdate([...initialSteps], [...events]);
  
  await sleep(2000);
  
  // Step 4: Payment Requested
  initialSteps[3].status = 'done';
  initialSteps[4].status = 'active';
  
  const invoiceId = `INV-${Date.now()}`;
  addInvoice({
    id: invoiceId,
    orderId,
    amount: 150,
    asset: 'USDC (test)',
    status: 'unpaid',
    createdAt: new Date(),
  });
  
  const event4: HcsEvent = {
    id: `event-${Date.now()}-4`,
    orderId,
    timestamp: new Date(),
    type: 'PAYMENT_REQUESTED',
    summary: 'x402 invoice generated',
    data: { invoiceId, amount: 150, asset: 'USDC' },
  };
  events.push(event4);
  addHcsEvent(event4);
  initialSteps[3].meta = { invoiceId };
  onUpdate([...initialSteps], [...events]);
  
  await sleep(2500);
  
  // Step 5: Payment Processing (waiting for user to click Pay)
  // This step waits and doesn't auto-complete
  initialSteps[4].status = 'active';
  onUpdate([...initialSteps], [...events]);
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

