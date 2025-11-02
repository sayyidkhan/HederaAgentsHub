"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2 font-semibold text-navy">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-navy text-white">★</span>
          <span>HederaHub</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-3">
          <Link href="#demo" className="btn-primary text-sm">Launch Demo</Link>
          <Link href="/marketplace" className="btn-outline text-sm">Explore Agents</Link>
        </nav>
        <button className="sm:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border" onClick={() => setOpen(v=>!v)} aria-label="Toggle Menu">≡</button>
      </div>
      {open && (
        <div className="sm:hidden border-t border-slate-200 px-4 py-3 flex gap-3">
          <Link href="#demo" className="btn-primary text-sm flex-1">Launch Demo</Link>
          <Link href="/marketplace" className="btn-outline text-sm flex-1">Explore Agents</Link>
        </div>
      )}
    </header>
  );
}
