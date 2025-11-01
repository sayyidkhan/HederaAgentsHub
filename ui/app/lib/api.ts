import { sleep } from './utils';
import {
  mockListings,
  mockUsers,
  getListingById,
  getUserById,
  getOrderById,
  addOrder,
  getInvoiceByOrderId,
  addInvoice,
  mockTransactions,
  getAgentById,
  getAgentsByUserId,
  getAllAgents,
  addAgent,
} from './mockDb';
import { Listing, User, Order, Invoice, Transaction, Agent } from './types';

// Simulate network latency
const LATENCY = 300;

export async function listListings(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}): Promise<Listing[]> {
  await sleep(LATENCY);
  
  let results = [...mockListings];
  
  if (filters?.category && filters.category !== 'All') {
    results = results.filter((l) => l.category === filters.category);
  }
  
  if (filters?.minPrice !== undefined) {
    results = results.filter((l) => l.price >= filters.minPrice!);
  }
  
  if (filters?.maxPrice !== undefined) {
    results = results.filter((l) => l.price <= filters.maxPrice!);
  }
  
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    results = results.filter(
      (l) =>
        l.title.toLowerCase().includes(search) ||
        l.description.toLowerCase().includes(search)
    );
  }
  
  return results;
}

export async function getListing(id: string): Promise<Listing | null> {
  await sleep(LATENCY);
  return getListingById(id) || null;
}

export async function getUser(id: string): Promise<User | null> {
  await sleep(LATENCY);
  return getUserById(id) || null;
}

export async function createSellOrder(payload: {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  location?: string;
}): Promise<Order> {
  await sleep(LATENCY);
  
  const orderId = `ORD-${Date.now()}`;
  
  const listing: Listing = {
    id: `listing-${Date.now()}`,
    ...payload,
    currency: 'USDC',
    sellerId: 'user-1',
    sellerName: 'Jane Doe',
    sellerRating: 4.8,
    createdAt: new Date(),
  };
  
  const order: Order = {
    id: orderId,
    type: 'sell',
    listing,
    buyerId: 'user-2',
    sellerId: 'user-1',
    status: 'created',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  addOrder(order);
  return order;
}

export async function createBuyOrder(payload: {
  query: string;
  budget?: number;
  quantity?: number;
  location?: string;
  notes?: string;
}): Promise<Order> {
  await sleep(LATENCY);
  
  const orderId = `ORD-${Date.now()}`;
  
  const order: Order = {
    id: orderId,
    type: 'buy',
    buyQuery: payload.query,
    buyerBudget: payload.budget,
    buyerId: 'user-2',
    status: 'created',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  addOrder(order);
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  await sleep(LATENCY);
  return getOrderById(id) || null;
}

export async function getProfile(id: string): Promise<User | null> {
  await sleep(LATENCY);
  return getUserById(id) || null;
}

export async function getInvoice(orderId: string): Promise<Invoice | null> {
  await sleep(LATENCY);
  return getInvoiceByOrderId(orderId) || null;
}

export async function payInvoice(invoiceId: string): Promise<{ txId: string; success: boolean }> {
  await sleep(1500); // Longer for payment
  
  const txId = `${Math.floor(Math.random() * 1000000000)}-fed-${Math.floor(Math.random() * 10000000000)}`;
  
  return {
    txId,
    success: true,
  };
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  await sleep(LATENCY);
  return mockTransactions;
}

// Agent API functions
export async function listAgents(filters?: {
  type?: 'buyer' | 'seller' | 'validator';
  verified?: boolean;
  userId?: string;
}): Promise<Agent[]> {
  await sleep(LATENCY);
  
  let results = getAllAgents();
  
  if (filters?.type) {
    results = results.filter((a) => a.type === filters.type);
  }
  
  if (filters?.verified !== undefined) {
    results = results.filter((a) => a.verified === filters.verified);
  }
  
  if (filters?.userId) {
    results = results.filter((a) => a.userId === filters.userId);
  }
  
  return results;
}

export async function getAgent(id: string): Promise<Agent | null> {
  await sleep(LATENCY);
  return getAgentById(id) || null;
}

export async function getMyAgents(userId: string): Promise<Agent[]> {
  await sleep(LATENCY);
  return getAgentsByUserId(userId);
}

export async function createAgent(agentData: Partial<Agent>): Promise<Agent> {
  await sleep(LATENCY);
  
  const newAgent: Agent = {
    id: `agent-${Date.now()}`,
    name: agentData.name || 'New Agent',
    description: agentData.description || '',
    type: agentData.type || 'buyer',
    userId: agentData.userId || 'user-1',
    evmAddress: agentData.evmAddress || `0x${Math.random().toString(16).substring(2, 42)}`,
    did: agentData.did || `did:hedera:testnet:z6Mk${Math.random().toString(36).substring(2, 42)}`,
    reputationScore: 0,
    capabilities: agentData.capabilities || [],
    verified: false,
    avatar: agentData.avatar,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    totalTransactions: 0,
    successRate: 0,
  };
  
  addAgent(newAgent);
  return newAgent;
}

