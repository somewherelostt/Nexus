"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionRow } from "./TransactionRow";
import { fetchAccountHistory, Transaction } from "@/lib/near-rpc";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TransactionTable() {
  const { accountId } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!accountId) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchAccountHistory(accountId)
      .then((data) => {
        if (!cancelled) setTransactions(data);
      })
      .catch((e) => {
        if (!cancelled) setTransactions([]);
        console.error(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [accountId]);

  const filteredTransactions = transactions.filter((tx) => {
    if (!accountId) return false;
    if (filter === "All") return true;
    const action = tx.actions[0];
    if (filter === "Sent") return action?.action === "TRANSFER" && tx.signer_id === accountId;
    if (filter === "Received") return action?.action === "TRANSFER" && tx.receiver_id === accountId;
    if (filter === "Swaps") return action?.method === "swap";
    if (filter === "Contract Calls") return action?.action === "FUNCTION_CALL";
    return true;
  });

  return (
    <div className="space-y-6">
      <TransactionFilters filter={filter} setFilter={setFilter} />

      <Card className="bg-[#0F0F1A] border-white/5 overflow-hidden min-h-[400px]">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden md:grid">
          <div className="col-span-1">Type</div>
          <div className="col-span-3">Details</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Time</div>
          <div className="col-span-1 text-right">Explorer</div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
            <p className="text-zinc-500">Loading history...</p>
          </div>
        ) : !accountId ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Connect your wallet</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              Connect your NEAR wallet to view transaction history.
            </p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🌪️</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No transactions found</h3>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto">
              We couldn&apos;t find any transactions matching your filters.
            </p>
          </div>
        ) : (
          <div>
            {filteredTransactions.map((tx) => (
              <TransactionRow key={tx.hash} tx={tx} accountId={accountId} />
            ))}
          </div>
        )}
      </Card>

      {!loading && accountId && filteredTransactions.length > 0 && (
        <div className="flex justify-between items-center text-sm text-zinc-500 px-2">
          <span>Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}
