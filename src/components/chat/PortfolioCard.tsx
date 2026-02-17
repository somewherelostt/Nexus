"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export function PortfolioCard() {
    return (
        <Card className="bg-[#0A0A0F] border border-purple-500/20 max-w-sm w-full p-4 rounded-xl">
             <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-sm text-muted-foreground">Total Balance</h4>
                    <div className="text-2xl font-bold text-white">$1,240.50</div>
                </div>
                <div className="bg-purple-500/10 p-2 rounded-lg">
                    <ArrowUpRight className="w-4 h-4 text-purple-400" />
                </div>
             </div>
             
             <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-black rounded-full border border-white/10 flex items-center justify-center text-[10px] text-white">N</div>
                        <span className="text-sm text-white">NEAR</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-white">150.00</div>
                        <div className="text-xs text-muted-foreground">$1,050.00</div>
                    </div>
                </div>
                 <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">U</div>
                        <span className="text-sm text-white">USDC</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-white">190.50</div>
                        <div className="text-xs text-muted-foreground">$190.50</div>
                    </div>
                </div>
             </div>
             
             <div className="mt-4 pt-2 border-t border-white/5 text-center">
                 <button className="text-xs text-purple-400 hover:text-purple-300">Open Full Portfolio &rarr;</button>
             </div>
        </Card>
    );
}
