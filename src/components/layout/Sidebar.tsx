"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Home, 
    Briefcase, 
    Shield, 
    CreditCard, 
    Activity, 
    Zap, 
    Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import { truncateAddress } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Portfolio", href: "/portfolio", icon: Briefcase },
    { label: "Vault", href: "/vault", icon: Shield },
    { label: "Payments", href: "/payments", icon: CreditCard },
    { label: "Activity", href: "/activity", icon: Activity },
    { label: "Points", href: "/points", icon: Zap },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { accountId } = useWallet();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-background/95 backdrop-blur-xl z-40 flex flex-col">
            {/* Logo Area */}
            <div className="p-6 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-nexus-glow-sm">
                        <span className="font-bold text-white text-lg">N</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        Nexus<span className="text-accent">AI</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive 
                                    ? "bg-white/5 text-white shadow-[0_0_15px_rgba(108,92,231,0.1)] border border-white/5" 
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn(
                                "w-4 h-4 transition-colors",
                                isActive ? "text-accent" : "text-muted-foreground group-hover:text-white"
                            )} />
                            {item.label}
                            {isActive && (
                                <div className="ml-auto w-1 h-1 rounded-full bg-accent shadow-[0_0_5px_#6C5CE7]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            {accountId && (
                 <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent-glow p-[1px]">
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-glow">
                                    {accountId.substring(0, 1).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-medium text-white truncate">
                                {accountId}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                Connected
                            </span>
                        </div>
                    </div>
                 </div>
            )}
        </aside>
    );
}
