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
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";

const NAV_ITEMS = [
  { label: "Home", href: "/chat", icon: Home },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase },
  { label: "Vault", href: "/vault", icon: Shield },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Activity", href: "/transactions", icon: Activity },
  { label: "Points", href: "/points", icon: Zap },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { accountId } = useWallet();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-white/[0.06] bg-[var(--origin-background)] z-40 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-white/[0.06] flex justify-center">
        <Link
          href="/chat"
          className="w-9 h-9 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center hover:border-white/20 transition-colors"
          aria-label="NexusAI Home"
        >
          <span className="text-sm font-semibold text-white">N</span>
        </Link>
      </div>

      {/* Icon nav */}
      <nav className="flex-1 py-4 px-0 flex flex-col items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "w-12 h-10 flex items-center justify-center rounded-sm border border-transparent transition-all",
                isActive
                  ? "bg-white/5 border-white/10 text-[#A855F7]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              )}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {accountId && (
        <div className="p-3 border-t border-white/[0.06] flex justify-center">
          <div
            className="w-8 h-8 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center"
            title={accountId}
          >
            <span className="text-[10px] font-mono font-medium text-white/90">
              {accountId.substring(0, 1).toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
