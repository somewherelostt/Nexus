"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Box, ExternalLink, ChevronDown, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Transaction } from "@/lib/near-rpc";
import { NEAR_EXPLORER_URL } from "@/config/near";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TransactionRowProps {
    tx: Transaction;
    accountId: string;
}

export function TransactionRow({ tx, accountId }: TransactionRowProps) {
    const [expanded, setExpanded] = useState(false);

    // Determine type and styling
    let type = "UNKNOWN";
    let icon = <Box className="w-4 h-4" />;
    let typeColor = "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    let detailsPrimary = "Transaction";
    let detailsSecondary = tx.hash.substring(0, 8) + "...";
    let amount = "";

    const action = tx.actions[0];
    if (!action) {
      detailsPrimary = "Transaction";
      detailsSecondary = tx.hash.substring(0, 8) + "...";
    } else if (tx.signer_id === accountId && action.action === "TRANSFER") {
        type = "SEND";
        icon = <ArrowUpRight className="w-4 h-4" />;
        typeColor = "text-red-400 bg-red-400/10 border-red-400/20";
        detailsPrimary = `Sent to ${tx.receiver_id.length > 15 ? tx.receiver_id.substring(0, 15)+ "..." : tx.receiver_id}`;
        detailsSecondary = "Transfer";
        const nearAmount = action.deposit ? (Number(action.deposit) / 1e24).toFixed(2) : "0";
        amount = `-${nearAmount} NEAR`;
    } else if (tx.receiver_id === accountId && action.action === "TRANSFER") {
        type = "RECEIVE";
        icon = <ArrowDownLeft className="w-4 h-4" />;
        typeColor = "text-green-400 bg-green-400/10 border-green-400/20";
        detailsPrimary = `Received from ${tx.signer_id.length > 15 ? tx.signer_id.substring(0, 15)+ "..." : tx.signer_id}`;
        detailsSecondary = "Transfer";
        const nearAmount = action.deposit ? (Number(action.deposit) / 1e24).toFixed(2) : "0";
        amount = `+${nearAmount} NEAR`;
    } else if (action?.method === "swap") {
        type = "SWAP";
        icon = <RefreshCw className="w-4 h-4" />;
        typeColor = "text-purple-400 bg-purple-400/10 border-purple-400/20";
        detailsPrimary = "Swap on Ref Finance";
        detailsSecondary = "Contract Call";
    } else {
         type = "CONTRACT";
         icon = <Box className="w-4 h-4" />;
         typeColor = "text-blue-400 bg-blue-400/10 border-blue-400/20";
         detailsPrimary = action ? `Call: ${action.method ?? "Unknown"}` : "Contract";
         detailsSecondary = tx.receiver_id;
    }

    // Status
    let statusIcon = <CheckCircle2 className="w-4 h-4 text-green-500" />;
    let statusText = "Confirmed";
    if (tx.status === "FAILURE") {
        statusIcon = <XCircle className="w-4 h-4 text-red-500" />;
        statusText = "Failed";
    } else if (tx.status === "PENDING") {
        statusIcon = <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
        statusText = "Pending";
    }


    return (
        <div className="border-b border-white/5 last:border-0">
            <div 
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.02] cursor-pointer transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Type */}
                <div className="col-span-2 md:col-span-1">
                    <div className={cn("inline-flex p-2 rounded-lg border", typeColor)}>
                        {icon}
                    </div>
                </div>

                {/* Details */}
                <div className="col-span-4 md:col-span-3">
                    <div className="font-medium text-white text-sm">{detailsPrimary}</div>
                    <div className="text-xs text-zinc-500 font-mono">{detailsSecondary}</div>
                </div>

                {/* Amount */}
                <div className="col-span-3 md:col-span-2 text-right md:text-left">
                    {amount && (
                        <>
                            <div className={cn("font-medium text-sm", type === "SEND" ? "text-white" : "text-green-400")}>{amount}</div>
                            <div className="text-xs text-zinc-600">~${Math.abs(parseFloat(amount.replace(/[^0-9.-]/g, "")) * 6.5).toFixed(2)}</div>
                        </>
                    )}
                </div>

                 {/* Status (Hidden on Mobile) */}
                 <div className="hidden md:flex col-span-2 items-center gap-2">
                    {statusIcon}
                    <span className={cn(
                        "text-xs font-medium",
                        tx.status === "SUCCESS" ? "text-green-500" :
                        tx.status === "FAILURE" ? "text-red-500" : "text-yellow-500"
                    )}>
                        {statusText}
                    </span>
                 </div>

                 {/* Time */}
                 <div className="hidden md:block col-span-3 overflow-hidden text-right">
                    <div className="text-sm text-zinc-400" title={new Date(tx.block_timestamp).toLocaleString()}>
                        {formatDistanceToNow(tx.block_timestamp, { addSuffix: true })}
                    </div>
                </div>
                 
                 {/* Explorer Actions */}
                 <div className="col-span-3 md:col-span-1 flex justify-end">
                    <a 
                        href={`${NEAR_EXPLORER_URL}/txns/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                 </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[#0A0A0F]/50"
                    >
                        <div className="p-4 border-t border-white/5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs font-semibold text-zinc-500 uppercase">Transaction Hash</span>
                                    <div className="font-mono text-xs text-white mt-1 select-all">{tx.hash}</div>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-zinc-500 uppercase">Signer ID</span>
                                    <div className="font-mono text-xs text-white mt-1 select-all">{tx.signer_id}</div>
                                </div>
                            </div>
                            
                            <div>
                                <span className="text-xs font-semibold text-zinc-500 uppercase">Raw JSON Data</span>
                                <div className="mt-2 bg-black border border-white/10 rounded-lg p-3 overflow-x-auto">
                                    <pre className="text-[10px] sm:text-xs font-mono text-zinc-400">
                                        {JSON.stringify(tx, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
