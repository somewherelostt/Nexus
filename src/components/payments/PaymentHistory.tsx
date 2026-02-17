"use client";

import { useWallet } from "@/context/WalletContext";
import { useQuery } from "@tanstack/react-query";
import { fetchAccountTxns, type NearBlocksTx } from "@/lib/near-rpc";
import { NEAR_EXPLORER_URL } from "@/config/near";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Clock, History } from "lucide-react";

function formatRelativeTime(blockTimestamp: string | number): string {
  let tsMs: number;
  if (typeof blockTimestamp === "string") {
    const parsed = Date.parse(blockTimestamp);
    if (Number.isFinite(parsed)) {
      tsMs = parsed;
    } else {
      const num = Number(blockTimestamp);
      tsMs = Number.isFinite(num) ? (num > 1e15 ? num / 1e6 : num) : NaN;
    }
  } else {
    const num = Number(blockTimestamp);
    tsMs = Number.isFinite(num) ? (num > 1e15 ? num / 1e6 : num) : NaN;
  }
  if (!Number.isFinite(tsMs)) return "—";
  const d = new Date(tsMs);
  if (Number.isNaN(d.getTime())) return "—";
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 0) return "Just now";
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
      <Card className="rounded-sm border border-white/[0.08] bg-[var(--origin-surface)] h-full hover:border-white/[0.12]">
        <CardHeader className="border-b border-white/5 px-4 py-3">
          <CardTitle className="font-mono text-xs uppercase tracking-widest text-white/90 flex items-center gap-2">
            <History className="w-4 h-4 text-[#A855F7]" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="font-mono text-xs text-white/50">Connect your NEAR wallet to see transaction history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-sm border border-white/[0.08] bg-[var(--origin-surface)] h-full hover:border-white/[0.12]">
      <CardHeader className="border-b border-white/5 px-4 py-3">
        <CardTitle className="font-mono text-xs uppercase tracking-widest text-white/90 flex items-center gap-2">
          <History className="w-4 h-4 text-[#A855F7]" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4">
            <div className="loader-pulse-bar w-24" />
            <p className="font-mono text-xs text-white/50 mt-3">Loading...</p>
          </div>
        ) : txns.length === 0 ? (
          <p className="font-mono text-xs text-white/50 p-4">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-white/5">
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
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-sm border border-white/10 flex items-center justify-center shrink-0 ${
                        type === "sent" ? "bg-white/5 text-white/80" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {type === "sent" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-xs text-white/90 truncate group-hover:text-white">
                        {type === "sent" ? tx.receiver_id : tx.signer_id}
                      </div>
                      <div className="font-mono text-[10px] text-white/50 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 shrink-0" />
                        {formatRelativeTime(tx.block_timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`font-mono text-sm token-amount value-glow ${
                        type === "sent" ? "text-white/80" : "text-emerald-400"
                      }`}
                    >
                      {type === "sent" ? "-" : "+"}
                      {txAmount(tx)}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5 ${
                        confirmed
                          ? "text-emerald-400/90 border-emerald-500/20 bg-emerald-500/5"
                          : "text-amber-400/90 border-amber-500/20 bg-amber-500/5"
                      }`}
                    >
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
