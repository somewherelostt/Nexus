"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { NexusButton } from "@/components/ui/NexusButton";
import Link from "next/link";
import { truncateAddress } from "@/lib/utils";

export function Navigation() {
  const { accountId, signIn, signOut, loading: isLoading } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!accountId) return;
    try {
      await navigator.clipboard.writeText(accountId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-white/5">
      <Link href="/" className="text-xl font-medium tracking-tight hover:opacity-80 transition-opacity">
        Nexus<span className="text-accent">AI</span>
      </Link>
      
      <div className="flex items-center gap-6">
          <Link href="/memory" className="text-sm text-muted-foreground hover:text-accent transition-colors">
            Memory Vault
          </Link>
          <div className="flex items-center gap-4">
        {accountId ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={copyToClipboard}
              className="group flex items-center gap-2 text-sm font-mono text-muted-foreground/80 px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
              title="Copy address"
            >
                <span>{truncateAddress(accountId)}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
             </button>
             <NexusButton variant="secondary" size="sm" onClick={signOut}>
                Disconnect
             </NexusButton>
          </div>
        ) : (
          <NexusButton variant="primary" size="sm" onClick={signIn} className="shadow-nexus-glow-sm" disabled={isLoading}>
            {isLoading ? "Loading..." : "Connect Wallet"}
          </NexusButton>
        )}
      </div>
      </div>
    </nav>
  );
}

