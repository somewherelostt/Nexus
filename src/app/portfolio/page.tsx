"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useQuery } from "@tanstack/react-query";
import { fetchNEARBalance, fetchAccountTxns, type NearBlocksTx } from "@/lib/near-rpc";
import { truncateAddress } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const CARD_CLASS =
  "rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[#0A0A0F] text-white";
const MUTED = "text-[rgba(255,255,255,0.65)]";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-white/10 ${className}`}
      aria-hidden
    />
  );
}

function WalletOverviewSkeleton() {
  return (
    <div className={CARD_CLASS + " p-6"}>
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function WalletOverviewCard({
  accountId,
  balance,
  balanceUsd,
  loading,
}: {
  accountId: string | null;
  balance: string | null;
  balanceUsd: number | null;
  loading: boolean;
}) {
  if (loading) return <WalletOverviewSkeleton />;
  if (!accountId) {
    return (
      <Card className={CARD_CLASS}>
        <CardContent className="p-8 text-center">
          <p className={MUTED}>Connect your NEAR wallet to view your portfolio.</p>
        </CardContent>
      </Card>
    );
  }

  const totalUsd = balanceUsd ?? 0;

  return (
    <Card className={CARD_CLASS + " relative overflow-hidden"}>
      <CardContent className="p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="space-y-1">
            <p className={`text-sm ${MUTED}`}>Wallet</p>
            <p className="font-mono text-sm text-white">
              {truncateAddress(accountId, 6)}
            </p>
            <p className={`text-xs ${MUTED} mt-2`}>
              NEAR balance: <span className="text-white font-medium">{balance ?? "0"}</span> NEAR
              {balanceUsd != null && (
                <span className="ml-1">(${balanceUsd.toFixed(2)} USD)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.06)] bg-[#0A0A0F] px-3 py-1 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              </span>
              Verified Private Execution
            </span>
            <span className="rounded-full border border-[rgba(255,255,255,0.06)] bg-[#0A0A0F] px-3 py-1 text-xs text-[rgba(255,255,255,0.65)] uppercase tracking-wide">
              NEAR Testnet
            </span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <p className={`text-xs ${MUTED}`}>Total portfolio value</p>
          <p className="text-2xl font-semibold text-white">
            ${totalUsd.toFixed(2)} USD
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TokenAvatar({ symbol }: { symbol: string }) {
  const letter = symbol.charAt(0).toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white border border-white/5">
      {letter}
    </div>
  );
}

function TokenHoldingsTable({
  accountId,
  hideDust,
  onHideDustChange,
}: {
  accountId: string | null;
  hideDust: boolean;
  onHideDustChange: (v: boolean) => void;
}) {
  const { data: balance, isLoading } = useQuery({
    queryKey: ["near-balance", accountId],
    queryFn: () => (accountId ? fetchNEARBalance(accountId) : Promise.resolve(0)),
    enabled: !!accountId,
  });
  const { data: nearPrice } = useQuery({
    queryKey: ["near-price"],
    queryFn: async () => {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=near-protocol&vs_currencies=usd");
      const data = await res.json();
      return (data?.["near-protocol"]?.usd as number) ?? 0;
    },
    staleTime: 60_000,
  });

  const tokens: { symbol: string; balance: string; valueUsd: number; change24h: number | null }[] = [];
  if (accountId && balance != null && balance > 0 && nearPrice != null) {
    const valueUsd = balance * nearPrice;
    if (!hideDust || valueUsd >= 1) {
      tokens.push({
        symbol: "NEAR",
        balance: balance.toFixed(4),
        valueUsd,
        change24h: null,
      });
    }
  }

  const loading = !!accountId && isLoading;

  if (!accountId) {
    return (
      <Card className={CARD_CLASS}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Token Holdings</CardTitle>
          <CardDescription className={MUTED}>Connect wallet to see tokens.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={CARD_CLASS}>
      <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Token Holdings</CardTitle>
          <CardDescription className={MUTED}>Your NEP-141 and native NEAR</CardDescription>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={hideDust}
            onChange={(e) => onHideDustChange(e.target.checked)}
            className="rounded border-white/20 bg-white/5"
          />
          <span className={MUTED}>Dust Tokens (hide &lt;$1)</span>
        </label>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : tokens.length === 0 ? (
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0A0A0F] p-8 text-center">
            <p className={MUTED}>No tokens found. Ask NexusAI to swap some tokens.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={MUTED + " text-left border-b border-[rgba(255,255,255,0.06)]"}>
                  <th className="pb-3 font-medium">Token</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Value (USD)</th>
                  <th className="pb-3 font-medium">24h Change</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((t) => (
                  <tr
                    key={t.symbol}
                    className="border-b border-[rgba(255,255,255,0.06)] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <TokenAvatar symbol={t.symbol} />
                        <span className="font-medium">{t.symbol}</span>
                        <span className="rounded border border-[rgba(255,255,255,0.06)] px-1.5 py-0.5 text-[10px] uppercase text-[rgba(255,255,255,0.65)]">
                          NEAR
                        </span>
                      </div>
                    </td>
                    <td className="py-3">{t.balance}</td>
                    <td className="py-3">${t.valueUsd.toFixed(2)}</td>
                    <td className="py-3">{t.change24h != null ? `${t.change24h > 0 ? "+" : ""}${t.change24h.toFixed(2)}%` : "—"}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        className="text-xs text-[rgba(255,255,255,0.65)] hover:text-white hover:underline"
                      >
                        Swap
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivePositionsSection() {
  const positions: unknown[] = [];

  return (
    <Card className={CARD_CLASS}>
      <CardHeader>
        <CardTitle className="text-lg">Active Positions</CardTitle>
        <CardDescription className={MUTED}>Yield and liquidity positions</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {positions.length === 0 ? (
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0A0A0F] p-8 text-center">
            <p className={MUTED}>No active positions. Stake or add liquidity to see them here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className={MUTED + " text-left border-b border-[rgba(255,255,255,0.06)]"}>
                <th className="pb-3 font-medium">Token</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">APY</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((_, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.06)]">
                  <td className="py-3">—</td>
                  <td className="py-3">—</td>
                  <td className="py-3">—</td>
                  <td className="py-3">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

function txTypeFromTx(tx: NearBlocksTx): "SEND" | "RECEIVE" | "SWAP" {
  const actions = tx.actions ?? [];
  const hasTransfer = actions.some(
    (a: { action?: string }) => a.action === "TRANSFER" || (a as { action?: string }).action === "Transfer"
  );
  if (hasTransfer) {
    return "SEND";
  }
  return "SWAP";
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} mins ago`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} hrs ago`;
  return `${Math.floor(diff / 86400_000)} days ago`;
}

function TransactionHistoryPreview({ accountId }: { accountId: string | null }) {
  const { data: txns = [], isLoading } = useQuery({
    queryKey: ["account-txns", accountId],
    queryFn: () => (accountId ? fetchAccountTxns(accountId, 5) : Promise.resolve([])),
    enabled: !!accountId,
  });

  if (!accountId) {
    return (
      <Card className={CARD_CLASS}>
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
          <CardDescription className={MUTED}>Connect wallet to see recent transactions.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={CARD_CLASS}>
      <CardHeader>
        <CardTitle className="text-lg">Transaction History</CardTitle>
        <CardDescription className={MUTED}>Last 5 transactions</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : txns.length === 0 ? (
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0A0A0F] p-8 text-center">
            <p className={MUTED}>No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {txns.map((tx) => {
              const type = txTypeFromTx(tx);
              const typeStyles =
                type === "SEND"
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  : type === "RECEIVE"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-[#6C5CE7]/20 text-[#9B8AFF] border-[#6C5CE7]/30";
              const status = tx.outcome?.status ?? tx.status;
              const confirmed = status === "Success" || status === "success" || status === "EXECUTED";
              const txUrl = `https://testnet.nearblocks.io/txns/${tx.transaction_hash}`;

              return (
                <div
                  key={tx.transaction_hash}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0A0A0F] p-3 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium ${typeStyles}`}
                    >
                      {type}
                    </span>
                    <span className={`text-sm ${MUTED}`}>
                      {tx.signer_id} → {tx.receiver_id}
                    </span>
                    <span className="text-xs text-white/80">
                      {formatRelativeTime(tx.block_timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        confirmed
                          ? "text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          : "text-amber-400 border-amber-500/30 animate-pulse"
                      }`}
                    >
                      {confirmed ? "Confirmed" : "Pending"}
                    </span>
                    <Link
                      href={txUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgba(255,255,255,0.65)] hover:text-white transition-colors"
                      aria-label="View on explorer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PortfolioPage() {
  const { accountId, balance, loading } = useWallet();
  const [hideDust, setHideDust] = useState(false);

  const { data: nearPrice } = useQuery({
    queryKey: ["near-price"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near-protocol&vs_currencies=usd"
      );
      const data = await res.json();
      return (data?.["near-protocol"]?.usd as number) ?? 3.5;
    },
    staleTime: 60_000,
  });

  const balanceNum = balance != null ? parseFloat(balance) : 0;
  const balanceUsd = nearPrice != null ? balanceNum * nearPrice : null;

  return (
    <div className="min-h-full bg-[#000000]">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Portfolio
          </h1>
          <p className={`text-sm ${MUTED} mt-1`}>
            Overview of your NEAR wallet and activity
          </p>
        </div>

        <WalletOverviewCard
          accountId={accountId}
          balance={balance}
          balanceUsd={balanceUsd}
          loading={loading}
        />

        <TokenHoldingsTable
          accountId={accountId}
          hideDust={hideDust}
          onHideDustChange={setHideDust}
        />

        <ActivePositionsSection />

        <TransactionHistoryPreview accountId={accountId} />
      </div>
    </div>
  );
}
