"use client";

import { useWallet } from "@/context/WalletContext";
import { truncateAddress } from "@/lib/utils";
import { NEAR_EXPLORER_URL } from "@/config/near";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, ExternalLink, Copy, LogOut, Check } from "lucide-react";

export function WalletBadge() {
  const { accountId, balance, signOut } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!accountId) return;
    await navigator.clipboard.writeText(accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(false);
    await signOut();
  };

  if (!accountId) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-4 bg-secondary/50 border border-white/5 rounded-full pl-4 pr-2 py-1.5 h-10 backdrop-blur-sm hover:border-white/10 hover:bg-secondary/70 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 focus:ring-offset-2 focus:ring-offset-background"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Wallet menu"
      >
        {/* Balance */}
        <span className="text-sm font-medium text-white/90">
          {balance != null ? Number(balance).toFixed(2) : "0"} NEAR
        </span>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* Network */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Testnet</span>
        </div>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* Address + Chevron */}
        <span className="text-sm text-muted-foreground font-mono">
          {truncateAddress(accountId, 6)}
        </span>
        <span className={`p-1.5 rounded-full transition-transform ${open ? "rotate-180" : ""}`}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#0F0F1A] shadow-xl shadow-black/30 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
        >
          <a
            href={`${NEAR_EXPLORER_URL}/address/${accountId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground" />
            View on Explorer
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
            role="menuitem"
          >
            {copied ? (
              <Check className="w-4 h-4 shrink-0 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 shrink-0 text-muted-foreground" />
            )}
            {copied ? "Copied!" : "Copy address"}
          </button>
          <div className="my-1 h-px bg-white/5" />
          <button
            type="button"
            onClick={handleDisconnect}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            role="menuitem"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Disconnect wallet
          </button>
        </div>
      )}
    </div>
  );
}
