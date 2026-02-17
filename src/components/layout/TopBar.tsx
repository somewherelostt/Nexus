"use client";

import { useWallet } from "@/context/WalletContext";
import { NexusButton } from "@/components/ui/NexusButton";
import { WalletBadge } from "@/components/wallet/WalletBadge";

export function TopBar() {
  const { accountId, signIn, loading: isLoading } = useWallet();

  return (
    <header className="fixed top-0 right-0 left-64 h-20 z-30 flex items-center justify-end px-8 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
            {accountId ? (
                <WalletBadge />
            ) : (
                <NexusButton 
                    variant="primary" 
                    size="sm" 
                    onClick={signIn} 
                    className="shadow-nexus-glow-sm" 
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Connect Wallet"}
                </NexusButton>
            )}
        </div>
    </header>
  );
}
