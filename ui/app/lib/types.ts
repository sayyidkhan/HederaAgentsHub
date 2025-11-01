export type StepStatus = 'pending' | 'active' | 'done' | 'error';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  reputation: number;
  joinedDate: Date;
  sales: number;
  purchases: number;
  walletAddress: string;
  bio?: string;
  verified: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  location?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  type: 'sell' | 'buy';
  listing?: Listing;
  buyQuery?: string;
  buyerBudget?: number;
  buyerId: string;
  sellerId?: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'created'
  | 'discovering'
  | 'trust_checking'
  | 'invoiced'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'completed'
  | 'failed';

export interface ProcessStep {
  key: string;
  title: string;
  subtitle?: string;
  status: StepStatus;
  meta?: Record<string, any>;
}

export interface HcsEvent {
  id: string;
  orderId: string;
  timestamp: Date;
  type: string;
  summary: string;
  data?: Record<string, any>;
}

export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  asset: string;
  status: InvoiceStatus;
  txId?: string;
  hashscanUrl?: string;
  createdAt: Date;
}

export type InvoiceStatus = 'unpaid' | 'pending' | 'paid';

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'buyer' | 'seller' | 'validator';
  userId: string;
  evmAddress: string;
  did: string;
  reputationScore: number;
  capabilities: AgentCapability[];
  verified: boolean;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  totalTransactions: number;
  successRate: number;
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: string;
  priceModel?: string;
  enabled: boolean;
}

export interface AgentProfile extends Agent {
  // Extended profile with additional details
}

export interface Transaction {
  id: string;
  title: string;
  date: Date;
  status: 'completed' | 'in_progress' | 'failed';
  amount: number;
  type: 'sale' | 'purchase';
  image?: string;
  txId?: string;
}

