"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, ExternalLink, Zap } from "lucide-react";
import { useState } from "react";

interface TransactionPreviewProps {
    action: string;
    token: string;
    amount: string;
    recipient?: string;
    network: string;
    gas: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function TransactionPreview({ 
    action, 
    token, 
    amount, 
    recipient, 
    network, 
    gas, 
    onConfirm, 
    onCancel 
}: TransactionPreviewProps) {
    const [confirmed, setConfirmed] = useState(false);
    const [mockHash, setMockHash] = useState("");

    const handleConfirm = () => {
        setConfirmed(true);
        setTimeout(() => {
            setMockHash("9x8y7z...mockhash");
            onConfirm();
        }, 1500);
    };

    return (
        <Card className="bg-[#0A0A0F] border border-accent/20 max-w-sm w-full p-4 rounded-xl shadow-[0_0_15px_-5px_var(--tw-shadow-color)] shadow-accent/10">
            {!mockHash ? (
                <>
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                         <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-white">{action}</span>
                         </div>
                         <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">{network}</span>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Amount</span>
                            <span className="text-lg font-bold text-white">{amount} <small className="text-xs font-normal text-muted-foreground">{token}</small></span>
                        </div>
                        {recipient && (
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">To</span>
                                <span className="text-sm font-mono text-zinc-300">{recipient}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Est. Gas</span>
                            <span className="text-sm text-accent">{gas}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1 text-muted-foreground hover:text-white"
                            onClick={onCancel}
                            disabled={confirmed}
                        >
                            Cancel
                        </Button>
                        <Button 
                            size="sm" 
                            className="flex-1 bg-accent hover:bg-accent/80 text-white"
                            onClick={handleConfirm}
                            disabled={confirmed}
                        >
                            {confirmed ? "Signing..." : "Confirm"}
                        </Button>
                    </div>
                </>
            ) : (
                <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-green-500">
                        <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-medium mb-1">Transaction Sent</h4>
                     <a 
                        href={`https://testnet.nearblocks.io/txns/${mockHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent text-xs hover:underline flex items-center justify-center gap-1"
                    >
                        View on Explorer <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            )}
        </Card>
    );
}
