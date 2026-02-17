"use client";

import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const { accountId, signIn, signOut } = useWallet();

  return (
    <nav className="flex items-center justify-between p-4 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
        NexusAI
      </div>
      <div className="flex items-center gap-4">
        {accountId ? (
          <div className="flex items-center gap-4">
             <div className="text-sm font-mono text-muted-foreground">
                {accountId}
             </div>
             <Button variant="outline" onClick={signOut}>
                Disconnect
             </Button>
          </div>
        ) : (
          <Button variant="neon" onClick={signIn}>
            Connect Wallet
          </Button>
        )}
      </div>
    </nav>
  );
}
