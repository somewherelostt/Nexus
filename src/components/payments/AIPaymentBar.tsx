"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";

export function AIPaymentBar() {
    const [input, setInput] = useState("");

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle AI Command (Mock)
        console.log("Processing AI Command:", input);
        setInput("");
    };

    const PRESETS = [
        "Send 5 NEAR to alice.testnet",
        "Create a $20 payment link",
        "Show incoming payments"
    ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-6">
        <label className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            AI Payment Assistant
        </label>
        
        <form onSubmit={handleCommand} className="flex gap-2">
            <div className="relative flex-1">
                <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask standard intents like 'Send 50 USDC to bob'..."
                    className="bg-black/50 border-zinc-800 text-white pl-4 pr-12 h-12 rounded-lg focus:border-purple-500/50"
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-1 top-1 h-10 w-10 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </form>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
            {PRESETS.map((preset, i) => (
                <button 
                    key={i}
                    onClick={() => setInput(preset)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-zinc-800 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700"
                >
                    {preset}
                </button>
            ))}
        </div>
    </div>
  );
}
