"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { NexusButton } from "@/components/ui/NexusButton";
import { Trash2, Download, Lock, FileKey } from "lucide-react";

interface EncryptedBlock {
  id: string;
  hash: string;
  timestamp: string;
  size: string;
}

export function MemoryVault() {
  const [blocks, setBlocks] = useState<EncryptedBlock[]>([
    { id: "1", hash: "0x7f...3a2b", timestamp: "2024-05-10 14:23", size: "2.4kb" },
    { id: "2", hash: "0x9c...8b1a", timestamp: "2024-05-11 09:12", size: "1.8kb" },
    { id: "3", hash: "0x4d...e2f9", timestamp: "2024-05-12 16:45", size: "3.2kb" },
  ]);

  const handleDelete = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
        <div>
           <div className="flex items-center gap-2 text-accent mb-1">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-widest">Secure Storage</span>
           </div>
           <h2 className="text-2xl font-medium tracking-tight">Memory Vault</h2>
        </div>
        <div className="text-right">
           <div className="text-xs text-muted-foreground font-mono">ENCRYPTION: AES-256-GCM</div>
           <div className="text-xs text-muted-foreground font-mono">STATUS: LOCKED</div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-12 px-6 py-2 text-xs font-mono text-muted-foreground/50 uppercase tracking-wider">
           <div className="col-span-4">Block Hash</div>
           <div className="col-span-4">Timestamp</div>
           <div className="col-span-2">Size</div>
           <div className="col-span-2 text-right">Action</div>
        </div>
        
        <AnimatePresence mode="popLayout">
          {blocks.map((block) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className="group relative"
            >
              <div className="grid grid-cols-12 items-center px-6 py-4 rounded-lg bg-card border border-white/5 group-hover:bg-white/[0.02] group-hover:border-white/10 transition-colors">
                <div className="col-span-4 font-mono text-sm text-foreground/80 flex items-center gap-3">
                   <FileKey className="w-4 h-4 text-accent/50" />
                   {block.hash}
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">
                   {block.timestamp}
                </div>
                <div className="col-span-2 text-sm text-muted-foreground font-mono">
                   {block.size}
                </div>
                <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-2 hover:text-foreground text-muted-foreground transition-colors">
                      <Download className="w-4 h-4" />
                   </button>
                   <button 
                      onClick={() => handleDelete(block.id)}
                      className="p-2 hover:text-destructive text-muted-foreground transition-colors"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {blocks.length === 0 && (
           <div className="py-20 text-center text-muted-foreground/30 font-mono text-sm border border-dashed border-white/5 rounded-lg">
              NO ENCRYPTED BLOCKS FOUND
           </div>
        )}
      </div>
      
      <div className="mt-8 flex justify-end">
         <NexusButton variant="destructive" className="border-destructive/20 hover:border-destructive/50 bg-transparent">
            Purge All Memory
         </NexusButton>
      </div>
    </div>
  );
}
