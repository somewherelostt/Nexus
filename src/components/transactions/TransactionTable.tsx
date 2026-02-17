"use client";

import { useState, useEffect } from "react";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionRow } from "./TransactionRow";
import { fetchAccountHistory, Transaction } from "@/lib/near-rpc"; // Mock fetch
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TransactionTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        // Mock fetch
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchAccountHistory("user.testnet"); // Mock User ID
                setTransactions(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredTransactions = transactions.filter((tx) => {
        if (filter === "All") return true;
        if (filter === "Sent") return tx.actions[0].action === "TRANSFER" && tx.signer_id === "user.testnet"; // Mock check
        if (filter === "Received") return tx.actions[0].action === "TRANSFER" && tx.receiver_id === "user.testnet";
        if (filter === "Swaps") return tx.actions[0].method === "swap";
        if (filter === "Contract Calls") return tx.actions[0].action === "FUNCTION_CALL";
        return true;
    });

    return (
        <div className="space-y-6">
            <TransactionFilters filter={filter} setFilter={setFilter} />

            <Card className="bg-[#0F0F1A] border-white/5 overflow-hidden min-h-[400px]">
                 {/* Table Header */}
                 <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/[0.02] text-xs font-semibold text-zinc-500 uppercase tracking-widest hidden md:grid">
                    <div className="col-span-1">Type</div>
                    <div className="col-span-3">Details</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3 text-right">Time</div>
                    <div className="col-span-1 text-right">Explorer</div>
                 </div>

                 {/* Content */}
                 {loading ? (
                     <div className="flex flex-col items-center justify-center py-20">
                         <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
                         <p className="text-zinc-500">Loading history...</p>
                     </div>
                 ) : filteredTransactions.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 text-center">
                         <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🌪️</span>
                         </div>
                         <h3 className="text-lg font-medium text-white mb-1">No transactions found</h3>
                         <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                            We couldn't find any transactions matching your filters.
                         </p>
                     </div>
                 ) : (
                     <div>
                         {filteredTransactions.map((tx) => (
                             <TransactionRow key={tx.hash} tx={tx} accountId="user.testnet" />
                         ))}
                     </div>
                 )}
            </Card>

            {/* Pagination Mock */}
            {!loading && filteredTransactions.length > 0 && (
                <div className="flex justify-between items-center text-sm text-zinc-500 px-2">
                    <span>Showing {filteredTransactions.length} of 47 transactions</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-white">Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}
