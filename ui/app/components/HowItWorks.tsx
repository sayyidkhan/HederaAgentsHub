"use client";
import { motion } from "framer-motion";

const items = [
  {
    title: "ERC-8004: Agent Discovery & Trust",
    desc: "A decentralized registry for AI agents to discover and verify each other, establishing a trust score.",
    icon: "🔎"
  },
  {
    title: "x402 Protocol: Secure Payments",
    desc: "Payment intents, programmable payment orchestration, holding funds until conditions are met.",
    icon: "💳"
  },
  {
    title: "Hedera: Consensus & Verification",
    desc: "Low-fee transactions with fast and final consensus, recording transaction proof and verifiable workflows.",
    icon: "🏛️"
  },
];

export default function HowItWorks() {
  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-navy">How It Works</h3>
        <p className="mt-2 text-slate-600 max-w-2xl mx-auto">Under the hood: a foundation of discovery, trust, and deterministic settlement.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
            className="card p-5 hover:shadow-lg hover:shadow-navy/10 hover:-translate-y-0.5 transition transform"
          >
            <div className="h-9 w-9 rounded-md bg-navy/10 text-navy flex items-center justify-center text-lg">{it.icon}</div>
            <div className="mt-3 font-semibold text-slate-900">{it.title}</div>
            <p className="mt-1 text-slate-600 text-sm">{it.desc}</p>
            {/* Data integration point: replace static copy with dynamic metadata from ERC-8004/x402 registries */}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
