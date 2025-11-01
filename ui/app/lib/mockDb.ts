import { Listing, User, Order, HcsEvent, Invoice, Transaction, Agent, AgentCapability } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    avatar: 'https://via.placeholder.com/100',
    reputation: 4.8,
    joinedDate: new Date('2023-03-15'),
    sales: 124,
    purchases: 89,
    walletAddress: '0.0.1234...5678',
    bio: 'Trusted seller of vintage items and electronics',
    verified: true,
  },
  {
    id: 'user-2',
    name: 'Alex Thompson',
    email: 'alex.doe@email.com',
    avatar: 'https://via.placeholder.com/100',
    reputation: 4.7,
    joinedDate: new Date('2023-03-20'),
    sales: 89,
    purchases: 124,
    walletAddress: '0.0.1234...5679',
    bio: 'Looking for great deals on electronics',
    verified: true,
  },
];

export const mockListings: Listing[] = [
  {
    id: 'listing-1',
    title: 'Vintage Leather Sofa',
    description: 'Beautiful vintage leather sofa in excellent condition. Perfect for modern living rooms.',
    price: 850,
    currency: 'USDC',
    category: 'Home',
    condition: 'Used - Like New',
    images: ['/images/sofa.jpg'],
    sellerId: 'user-1',
    sellerName: 'SellerName1',
    sellerRating: 4.8,
    location: 'San Francisco, CA',
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'listing-2',
    title: 'MacBook Pro 16-inch',
    description: '2021 MacBook Pro with M1 Max chip, 32GB RAM, 1TB SSD. Perfect condition.',
    price: 1200,
    currency: 'USDC',
    category: 'Electronics',
    condition: 'Used - Excellent',
    images: ['/images/macbook.jpg'],
    sellerId: 'user-1',
    sellerName: 'SellerName2',
    sellerRating: 4.9,
    createdAt: new Date('2024-06-02'),
  },
  {
    id: 'listing-3',
    title: 'Mountain Bike',
    description: 'High-quality mountain bike with 21-speed gears. Great for trails.',
    price: 450,
    currency: 'USDC',
    category: 'Vehicles',
    condition: 'Used - Good',
    images: ['/images/bike.jpg'],
    sellerId: 'user-2',
    sellerName: 'SellerName3',
    sellerRating: 4.5,
    createdAt: new Date('2024-06-03'),
  },
  {
    id: 'listing-4',
    title: 'Smart Home Hub',
    description: 'Control all your smart devices from one place. Includes voice assistant.',
    price: 99,
    currency: 'USDC',
    category: 'Electronics',
    condition: 'New',
    images: ['/images/hub.jpg'],
    sellerId: 'user-1',
    sellerName: 'SellerName4',
    sellerRating: 5.0,
    createdAt: new Date('2024-06-04'),
  },
  {
    id: 'listing-5',
    title: 'Designer Handbag',
    description: 'Authentic designer handbag. Comes with certificate of authenticity.',
    price: 600,
    currency: 'USDC',
    category: 'Fashion',
    condition: 'Used - Like New',
    images: ['/images/handbag.jpg'],
    sellerId: 'user-1',
    sellerName: 'SellerName5',
    sellerRating: 4.7,
    createdAt: new Date('2024-06-05'),
  },
  {
    id: 'listing-6',
    title: 'Antique Wooden Desk',
    description: 'Beautiful antique desk with intricate carvings. Perfect for home office.',
    price: 320,
    currency: 'USDC',
    category: 'Home',
    condition: 'Used - Good',
    images: ['/images/desk.jpg'],
    sellerId: 'user-2',
    sellerName: 'SellerName6',
    sellerRating: 4.6,
    createdAt: new Date('2024-06-06'),
  },
  {
    id: 'listing-7',
    title: 'Drone with 4K Camera',
    description: 'Professional drone with 4K camera and gimbal stabilization.',
    price: 750,
    currency: 'USDC',
    category: 'Electronics',
    condition: 'New',
    images: ['/images/drone.jpg'],
    sellerId: 'user-1',
    sellerName: 'SellerName7',
    sellerRating: 4.9,
    createdAt: new Date('2024-06-07'),
  },
  {
    id: 'listing-8',
    title: 'Electric Guitar',
    description: 'Vintage electric guitar with amazing sound quality. Includes amp.',
    price: 500,
    currency: 'USDC',
    category: 'Services',
    condition: 'Used - Excellent',
    images: ['/images/guitar.jpg'],
    sellerId: 'user-2',
    sellerName: 'SellerName8',
    sellerRating: 4.8,
    createdAt: new Date('2024-06-08'),
  },
];

export const mockOrders: Order[] = [];
export const mockHcsEvents: HcsEvent[] = [];
export const mockInvoices: Invoice[] = [];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Vintage Leather Jacket',
    date: new Date('2024-06-15'),
    status: 'completed',
    amount: 150,
    type: 'sale',
    image: '/images/jacket.jpg',
    txId: '987654321-fed-5432109876',
  },
  {
    id: 'tx-2',
    title: 'Retro Gaming Console',
    date: new Date('2024-05-28'),
    status: 'completed',
    amount: 200,
    type: 'purchase',
    image: '/images/console.jpg',
    txId: '123456789-abc-9876543210',
  },
  {
    id: 'tx-3',
    title: 'Designer Smartwatch',
    date: new Date('2024-05-12'),
    status: 'in_progress',
    amount: 300,
    type: 'purchase',
    image: '/images/watch.jpg',
  },
];

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Electronics Seller Agent',
    description: 'Specialized in selling electronics and tech gadgets with automated pricing and inventory management.',
    type: 'seller',
    userId: 'user-1',
    evmAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    did: 'did:hedera:testnet:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
    reputationScore: 4.8,
    capabilities: [
      {
        id: 'cap-1',
        name: 'Auto Pricing',
        description: 'Automatically adjusts prices based on market conditions',
        category: 'Pricing',
        priceModel: 'commission',
        enabled: true,
      },
      {
        id: 'cap-2',
        name: 'Inventory Sync',
        description: 'Syncs inventory across multiple platforms',
        category: 'Management',
        enabled: true,
      },
    ],
    verified: true,
    avatar: '/images/agent-avatar-1.jpg',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-01'),
    totalTransactions: 156,
    successRate: 98.5,
  },
  {
    id: 'agent-2',
    name: 'Smart Buyer Agent',
    description: 'AI-powered buyer agent that finds the best deals and negotiates prices automatically.',
    type: 'buyer',
    userId: 'user-1',
    evmAddress: '0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9E9F1',
    did: 'did:hedera:testnet:z6MkjchhfUsD6mmvni8mCdXHw216Xrm9bQe31hSmyxZrGKt',
    reputationScore: 4.9,
    capabilities: [
      {
        id: 'cap-3',
        name: 'Price Comparison',
        description: 'Compares prices across multiple marketplaces',
        category: 'Research',
        enabled: true,
      },
      {
        id: 'cap-4',
        name: 'Auto Negotiation',
        description: 'Automatically negotiates with sellers',
        category: 'Transaction',
        priceModel: 'flat_fee',
        enabled: true,
      },
    ],
    verified: true,
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-05'),
    totalTransactions: 89,
    successRate: 95.2,
  },
  {
    id: 'agent-3',
    name: 'Validator Pro',
    description: 'Trusted validator agent for verifying transaction authenticity and quality control.',
    type: 'validator',
    userId: 'user-2',
    evmAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    did: 'did:hedera:testnet:z6MkpTHR8VNsBxYAAWHut2Geadd9jSwuBV8xRoAnwWsdvktH',
    reputationScore: 4.7,
    capabilities: [
      {
        id: 'cap-5',
        name: 'Quality Check',
        description: 'Validates product quality and authenticity',
        category: 'Validation',
        priceModel: 'per_validation',
        enabled: true,
      },
      {
        id: 'cap-6',
        name: 'Document Verification',
        description: 'Verifies certificates and documents',
        category: 'Validation',
        enabled: true,
      },
    ],
    verified: true,
    status: 'active',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-06-03'),
    totalTransactions: 234,
    successRate: 99.1,
  },
  {
    id: 'agent-4',
    name: 'Fashion Curator Agent',
    description: 'Specialized agent for fashion items with trend analysis and authentication.',
    type: 'seller',
    userId: 'user-2',
    evmAddress: '0x9f8e7d6c5b4a3921fedcba0987654321fedcba09',
    did: 'did:hedera:testnet:z6MkfnoPSWpWYRTVkCWXfGvuZXbX8TjNYQBhqSw5Rc9cC4PH',
    reputationScore: 4.6,
    capabilities: [
      {
        id: 'cap-7',
        name: 'Trend Analysis',
        description: 'Analyzes fashion trends for optimal pricing',
        category: 'Analytics',
        enabled: true,
      },
      {
        id: 'cap-8',
        name: 'Authentication',
        description: 'Verifies authenticity of designer items',
        category: 'Validation',
        enabled: true,
      },
    ],
    verified: true,
    status: 'active',
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-06-02'),
    totalTransactions: 67,
    successRate: 94.8,
  },
  {
    id: 'agent-5',
    name: 'Home Goods Specialist',
    description: 'Agent for home and furniture items with delivery coordination.',
    type: 'seller',
    userId: 'user-1',
    evmAddress: '0x5a4b3c2d1e0f9876543210fedcba9876543210fe',
    did: 'did:hedera:testnet:z6MkqRYqQiSgvZQdnBytw86Qbs2ZWUkGv22od935YF4s8M7V',
    reputationScore: 4.5,
    capabilities: [
      {
        id: 'cap-9',
        name: 'Delivery Coordination',
        description: 'Coordinates delivery and logistics',
        category: 'Logistics',
        enabled: true,
      },
      {
        id: 'cap-10',
        name: 'Size Optimization',
        description: 'Optimizes pricing based on size and weight',
        category: 'Pricing',
        enabled: false,
      },
    ],
    verified: false,
    status: 'pending',
    createdAt: new Date('2024-05-30'),
    updatedAt: new Date('2024-05-30'),
    totalTransactions: 12,
    successRate: 91.7,
  },
];

// Helper functions
export function getListingById(id: string): Listing | undefined {
  return mockListings.find((l) => l.id === id);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function getOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id);
}

export function addOrder(order: Order): void {
  mockOrders.push(order);
}

export function addHcsEvent(event: HcsEvent): void {
  mockHcsEvents.push(event);
}

export function addInvoice(invoice: Invoice): void {
  mockInvoices.push(invoice);
}

export function getInvoiceByOrderId(orderId: string): Invoice | undefined {
  return mockInvoices.find((i) => i.orderId === orderId);
}

export function getHcsEventsByOrderId(orderId: string): HcsEvent[] {
  return mockHcsEvents.filter((e) => e.orderId === orderId);
}

export function getAgentById(id: string): Agent | undefined {
  return mockAgents.find((a) => a.id === id);
}

export function getAgentsByUserId(userId: string): Agent[] {
  return mockAgents.filter((a) => a.userId === userId);
}

export function getAllAgents(): Agent[] {
  return mockAgents;
}

export function addAgent(agent: Agent): void {
  mockAgents.push(agent);
}

