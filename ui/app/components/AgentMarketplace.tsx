"use client";
import { motion } from "framer-motion";

interface Task {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  lastActive: string;
  balance: number;
  currency: string;
  description: string;
  tasks: Task[];
  totalTransactions?: number;
  rating?: number;
  online?: boolean;
  specialty?: string;
  category?: string;
}

const mockAgents: Agent[] = [
  {
    id: "AGT-BUY-001",
    name: "Smart Buyer Pro",
    type: "buyer",
    status: "active",
    lastActive: "2 minutes ago",
    balance: 1000,
    currency: "USDC",
    description: "Professional buying agent that finds the best deals and negotiates prices on your behalf.",
    tasks: [
      { id: 1, name: "Find best deals", status: "active" },
      { id: 2, name: "Price monitoring", status: "pending" },
      { id: 3, name: "Purchase items", status: "pending" }
    ],
    totalTransactions: 24,
    rating: 5.0,
    online: true,
    specialty: "Finding the best deals",
    category: "General"
  },
  {
    id: "AGT-SELL-001",
    name: "Smart Seller Pro",
    type: "seller",
    status: "active",
    lastActive: "5 minutes ago",
    balance: 2500,
    currency: "USDC",
    description: "Expert selling agent that helps you get the best value for your items with smart pricing and marketing.",
    tasks: [
      { id: 1, name: "List items", status: "completed" },
      { id: 2, name: "Price optimization", status: "active" },
      { id: 3, name: "Customer support", status: "pending" }
    ],
    totalTransactions: 18,
    rating: 4.9,
    online: true,
    specialty: "Maximizing sale value",
    category: "General"
  }
];

export default function AgentMarketplace() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Agents</h1>
        <p className="text-gray-600">Choose an agent to help with your transaction</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {mockAgents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-xl p-6 hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      agent.type === 'buyer' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {agent.type === 'buyer' ? 'Buyer Agent' : 'Seller Agent'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{agent.description}</p>

                <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Rating</span>
                    <span className="text-sm font-medium">{agent.rating || 'N/A'}★</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Balance</span>
                    <span className="text-sm font-medium">{agent.balance} {agent.currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <span className={`h-2 w-2 rounded-full ${agent.online ? 'bg-green-500' : 'bg-gray-400'} mr-1.5`}></span>
                      {agent.status}
                    </span>
                  </div>
                  {agent.specialty && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Specialty</span>
                      <span className="text-sm font-medium text-right">{agent.specialty}</span>
                    </div>
                  )}
                </div>

                <button 
                  className={`w-full mt-6 py-2.5 px-4 rounded-lg font-medium transition-colors ${
                    agent.type === 'buyer' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {agent.type === 'buyer' ? 'Hire Buyer Agent' : 'Hire Seller Agent'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
