"use client";

import { useWallet } from "@/context/WalletContext";
import { truncateAddress } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function WalletBadge() {
  const { accountId, balance } = useWallet();

  if (!accountId) return null;

  return (
    <div className="flex items-center gap-4 bg-secondary/50 border border-white/5 rounded-full px-4 py-1.5 h-10 backdrop-blur-sm">
        {/* Balance */}
        <div className="text-sm font-medium text-white/90">
            {balance ? parseFloat(balance).toFixed(2) : "0"} NEAR
        </div>

        {/* Separator */}
        <div className="h-4 w-[1px] bg-white/10" />

        {/* Network Badge */}
        <div className="flex items-center gap-2">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Testnet</span>
        </div>

        {/* Separator */}
        <div className="h-4 w-[1px] bg-white/10" />

        {/* Address Link */}
        <Link 
            href={`https://testnet.nearblocks.io/address/${accountId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
        >
            <span className="text-sm text-muted-foreground font-mono">
                {truncateAddress(accountId, 6)}
            </span>
            <ExternalLink className="w-3 h-3 text-muted-foreground/50 group-hover:text-accent transition-colors" />
        </Link>
    </div>
  );
}
