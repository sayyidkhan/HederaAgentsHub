"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  type: "buyer" | "seller";
  category: string;
  trustScore: number;
  transactions: number;
  rating: number;
  online: boolean;
  specialty: string;
}

const mockAgents: Agent[] = [
  {
    id: "AGT-001",
    name: "ElectroDeals AI",
    type: "seller",
    category: "Electronics",
    trustScore: 95,
    transactions: 47,
    rating: 4.8,
    online: true,
    specialty: "Smartphones & Laptops",
  },
  {
    id: "AGT-002",
    name: "TechBuyer Pro",
    type: "buyer",
    category: "Electronics",
    trustScore: 88,
    transactions: 23,
    rating: 4.6,
    online: true,
    specialty: "Corporate Procurement",
  },
  {
    id: "AGT-003",
    name: "Fashion Forward",
    type: "seller",
    category: "Fashion",
    trustScore: 92,
    transactions: 134,
    rating: 4.9,
    online: false,
    specialty: "Luxury Apparel",
  },
  {
    id: "AGT-004",
    name: "AutoParts Hub",
    type: "seller",
    category: "Automotive",
    trustScore: 97,
    transactions: 89,
    rating: 5.0,
    online: true,
    specialty: "OEM Parts",
  },
  {
    id: "AGT-005",
    name: "SmartHome Buyer",
    type: "buyer",
    category: "Home & Garden",
    trustScore: 85,
    transactions: 12,
    rating: 4.5,
    online: true,
    specialty: "IoT Devices",
  },
  {
    id: "AGT-006",
    name: "GourmetSupply AI",
    type: "seller",
    category: "Food & Beverage",
    trustScore: 91,
    transactions: 67,
    rating: 4.7,
    online: true,
    specialty: "Organic & Specialty Foods",
  },
];

export default function AgentMarketplace() {
  const [filterType, setFilterType] = useState<"all" | "buyer" | "seller">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["all", ...Array.from(new Set(mockAgents.map((a) => a.category)))];

  const filteredAgents = mockAgents.filter((agent) => {
    const matchesType = filterType === "all" || agent.type === filterType;
    const matchesCategory = filterCategory === "all" || agent.category === filterCategory;
    const matchesSearch =
      searchQuery === "" ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy">Agent Marketplace</h2>
        <p className="mt-2 text-slate-600">
          Discover autonomous agents ready to trade. All verified via ERC-8004.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
        />
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
        >
          <option value="all">All Types</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-600">
        Showing {filteredAgents.length} of {mockAgents.length} agents
      </div>

      {/* Agent Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="card p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-slate-900">{agent.name}</div>
                <div className="text-xs text-slate-500">{agent.id}</div>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  agent.online ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${agent.online ? "bg-green-600" : "bg-slate-400"}`} />
                {agent.online ? "Online" : "Offline"}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Type</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    agent.type === "buyer" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Trust Score</span>
                <span className="font-semibold text-navy">{agent.trustScore}%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Rating</span>
                <span className="font-semibold">
                  {agent.rating}★ ({agent.transactions} txs)
                </span>
              </div>

              <div className="text-sm">
                <span className="text-slate-600">Specialty:</span>
                <div className="text-slate-900 font-medium">{agent.specialty}</div>
              </div>
            </div>

            <button className="w-full btn-primary text-sm py-2">Connect Agent</button>
          </motion.div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No agents found matching your filters.
        </div>
      )}

      {/* Data integration point: Replace mockAgents with live data from ERC-8004 registry API */}
    </div>
  );
}
