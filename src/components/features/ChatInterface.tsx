"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NexusButton } from "@/components/ui/NexusButton";
import { GlowCard } from "@/components/ui/GlowCard";
import { Send, Cpu, Zap, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Nexus Protocol initialized. Secure environment active. How can I assist with your multi-chain execution today?",
      timestamp: Date.now()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've analyzed your request. To proceed, I need to confirm the destination chain and gas parameters.",
        timestamp: Date.now()
      }]);
    }, 1500);
  };

  return (
    <section className="container mx-auto max-w-7xl pt-8 pb-20 px-4 md:px-0 h-[85vh] flex gap-6">
      
      {/* LEFT: Chat Thread */}
      <div className="w-full md:w-[65%] flex flex-col h-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-4 rounded-xl text-sm leading-relaxed",
                  msg.role === "user" 
                    ? "bg-secondary/50 text-foreground rounded-tr-sm border border-white/5" 
                    : "bg-accent/5 text-foreground border border-accent/10 rounded-tl-sm shadow-[0_0_15px_rgba(108,92,231,0.05)]"
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-accent/5 p-4 rounded-xl rounded-tl-sm border border-accent/10 flex gap-2 items-center">
                <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-4 relative">
          <div className="relative rounded-[16px] bg-secondary/30 border border-white/10 focus-within:border-accent/50 focus-within:shadow-nexus-glow-sm transition-all duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Describe your intent..."
              className="w-full bg-transparent p-4 min-h-[60px] max-h-[120px] resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/50"
            />
            <div className="absolute bottom-3 right-3">
              <NexusButton 
                variant="primary" 
                size="icon" 
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-8 w-8 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </NexusButton>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Context Panel */}
      <div className="hidden md:flex w-[35%] flex-col gap-4">
         {/* Status Cards */}
         <GlowCard className="p-5" noHover>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">System Status</h3>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                 <span className="text-xs text-emerald-500 font-mono">ONLINE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col gap-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Compute
                  </div>
                  <span className="text-sm font-mono text-accent">TEE Active</span>
               </div>
               <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col gap-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Security
                  </div>
                  <span className="text-sm font-mono text-accent">Enclave OK</span>
               </div>
            </div>
         </GlowCard>

         {/* Execution Plan (Placeholder) */}
         <div className="flex-1 rounded-[20px] border border-white/10 bg-card/50 p-5 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Execution Context</h3>
            
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground/40 text-sm border border-dashed border-white/10 rounded-xl bg-black/20">
               <Activity className="w-8 h-8 mb-2 opacity-50" />
               Waiting for intent...
            </div>
         </div>
      </div>

    </section>
  );
}
