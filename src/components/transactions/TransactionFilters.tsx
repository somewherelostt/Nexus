"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Download, Search } from "lucide-react";

interface TransactionFiltersProps {
    filter: string;
    setFilter: (filter: string) => void;
}

export function TransactionFilters({ filter, setFilter }: TransactionFiltersProps) {
    const filters = ["All", "Sent", "Received", "Swaps", "Contract Calls"];

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            filter === f 
                            ? "bg-accent/10 text-accent border border-accent/20 shadow-sm shadow-accent/5" 
                            : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input 
                        placeholder="Search by token, address, hash..." 
                        className="pl-9 bg-[#0A0A0F] border-white/10 h-10 rounded-lg focus:border-accent/50 text-sm"
                    />
                 </div>
                 
                 <Button variant="outline" size="icon" className="h-10 w-10 border-white/10 bg-[#0A0A0F] hover:bg-white/5 text-zinc-400">
                    <Calendar className="w-4 h-4" />
                 </Button>

                 <Button variant="ghost" size="sm" className="h-10 text-zinc-400 hover:text-white gap-2 hidden md:flex">
                     <Download className="w-4 h-4" />
                     Export CSV
                 </Button>
            </div>
        </div>
    );
}
