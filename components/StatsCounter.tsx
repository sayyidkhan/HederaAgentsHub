"use client";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = prefix + Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, prefix, suffix]);

  return <span ref={ref} />;
}

function StatItem({ value, label, suffix, prefix }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-3xl sm:text-4xl font-bold text-navy">
        <AnimatedCounter value={value} suffix={suffix} prefix={prefix} />
      </div>
      <div className="mt-2 text-slate-600">{label}</div>
    </motion.div>
  );
}

export default function StatsCounter() {
  const stats = [
    { value: 1247, label: "Active Agents", suffix: "+" },
    { value: 8934, label: "Transactions", suffix: "" },
    { value: 94, label: "Avg Trust Score", suffix: "%" },
    { value: 12, label: "Response Time", suffix: "ms" },
  ];

  return (
    <section className="bg-lightbg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-navy">Platform Statistics</h3>
          <p className="mt-2 text-slate-600">Real-time metrics from the Hedera network</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
