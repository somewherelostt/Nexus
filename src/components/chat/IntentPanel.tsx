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
            <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[var(--origin-background)] border-l border-white/[0.06]">
                <div className="w-14 h-14 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center mb-4">
                    <Cpu className="w-7 h-7 text-white/20" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Awaiting Command</h3>
                <p className="font-mono text-xs text-white/50 max-w-[250px]">
                    Try &quot;Send 5 NEAR to [address]&quot; or &quot;Swap USDC for NEAR&quot;.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col border-l border-white/[0.06] bg-[var(--origin-background)]">
            <div className="p-4 border-b border-white/5">
                <h2 className="font-mono text-xs uppercase tracking-widest text-white/90 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#A855F7]" />
                    Live Context
                </h2>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="bg-[var(--origin-surface)] border border-white/[0.08] rounded-sm overflow-hidden">
                    <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-white/50">
                        <span>🧠 Parsed Intent</span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs text-white/50">Action</span>
                            <span className="text-xs font-mono text-[#A855F7]">{intent.action}</span>
                        </div>
                        {intent.token && (
                            <div className="flex justify-between">
                                <span className="text-xs text-white/50">Token</span>
                                <span className="text-xs font-mono text-white token-amount">{intent.token}</span>
                            </div>
                        )}
                        {intent.amount && (
                            <div className="flex justify-between">
                                <span className="text-xs text-white/50">Amount</span>
                                <span className="text-xs font-mono text-white token-amount">{intent.amount}</span>
                            </div>
                        )}
                        {intent.recipient && (
                            <div className="flex justify-between">
                                <span className="text-xs text-white/50">To</span>
                                <span className="text-xs font-mono text-white truncate max-w-[150px]">{intent.recipient}</span>
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

                 <div className="bg-[var(--origin-surface)] p-4 rounded-sm border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                        <Fuel className="w-4 h-4 text-white/40" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">Gas Estimate</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-white/50">Network Fee</span>
                        <span className="font-mono text-sm gas-amount text-[#A855F7]">~{intent.gasEstimate} NEAR</span>
                    </div>
                 </div>

                 <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">Attestation</span>
                    </div>
                    <p className="text-xs text-emerald-400/80">Verified Private Execution</p>
                    <p className="text-[10px] font-mono text-emerald-400/60 mt-1">TEE: 0x7f3a...c91b</p>
                 </div>
            </div>
        </div>
    );
}

