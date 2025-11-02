"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface Step {
  title: string;
  text: string;
  details: string;
  image: string;
  color: string;
}

const steps: Step[] = [
  {
    title: "Search",
    text: "Buyer searches for 'iPhone retailer'",
    details: "Agent queries ERC-8004 registry for verified iPhone sellers with trust scores above 90%.",
    image: "🔍",
    color: "from-slate-100 to-slate-200",
  },
  {
    title: "Discovery",
    text: "Finds Seller (95% trust)",
    details: "Seller agent identified with 95% trust score based on 47 successful transactions and 4.8★ rating.",
    image: "🎯",
    color: "from-blue-50 to-blue-100",
  },
  {
    title: "Negotiation",
    text: "Price agreed (999 SGD)",
    details: "Automated price negotiation completed in 2 rounds. Initial ask: 1,099 SGD, final: 999 SGD.",
    image: "💬",
    color: "from-indigo-50 to-indigo-100",
  },
  {
    title: "Payment",
    text: "Executes via x402",
    details: "x402 payment intent created. Funds held in escrow until fulfillment conditions are met.",
    image: "💳",
    color: "from-navy/5 to-navy/10",
  },
  {
    title: "Verification",
    text: "Seller verifies payment",
    details: "Seller agent confirms payment receipt on Hedera. Escrow condition #1 satisfied.",
    image: "✓",
    color: "from-slate-50 to-slate-100",
  },
  {
    title: "Fulfillment",
    text: "Supplier ships iPhone",
    details: "Seller initiates shipment with tracking number SG-12345-HK. Carrier: DHL Express.",
    image: "📦",
    color: "from-blue-100 to-blue-200",
  },
  {
    title: "Shipping",
    text: "Package in transit",
    details: "Real-time tracking updates sent to buyer agent. ETA: 2025-01-17 09:00 SGT.",
    image: "🚚",
    color: "from-indigo-100 to-indigo-200",
  },
  {
    title: "Receipt",
    text: "Buyer receives proof",
    details: "Buyer confirms delivery. Escrow funds released to seller. Transaction finalized on Hedera.",
    image: "📱",
    color: "from-slate-100 to-slate-200",
  },
  {
    title: "Rating",
    text: "Both agents rate each other",
    details: "Buyer: 5★ | Seller: 5★. Trust scores updated in ERC-8004 registry.",
    image: "⭐",
    color: "from-blue-50 to-indigo-100",
  },
];

function ScrollStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-50, 0, 0, -50]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, x }}
      className="grid md:grid-cols-2 gap-8 items-center mb-20"
    >
      {/* Visual/Image Side */}
      <motion.div
        className={`relative h-64 md:h-80 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center border border-slate-200 overflow-hidden`}
      >
        <div className="relative text-8xl md:text-9xl filter grayscale opacity-70">{step.image}</div>
        <div className="absolute top-4 left-4 h-10 w-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm shadow-md">
          {index + 1}
        </div>
      </motion.div>

      {/* Content Side */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold mb-3">
            Step {index + 1} of 9
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-navy mb-2">{step.title}</h3>
          <p className="text-lg text-slate-700 mb-4">{step.text}</p>
          <p className="text-slate-600 leading-relaxed">{step.details}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function DemoFlowScroll() {
  return (
    <div>
      <div className="mb-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy">Featured Demo: iPhone Marketplace</h2>
        <p className="mt-2 text-slate-600">
          Scroll to see how autonomous agents negotiate, pay, and fulfill trades on Hedera.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, i) => (
          <ScrollStep key={step.title} step={step} index={i} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-navy/10 text-navy rounded-lg font-medium border border-navy/20">
          <span className="text-2xl">✓</span>
          <span>Transaction Complete — All 9 Steps Finalized on Hedera</span>
        </div>
      </div>

      {/* Data integration point: Replace static steps with live transaction data from Hedera API */}
    </div>
  );
}
