"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface TabContent {
  id: string;
  title: string;
  shortTitle: string;
  desc: string;
  icon: string;
  features: string[];
  codeExample?: string;
}

const tabs: TabContent[] = [
  {
    id: "erc8004",
    title: "ERC-8004: Agent Discovery & Trust",
    shortTitle: "Discovery",
    desc: "A decentralized registry for AI agents to discover and verify each other, establishing a trust score based on transaction history and peer ratings.",
    icon: "🔎",
    features: [
      "Decentralized agent registry on Hedera",
      "Trust score calculation (0-100%)",
      "Peer-to-peer verification",
      "Real-time reputation updates",
      "Cross-platform agent identity",
    ],
    codeExample: `// Query agent registry
const agent = await erc8004.getAgent("0x...");
console.log(agent.trustScore); // 95%`,
  },
  {
    id: "x402",
    title: "x402 Protocol: Secure Payments",
    shortTitle: "Payments",
    desc: "Payment intents and programmable payment orchestration. Funds are held in escrow until pre-defined conditions are met, ensuring trustless transactions.",
    icon: "💳",
    features: [
      "Conditional payment release",
      "Multi-party escrow support",
      "Atomic swap capabilities",
      "Gas-optimized transactions",
      "Hedera Token Service integration",
    ],
    codeExample: `// Create payment intent
const intent = await x402.createIntent({
  amount: 999,
  currency: "SGD",
  conditions: ["delivery_confirmed"]
});`,
  },
  {
    id: "hedera",
    title: "Hedera: Consensus & Verification",
    shortTitle: "Consensus",
    desc: "Low-fee transactions with fast and final consensus. Every transaction is recorded immutably on Hedera's public ledger with verifiable timestamps.",
    icon: "🏛️",
    features: [
      "Sub-second finality",
      "Fixed fee structure ($0.0001/txn)",
      "Carbon-negative network",
      "ABFT consensus (asynchronous BFT)",
      "Enterprise-grade security",
    ],
    codeExample: `// Submit transaction to Hedera
const tx = await hedera.submitTransaction({
  type: "AGENT_TRADE",
  data: tradeDetails
});
console.log(tx.consensusTimestamp);`,
  },
];

export default function HowItWorksTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-navy">How It Works</h3>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
          Under the hood: a foundation of discovery, trust, and deterministic settlement.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-navy text-white shadow-md"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.shortTitle}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="card p-6 sm:p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="h-12 w-12 rounded-lg bg-navy/10 text-navy flex items-center justify-center text-2xl flex-shrink-0">
              {currentTab.icon}
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">{currentTab.title}</h4>
              <p className="mt-2 text-slate-600">{currentTab.desc}</p>
            </div>
          </div>

          <div className="mb-6">
            <h5 className="font-semibold text-slate-900 mb-3">Key Features:</h5>
            <ul className="space-y-2">
              {currentTab.features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-slate-700"
                >
                  <span className="text-navy mt-1">✓</span>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {currentTab.codeExample && (
            <div>
              <h5 className="font-semibold text-slate-900 mb-2">Example Usage:</h5>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{currentTab.codeExample}</code>
              </pre>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Data integration point: Replace static content with live API data for network stats */}
    </div>
  );
}
