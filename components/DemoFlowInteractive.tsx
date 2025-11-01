"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface Step {
  title: string;
  text: string;
  details: string;
  timestamp: string;
  txHash?: string;
}

const steps: Step[] = [
  { 
    title: "Search", 
    text: "Buyer searches for 'iPhone retailer'",
    details: "Agent queries ERC-8004 registry for verified iPhone sellers with trust scores above 90%.",
    timestamp: "2025-01-15 14:23:01",
  },
  { 
    title: "Discovery", 
    text: "Finds Seller (95% trust)",
    details: "Seller agent identified with 95% trust score based on 47 successful transactions and 4.8★ rating.",
    timestamp: "2025-01-15 14:23:03",
  },
  { 
    title: "Negotiation", 
    text: "Price agreed (999 SGD)",
    details: "Automated price negotiation completed in 2 rounds. Initial ask: 1,099 SGD, final: 999 SGD.",
    timestamp: "2025-01-15 14:23:12",
  },
  { 
    title: "Payment", 
    text: "Executes via x402",
    details: "x402 payment intent created. Funds held in escrow until fulfillment conditions are met.",
    timestamp: "2025-01-15 14:23:45",
    txHash: "0x4f2a...8b1c",
  },
  { 
    title: "Verification", 
    text: "Seller verifies payment",
    details: "Seller agent confirms payment receipt on Hedera. Escrow condition #1 satisfied.",
    timestamp: "2025-01-15 14:24:02",
    txHash: "0x7d3e...2f4a",
  },
  { 
    title: "Fulfillment", 
    text: "Supplier ships iPhone",
    details: "Seller initiates shipment with tracking number SG-12345-HK. Carrier: DHL Express.",
    timestamp: "2025-01-15 15:10:30",
  },
  { 
    title: "Shipping", 
    text: "Package in transit",
    details: "Real-time tracking updates sent to buyer agent. ETA: 2025-01-17 09:00 SGT.",
    timestamp: "2025-01-16 08:45:12",
  },
  { 
    title: "Receipt", 
    text: "Buyer receives proof",
    details: "Buyer confirms delivery. Escrow funds released to seller. Transaction finalized on Hedera.",
    timestamp: "2025-01-17 09:15:00",
    txHash: "0x9a1c...5e7b",
  },
  { 
    title: "Rating", 
    text: "Both agents rate each other",
    details: "Buyer: 5★ | Seller: 5★. Trust scores updated in ERC-8004 registry.",
    timestamp: "2025-01-17 09:20:33",
    txHash: "0x2b8f...3d9a",
  },
];

export default function DemoFlowInteractive() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">Featured Demo: iPhone Marketplace</h2>
          <p className="mt-2 text-slate-600">Autonomous agents negotiating, paying, and fulfilling trades — all on Hedera.</p>
        </div>
        <button
          onClick={() => setCurrentProgress(currentProgress === 9 ? 0 : 9)}
          className="btn-primary text-sm"
        >
          {currentProgress === 9 ? "Reset" : "Simulate"}
        </button>
      </div>

      <ol className="relative border-l-2 border-slate-200 ml-4 space-y-2">
        {steps.map((s, i) => {
          const isExpanded = expandedStep === i;
          const isCompleted = i < currentProgress;
          
          return (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.05 * i, duration: 0.45 }}
              className="relative pl-6 pb-4"
            >
              <button
                onClick={() => toggleStep(i)}
                className={`absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-semibold shadow-md transition-all ${
                  isCompleted ? "bg-green-600 scale-110" : "bg-navy hover:scale-110"
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </button>
              
              <div
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  isExpanded ? "bg-navy/5 border-navy shadow-md" : "bg-white border-slate-200 hover:border-navy/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{s.title}</div>
                    <div className="text-slate-600 text-sm">{s.text}</div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-slate-200 space-y-2"
                  >
                    <p className="text-sm text-slate-700">{s.details}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>⏱️ {s.timestamp}</span>
                      {s.txHash && (
                        <a
                          href={`https://hashscan.io/mainnet/transaction/${s.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-navy hover:underline"
                        >
                          📋 {s.txHash}
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.li>
          );
        })}
      </ol>

      {/* Data integration point: Replace static steps with live transaction data from Hedera API */}
    </div>
  );
}
