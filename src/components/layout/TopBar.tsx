"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { WalletBadge } from "@/components/wallet/WalletBadge";
import { LiveTicker } from "@/components/layout/LiveTicker";

export function TopBar() {
  const { accountId, signIn, loading: isLoading } = useWallet();

  return (
    <header className="fixed top-0 right-0 left-20 z-30 flex flex-col border-b border-white/[0.06] bg-[var(--origin-background)]/95 backdrop-blur-xl">
      <div className="origin-header-strip h-9 flex items-center justify-center gap-6 px-4">
        <span className="text-[10px] font-medium text-white/70 uppercase tracking-widest">NEAR Testnet</span>
        <span className="text-[10px] text-emerald-400/90 uppercase tracking-widest">Private execution</span>
      </div>
      <div className="h-14 flex items-center justify-between px-6">
        <Link href="/chat" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-white">
            Nexus<span className="text-[#A855F7]">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <LiveTicker />
          {accountId ? (
            <WalletBadge />
          ) : (
            <button
              type="button"
              onClick={signIn}
              disabled={isLoading}
              className="font-mono text-xs uppercase tracking-widest h-9 px-4 border border-white/20 bg-transparent text-white hover:border-white/40 hover:shadow-[0_2px_0_0_rgba(168,85,247,0.4)] transition-all rounded-sm disabled:opacity-50"
            >
              {isLoading ? "..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
