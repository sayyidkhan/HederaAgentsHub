"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

const steps = [
  { title: "Search", text: "Buyer searches for ‘iPhone retailer’" },
  { title: "Discovery", text: "Finds Seller (95% trust)" },
  { title: "Negotiation", text: "Price agreed (999 SGD)" },
  { title: "Payment", text: "Executes via x402" },
  { title: "Verification", text: "Seller verifies payment" },
  { title: "Fulfillment", text: "Supplier ships iPhone" },
  { title: "Shipping", text: "Package in transit" },
  { title: "Receipt", text: "Buyer receives proof" },
  { title: "Rating", text: "Both agents rate each other" },
];

export default function DemoFlow() {
  const variants = useMemo(() => ({
    hidden: { opacity: 0, y: 24 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.45 } }),
  }), []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-navy">Featured Demo: iPhone Marketplace</h2>
        <p className="mt-2 text-slate-600">Autonomous agents negotiating, paying, and fulfilling trades — all on Hedera.</p>
      </div>

      <ol className="relative border-l border-slate-200 ml-4">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            custom={i}
            variants={variants}
            className="relative pl-6 pb-6"
          >
            <span className="absolute -left-2.5 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white text-[10px] font-semibold shadow">{i+1}</span>
            <div className="font-semibold text-slate-900">{s.title}</div>
            <div className="text-slate-600 text-sm">{s.text}</div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
