"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { WalletBadge } from "@/components/wallet/WalletBadge";
import { LiveTicker } from "@/components/layout/LiveTicker";

export function TopBar() {
  const { accountId, signIn, loading: isLoading } = useWallet();

  return (
    <header className="fixed top-0 right-0 left-20 z-30 flex items-center justify-between h-14 px-6 border-b border-white/[0.06] bg-[var(--origin-background)]/95 backdrop-blur-xl">
      <Link
        href="/chat"
        className="flex items-center justify-center min-h-[2.25rem] text-lg font-semibold tracking-tight text-white leading-none"
      >
        Nexus<span className="text-[#A855F7]">AI</span>
      </Link>
      <div className="flex items-center gap-6 min-h-[2.5rem]">
        <LiveTicker />
        {accountId ? (
          <WalletBadge />
        ) : (
          <button
            type="button"
            onClick={signIn}
            disabled={isLoading}
            className="font-mono text-xs uppercase tracking-widest h-9 px-4 border border-white/20 bg-transparent text-white hover:border-white/40 hover:shadow-[0_2px_0_0_rgba(168,85,247,0.4)] transition-all rounded-sm disabled:opacity-50 inline-flex items-center justify-center"
          >
            {isLoading ? "..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </header>
  );
}
