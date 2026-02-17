"use client";

import { useWallet } from "@/context/WalletContext";
import { useQuery } from "@tanstack/react-query";
import { fetchAccountTxns, type NearBlocksTx } from "@/lib/near-rpc";
import { NEAR_EXPLORER_URL } from "@/config/near";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Clock, History } from "lucide-react";

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} mins ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} hrs ago`;
  return `${Math.floor(diff / 86400_000)} days ago`;
}

function txType(tx: NearBlocksTx, accountId: string): "sent" | "received" {
  const actions = tx.actions ?? [];
  const hasTransfer = actions.some((a) => a.action === "TRANSFER" || a.action === "Transfer");
  if (hasTransfer && tx.signer_id === accountId) return "sent";
  return "received";
}

function txAmount(tx: NearBlocksTx): string {
  const actions = tx.actions ?? [];
  const transfer = actions.find((a) => a.action === "TRANSFER" || a.action === "Transfer");
  if (!transfer?.deposit) return "—";
  const near = Number(transfer.deposit) / 1e24;
  return `${near.toFixed(2)} NEAR`;
}

export function PaymentHistory() {
  const { accountId } = useWallet();
  const { data: txns = [], isLoading } = useQuery({
    queryKey: ["account-txns-payments", accountId],
    queryFn: () => (accountId ? fetchAccountTxns(accountId, 10) : Promise.resolve([])),
    enabled: !!accountId,
  });

  if (!accountId) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 text-white h-full">
        <CardHeader>
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg"><History className="w-5 h-5" /></span>
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-sm">Connect your NEAR wallet to see transaction history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white h-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg"><History className="w-5 h-5" /></span>
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-zinc-500 text-sm">Loading...</p>
        ) : txns.length === 0 ? (
          <p className="text-zinc-500 text-sm">No transactions yet.</p>
        ) : (
          <div className="space-y-4">
            {txns.map((tx) => {
              const type = txType(tx, accountId);
              const status = tx.outcome?.status ?? tx.status;
              const confirmed = status === "Success" || status === "success";
              return (
                <a
                  key={tx.transaction_hash}
                  href={`${NEAR_EXPLORER_URL}/txns/${tx.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group border border-transparent hover:border-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === "sent" ? "bg-orange-900/20 text-orange-500" : "bg-green-900/20 text-green-500"}`}>
                      {type === "sent" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {type === "sent" ? tx.receiver_id : tx.signer_id}
                      </div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatRelativeTime(tx.block_timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${type === "sent" ? "text-zinc-200" : "text-green-400"}`}>
                      {type === "sent" ? "-" : "+"}{txAmount(tx)}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${confirmed ? "bg-green-900/30 text-green-400" : "bg-yellow-900/30 text-yellow-400"}`}>
                      {confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
