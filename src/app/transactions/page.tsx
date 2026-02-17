import { TransactionTable } from "@/components/transactions/TransactionTable";
import { ArrowUpRight } from "lucide-react";

export default function TransactionsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
                    <p className="text-zinc-400">View and manage your on-chain activity across NEAR Protocol.</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 p-4 rounded-xl flex items-center gap-4">
                    <div className="text-right">
                         <div className="text-xs text-purple-300 font-medium uppercase tracking-wider">Net Worth</div>
                         <div className="text-xl font-bold text-white">$1,240.50</div>
                    </div>
                </div>
            </div>

            <TransactionTable />
        </div>
    );
}
