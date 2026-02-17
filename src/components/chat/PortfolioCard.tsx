"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useQuery } from "@tanstack/react-query";
import { fetchNEARBalance } from "@/lib/near-rpc";
import { NEAR_NETWORK_ID } from "@/config/near";

export function PortfolioCard() {
  const { accountId, balance } = useWallet();
  const { data: nearPrice } = useQuery({
    queryKey: ["near-price"],
    queryFn: async () => {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=near-protocol&vs_currencies=usd");
      const data = await res.json();
      return (data?.["near-protocol"]?.usd as number) ?? 0;
    },
    staleTime: 60_000,
  });

  const balanceNum = balance != null ? parseFloat(balance) : (accountId ? null : 0);
  const totalUsd = balanceNum != null && nearPrice != null ? balanceNum * nearPrice : null;
  const networkLabel = NEAR_NETWORK_ID === "mainnet" ? "NEAR Mainnet" : "NEAR Testnet";

  if (!accountId) {
    return (
      <Card className="bg-[#0A0A0F] border border-purple-500/20 max-w-sm w-full p-4 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-sm text-muted-foreground">Total Balance</h4>
            <div className="text-2xl font-bold text-white">—</div>
          </div>
          <div className="bg-purple-500/10 p-2 rounded-lg">
            <ArrowUpRight className="w-4 h-4 text-purple-400" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Connect your NEAR wallet to see your portfolio.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-[#0A0A0F] border border-purple-500/20 max-w-sm w-full p-4 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm text-muted-foreground">Total Balance</h4>
          <div className="text-2xl font-bold text-white">
            {totalUsd != null ? `$${totalUsd.toFixed(2)}` : "—"}
          </div>
        </div>
        <div className="bg-purple-500/10 p-2 rounded-lg">
          <ArrowUpRight className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full border border-white/10 flex items-center justify-center text-[10px] text-white">N</div>
            <span className="text-sm text-white">NEAR</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-white">{balance ?? "0"}</div>
            <div className="text-xs text-muted-foreground">
              {totalUsd != null ? `$${totalUsd.toFixed(2)}` : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-white/5 text-center">
        <span className="text-xs text-muted-foreground">{networkLabel}</span>
      </div>
      <div className="mt-2 text-center">
        <a href="/portfolio" className="text-xs text-purple-400 hover:text-purple-300">Open Full Portfolio →</a>
      </div>
    </Card>
  );
}
