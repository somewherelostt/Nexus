"use client";

import { Card } from "@/components/ui/card";
import { Lock, FileText, UploadCloud } from "lucide-react";

export function VaultCard() {
    return (
        <Card className="bg-[#0A0A0F] border border-cyan-500/20 max-w-sm w-full p-4 rounded-xl">
             <div className="flex items-center gap-2 mb-4">
                <div className="bg-cyan-500/10 p-2 rounded-lg">
                    <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="font-medium text-white">Nova Vault</h4>
             </div>
             
             <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <span>private_keys.txt</span>
                    <span className="ml-auto text-xs text-zinc-500">24KB</span>
                </div>
                 <div className="flex items-center gap-3 text-sm text-zinc-300">
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <span>contract_v1.rs</span>
                    <span className="ml-auto text-xs text-zinc-500">120KB</span>
                </div>
             </div>
             
             <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-white flex items-center justify-center gap-2 transition-colors">
                <UploadCloud className="w-4 h-4" /> Upload New File
             </button>
             
              <div className="mt-3 text-center">
                 <button className="text-xs text-cyan-400 hover:text-cyan-300">Open Memory Vault &rarr;</button>
             </div>
        </Card>
    );
}
