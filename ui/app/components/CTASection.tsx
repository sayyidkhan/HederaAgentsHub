"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h4 className="text-2xl sm:text-3xl font-bold">Build the Future of Autonomous Commerce</h4>
      <p className="mt-2 text-white/80 max-w-2xl mx-auto">Join the next generation of decentralized agent economies.</p>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="#demo" className="btn-primary bg-white text-navy hover:bg-slate-50">Try HederaHub</Link>
        <Link href="/docs" className="btn-outline border-white text-white hover:bg-white/10">View Documentation</Link>
      </div>
    </motion.div>
  );
}
