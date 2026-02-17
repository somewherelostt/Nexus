"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Clock, History } from "lucide-react";

const HISTORY_DATA = [
    {
        id: 1,
        type: "sent",
        address: "alice.testnet",
        amount: "5 NEAR",
        time: "10 mins ago",
        status: "Confirmed",
        txHash: "ABC...123"
    },
    {
        id: 2,
        type: "received",
        address: "bob.testnet",
        amount: "20 USDC",
        time: "2 hours ago",
        status: "Confirmed",
        txHash: "DEF...456"
    },
    {
        id: 3,
        type: "sent",
        address: "exchange.near",
        amount: "150 NEAR",
        time: "1 day ago",
        status: "Confirmed",
        txHash: "GHI...789"
    },
    {
        id: 4,
        type: "received",
        address: "client.near",
        amount: "500 USDC",
        time: "2 days ago",
        status: "Pending",
        txHash: "JKL...012"
    }
];

export function PaymentHistory() {
  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white h-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
             <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg"><History className="w-5 h-5" /></span>
             Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {HISTORY_DATA.map((tx) => (
                <a 
                    key={tx.id} 
                    href={`https://testnet.nearblocks.io/txns/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group border border-transparent hover:border-zinc-800"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'sent' ? 'bg-orange-900/20 text-orange-500' : 'bg-green-900/20 text-green-500'}`}>
                            {tx.type === 'sent' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                        </div>
                        <div>
                            <div className="font-medium text-zinc-200 group-hover:text-white transition-colors">{tx.address}</div>
                            <div className="text-xs text-zinc-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {tx.time}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`font-bold ${tx.type === 'sent' ? 'text-zinc-200' : 'text-green-400'}`}>
                            {tx.type === 'sent' ? '-' : '+'}{tx.amount}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === 'Confirmed' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                            {tx.status}
                        </span>
                    </div>
                </a>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
