"use client";

import { useWallet } from "@/context/WalletContext";
import { NexusButton } from "@/components/ui/NexusButton";
import Link from "next/link";

export function Navigation() {
  const { accountId, signIn, signOut } = useWallet();

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
             <div className="text-sm font-mono text-muted-foreground/80 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                {accountId}
             </div>
             <NexusButton variant="secondary" size="sm" onClick={signOut}>
                Disconnect
             </NexusButton>
          </div>
        ) : (
          <Link href="/chat">
            <NexusButton variant="primary" size="sm" onClick={signIn} className="shadow-nexus-glow-sm">
              Launch Assistant
            </NexusButton>
          </Link>
        )}
      </div>
    </nav>
  );
}
