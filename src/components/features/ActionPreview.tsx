"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, ShieldAlert } from "lucide-react";

export interface ActionPlan {
  id: string;
  type: "TRANSFER" | "SWAP" | "STAKE";
  params: {
    chain: string;
    amount: string;
    token: string;
    to?: string;
  };
  gasEstimate: string;
}

interface ActionPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: ActionPlan | null;
  onConfirm: () => void;
  onReject: () => void;
}

export function ActionPreview({
  open,
  onOpenChange,
  plan,
  onConfirm,
  onReject,
}: ActionPreviewProps) {
  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-accent/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-accent">
            <ShieldAlert className="w-5 h-5" />
            Confirm Execution
          </DialogTitle>
          <DialogDescription>
            Please review the intent parsed from your request. This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2 p-4 border border-border rounded-lg bg-card/50">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Action Type</span>
                <span className="font-mono text-foreground font-bold">{plan.type}</span>
            </div>
            <div className="w-full h-[1px] bg-border/50 my-1" />
            
            <div className="flex items-center gap-2 text-lg font-bold">
                <span className="text-xl">{plan.params.amount} {plan.params.token}</span>
                {plan.params.to && (
                    <>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-mono bg-accent/10 px-2 py-1 rounded text-accent">
                            {plan.params.to.slice(0, 6)}...{plan.params.to.slice(-4)}
                        </span>
                    </>
                )}
            </div>

            <div className="flex justify-between items-center mt-2 text-xs">
                 <span className="text-muted-foreground">Chain</span>
                 <span className="uppercase tracking-widest text-foreground">{plan.params.chain}</span>
            </div>
             <div className="flex justify-between items-center text-xs">
                 <span className="text-muted-foreground">Est. Gas</span>
                 <span className="text-accent">{plan.gasEstimate}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onReject}>
            Reject
          </Button>
          <Button variant="neon" onClick={onConfirm} className="gap-2">
            <Activity className="w-4 h-4" />
            Sign & Execute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
