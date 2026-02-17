"use client";

import React from "react";
import { NexusButton } from "@/components/ui/NexusButton";
import { cn } from "@/lib/utils";
import { Check, Loader2, ArrowRight, Zap, ShieldCheck, Cpu, Fuel } from "lucide-react";
import { motion } from "framer-motion";

interface ExecutionStep {
    id: number;
    label: string;
    status: "pending" | "processing" | "completed" | "failed";
}

interface IntentData {
    parsedIntent: string;
    action: string;
    token?: string;
    amount?: string;
    recipient?: string;
    chain?: string;
    steps: ExecutionStep[];
    gasEstimate: string;
    status: "analyzing" | "ready" | "executing" | "completed";
}

interface IntentPanelProps {
    intent: IntentData | null;
    onConfirm: () => void;
    onCancel: () => void;
}

export function IntentPanel({ intent, onConfirm, onCancel }: IntentPanelProps) {
    if (!intent) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#0F0F1A] border-l border-white/5">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 animate-pulse">
                     <Cpu className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Awaiting Command</h3>
                <p className="text-sm text-zinc-500 max-w-[250px]">
                    I'm listening. Try "Send 5 NEAR to [address]" or "Swap USDC for NEAR".
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col border-l border-white/5 bg-[#0F0F1A]">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    Live Context
                </h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Parsed Intent Box */}
                <div className="bg-[#1A1A2E] border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex justify-between items-center">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                            🧠 Parsed Intent
                        </span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-zinc-500">Action</span>
                            <span className="text-sm font-mono text-accent">{intent.action}</span>
                        </div>
                        {intent.token && (
                            <div className="flex justify-between">
                                <span className="text-sm text-zinc-500">Token</span>
                                <span className="text-sm font-mono text-white">{intent.token}</span>
                            </div>
                        )}
                         {intent.amount && (
                            <div className="flex justify-between">
                                <span className="text-sm text-zinc-500">Amount</span>
                                <span className="text-sm font-mono text-white">{intent.amount}</span>
                            </div>
                        )}
                        {intent.recipient && (
                            <div className="flex justify-between">
                                <span className="text-sm text-zinc-500">To</span>
                                <span className="text-sm font-mono text-white truncate max-w-[150px]">{intent.recipient}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Execution Plan */}
                <div className="space-y-3">
                     <div className="flex items-center gap-2 px-1">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                            ⚡ Execution Plan
                        </span>
                     </div>
                    
                    <div className="space-y-0 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/5" />

                        {intent.steps.map((step, index) => (
                            <motion.div 
                                key={step.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex items-center gap-4 group py-2"
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10 shrink-0",
                                    step.status === "completed" ? "bg-[#0A0A0F] border-accent text-accent" :
                                    step.status === "processing" ? "bg-[#0A0A0F] border-accent text-accent shadow-[0_0_10px_-2px_var(--tw-shadow-color)] shadow-accent/50" :
                                    "bg-[#0A0A0F] border-zinc-800 text-zinc-600"
                                )}>
                                    {step.status === "completed" ? <Check className="w-4 h-4" /> : 
                                     step.status === "processing" ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                     <span className="text-xs font-mono">{index + 1}</span>}
                                </div>
                                <div className="flex-1">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        step.status === "completed" ? "text-zinc-300" :
                                        step.status === "processing" ? "text-white" : "text-zinc-500"
                                    )}>
                                        {step.label}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                 {/* Gas Estimate */}
                 <div className="bg-[#1A1A2E] p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Fuel className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Gas Estimate</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <span className="text-zinc-500 text-sm">Network Fee</span>
                         <span className="text-accent font-mono">~{intent.gasEstimate} NEAR</span>
                    </div>
                 </div>

                 {/* Attestation */}
                 <div className="bg-green-900/10 border border-green-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Attestation</span>
                    </div>
                    <p className="text-xs text-green-500/80">Verified Private Execution</p>
                    <p className="text-[10px] font-mono text-green-500/60 mt-1">TEE: 0x7f3a...c91b</p>
                 </div>
            </div>
        </div>
    );
}

