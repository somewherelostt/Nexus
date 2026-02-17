"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Cpu, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";

import { ActionPreview } from "@/components/features/ActionPreview";
import { AttestationBadge } from "@/components/features/AttestationBadge";
import { useChat } from "@/hooks/useChat";

export function ChatInterface() {
  const { accountId, signIn } = useWallet();
  const { 
      messages, 
      isProcessing, 
      handleSend: onSend, 
      pendingAction, 
      showPreview, 
      setShowPreview, 
      confirmAction, 
      rejectAction 
  } = useChat();
  
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isProcessing]);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    if (!accountId) {
        signIn();
        return;
    }
    await onSend(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[85vh] w-full max-w-4xl mx-auto gap-4">
      <Card className="flex-1 bg-background/60 backdrop-blur-xl border-accent/20 flex flex-col overflow-hidden shadow-2xl shadow-purple-900/10">
        <div className="p-4 border-b border-accent/10 flex justify-between items-center bg-accent/5">
             <div className="flex items-center gap-2 text-accent">
                <Cpu className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-mono tracking-wider">SECURE_ENCLAVE_ACTIVE</span>
             </div>
             <AttestationBadge attestationId="0x9a8f...3d2" />
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-md",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : msg.role === "system"
                      ? "bg-red-500/10 text-red-500 border border-red-500/20 italic"
                      : "bg-muted/50 text-foreground border border-accent/10 rounded-bl-none"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isProcessing && (
                <div className="flex justify-start animate-pulse">
                    <div className="bg-muted/30 text-muted-foreground rounded-2xl px-4 py-3 text-sm border border-accent/5">
                        Processing secure inference...
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <ActionPreview 
            open={showPreview} 
            onOpenChange={setShowPreview} 
            plan={pendingAction} 
            onConfirm={confirmAction} 
            onReject={rejectAction} 
        />

        <div className="p-4 bg-background/40 border-t border-accent/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={accountId ? "Try 'Send 0.1 ETH to alice.near'..." : "Connect wallet to start..."}
              className="bg-background/50 border-accent/20 focus-visible:ring-accent"
              disabled={isProcessing}
            />
            <Button 
                type="submit" 
                variant="neon" 
                size="icon"
                disabled={(!input.trim() && !!accountId) || isProcessing}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
