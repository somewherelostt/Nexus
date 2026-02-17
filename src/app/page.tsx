"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Shield, MessageSquare } from "lucide-react";

const CARDS = [
  {
    title: "Assistant",
    status: "Free",
    description: "Chat with NexusAI. Send, swap, and manage assets on NEAR with natural language.",
    href: "/chat",
    icon: MessageSquare,
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.08) 100%)",
  },
  {
    title: "Portfolio",
    status: "Testnet",
    description: "View balances, transaction history, and activity across your NEAR account.",
    href: "/portfolio",
    icon: Zap,
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(249,115,22,0.08) 100%)",
    badge: "Popular",
  },
  {
    title: "Payments & Vault",
    status: "Free",
    description: "Send payments, accept HOT Pay, and store files privately with NOVA encryption.",
    href: "/payments",
    icon: Shield,
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.12) 0%, rgba(6,182,212,0.08) 100%)",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--origin-background)] text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[var(--origin-background)]/90 backdrop-blur-xl">
        <div className="origin-header-strip h-10 flex items-center justify-center gap-6 px-4">
          <span className="text-[10px] font-medium text-white/70 uppercase tracking-widest">NEAR Testnet</span>
          <span className="text-[10px] text-emerald-400/90 uppercase tracking-widest">Private execution</span>
        </div>
        <div className="flex items-center justify-between px-6 py-3">
          <span className="text-lg font-semibold tracking-tight text-white">
            Nexus<span className="text-[#A855F7]">AI</span>
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="font-mono text-xs uppercase tracking-widest h-9 px-4 border border-white/20 bg-white text-[#0A0A0A] hover:bg-white/90 transition-colors rounded-sm inline-flex items-center justify-center"
            >
              Enter App
            </Link>
            <Link
              href="/chat"
              className="font-mono text-xs uppercase tracking-widest h-9 px-4 border border-white/10 text-white hover:border-white/20 transition-colors rounded-sm inline-flex items-center justify-center"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-nexus-radial opacity-20 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
            Select Your Journey
          </h1>
          <p className="text-base text-white/60 mb-10 font-sans">
            Choose how you want to use NexusAI in the NEAR ecosystem.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-4 py-2 rounded-sm transition-colors"
          >
            Compare options <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mx-auto mt-12">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * i }}
              className="group"
            >
              <Link href={card.href} className="block h-full">
                <div
                  className="card-origin relative flex flex-col h-full min-h-[320px] overflow-hidden transition-colors"
                  style={{ background: `var(--origin-surface)`, border: "1px solid var(--origin-border-dim)" }}
                >
                  <div
                    className="absolute inset-0 opacity-70 pointer-events-none"
                    style={{ background: card.gradient }}
                  />
                  {card.badge && (
                    <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest text-[#A855F7]">
                      {card.badge}
                    </span>
                  )}
                  <div className="relative z-10 flex flex-1 flex-col p-6">
                    <div className="w-16 h-16 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                      <card.icon className="w-8 h-8 text-[#A855F7]" />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2">
                      {card.title}
                    </p>
                    <p className="text-sm text-white/70 font-sans leading-relaxed flex-1">
                      {card.description}
                    </p>
                  </div>
                  {/* Card footer: left = title + arrow, right = status */}
                  <div className="relative z-10 flex items-center justify-between px-5 py-4 border-t border-white/[0.06] font-mono text-xs uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-white/90">
                      {card.title}
                      <ArrowRight className="w-3.5 h-3.5 text-white/50" />
                    </span>
                    <span className="text-white/50">{card.status}</span>
                  </div>
                  <p className="relative z-10 px-5 pb-4 font-mono text-[10px] text-white/40 tracking-wide">
                    NEAR Testnet · Encrypted execution
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/[0.06] py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/40">
          <span>NexusAI · NEAR Testnet · Private execution</span>
          <Link href="/chat" className="text-[#A855F7] hover:text-[#A855F7]/80">
            Enter App →
          </Link>
        </div>
      </footer>
    </div>
  );
}
