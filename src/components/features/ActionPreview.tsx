"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NexusButton } from "@/components/ui/NexusButton";
import { ArrowRight, Activity, ShieldAlert, Bot } from "lucide-react";

export interface ActionPlan {
  id: string;
  type: "TRANSFER" | "SWAP" | "STAKE" | "DEPLOY_AGENT" | "AGENT_ACTION";
  params: any; // Using any for flexibility in this demo, or define a union type
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

  const renderParams = () => {
      if (plan.type === "DEPLOY_AGENT") {
          return (
              <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent Name</span>
                      <span className="font-mono">{plan.params.name}</span>
                  </div>
                   <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent Type</span>
                      <span className="font-mono">{plan.params.type}</span>
                  </div>
              </div>
          );
      }
      if (plan.type === "AGENT_ACTION") {
          return (
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent ID</span>
                      <span className="font-mono">{plan.params.agentId}</span>
                  </div>
                   <div className="flex justify-between">
                      <span className="text-muted-foreground">Action</span>
                      <span className="font-bold text-accent">{plan.params.action}</span>
                  </div>
                  <div className="text-xs text-muted-foreground italic mt-1">
                      {plan.params.details}
                  </div>
              </div>
          );
      }
      
      // Default / Existing
      return (
         <>
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
                 <span className="uppercase tracking-widest text-foreground">{plan.params.chain || "NEAR"}</span>
            </div>
         </>
      );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background border-accent/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-accent">
            {plan.type.includes("AGENT") ? <Bot className="w-5 h-5"/> : <ShieldAlert className="w-5 h-5" />}
            Confirm Execution
          </DialogTitle>
          <DialogDescription>
            Please review the intent parsed from your request. This action is irreversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2 p-4 border border-white/10 rounded-xl bg-black/40 backdrop-blur-md">
            <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-white/5 pb-2 mb-2">
                <span>Action Type</span>
                <span className="font-mono text-foreground font-bold tracking-wider">{plan.type}</span>
            </div>
            
            {renderParams()}

             <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-white/5">
                 <span className="text-muted-foreground">Est. Gas</span>
                 <span className="text-accent font-mono">{plan.gasEstimate}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <NexusButton variant="secondary" onClick={onReject}>
            Reject
          </NexusButton>
          <NexusButton variant="primary" onClick={onConfirm} className="gap-2 shadow-nexus-glow-sm">
            <Activity className="w-4 h-4" />
            {plan.type.includes("DEPLOY") ? "Deploy Agent" : "Sign & Execute"}
          </NexusButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
