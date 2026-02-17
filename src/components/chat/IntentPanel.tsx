"use client";

import React from "react";
import { NexusButton } from "@/components/ui/NexusButton";
import { cn } from "@/lib/utils";
import { Check, Loader2, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExecutionStep {
    id: number;
    label: string;
    status: "pending" | "processing" | "completed" | "failed";
}

interface IntentData {
    parsedIntent: string;
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
            <div className="h-full flex flex-col items-center justify-center p-8 text-center border-l border-white/5 bg-secondary/20 backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                     <Zap className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Ready to Assist</h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                    I can help you swap tokens, check portfolio, or interact with NEAR protocols.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col border-l border-white/5 bg-secondary/30 backdrop-blur-md">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    Action Plan
                </h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {/* Parsed Intent */}
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Understanding
                    </span>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white shadow-inner">
                        <p className="text-sm leading-relaxed">
                            {intent.parsedIntent}
                        </p>
                    </div>
                </div>

                {/* Execution Plan */}
                <div className="space-y-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Execution Sequence
                    </span>
                    <div className="space-y-4 relative pl-2">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-white/10" />

                        {intent.steps.map((step, index) => (
                            <motion.div 
                                key={step.id} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative flex items-center gap-4 group"
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border transition-all z-10",
                                    step.status === "completed" ? "bg-accent/20 border-accent/50 text-accent" :
                                    step.status === "processing" ? "bg-accent/10 border-accent text-accent animate-pulse" :
                                    "bg-secondary border-white/10 text-muted-foreground"
                                )}>
                                    {step.status === "completed" ? <Check className="w-4 h-4" /> : 
                                     step.status === "processing" ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                     <span className="text-xs">{index + 1}</span>}
                                </div>
                                <div className={cn(
                                    "flex-1 p-3 rounded-lg border transition-all",
                                    step.status === "processing" ? "bg-accent/5 border-accent/20" : "bg-white/5 border-transparent"
                                )}>
                                    <p className={cn(
                                        "text-sm",
                                        step.status === "completed" ? "text-white/70" :
                                        step.status === "processing" ? "text-white font-medium" : "text-muted-foreground"
                                    )}>
                                        {step.label}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                 {/* Gas Estimate */}
                 <div className="bg-secondary/40 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Est. Network Fee</span>
                    <span className="text-sm font-mono text-accent">~{intent.gasEstimate} NEAR</span>
                 </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-white/5 bg-secondary/50 backdrop-blur-lg">
                <div className="flex gap-3">
                    <NexusButton 
                        variant="secondary" 
                        onClick={onCancel}
                        disabled={intent.status === "executing" || intent.status === "completed"}
                        className="flex-1"
                    >
                        Cancel
                    </NexusButton>
                    <NexusButton 
                        variant="gradient" 
                        onClick={onConfirm}
                        disabled={intent.status !== "ready"}
                        className={cn("flex-[2]", intent.status === "ready" && "animate-pulse-slow")}
                    >
                        {intent.status === "executing" ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Executing...
                            </>
                        ) : intent.status === "completed" ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Done
                            </>
                        ) : (
                            <>
                                Confirm Action <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </NexusButton>
                </div>
            </div>
        </div>
    );
}
