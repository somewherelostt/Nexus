"use client";

import { TransactionTable } from "@/components/transactions/TransactionTable";
import { useWallet } from "@/context/WalletContext";
import { useQuery } from "@tanstack/react-query";

export default function TransactionsPage() {
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
  const balanceNum = balance != null ? parseFloat(balance) : 0;
  const netWorthUsd = nearPrice != null ? balanceNum * nearPrice : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Transaction History</h1>
          <p className="text-muted-foreground">View and manage your on-chain activity across NEAR Protocol.</p>
        </div>

        {accountId && (
          <div className="card-origin px-5 py-4 flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Net Worth</div>
              <div className="text-xl font-semibold text-white">
                {netWorthUsd != null ? `$${netWorthUsd.toFixed(2)}` : "—"}
              </div>
            </div>
          </div>
        )}
      </div>

      <TransactionTable />
    </div>
  );
}
