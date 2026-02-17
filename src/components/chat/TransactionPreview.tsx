"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, Check, ExternalLink, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { NEAR_EXPLORER_URL } from "@/config/near";

interface TransactionPreviewProps {
  action: string;
  token: string;
  amount: string;
  recipient?: string;
  network: string;
  gas: string;
  onConfirm: () => Promise<string | void>;
  onCancel: () => void;
}

export function TransactionPreview({
  action,
  token,
  amount,
  recipient,
  network,
  gas,
  onConfirm,
  onCancel,
}: TransactionPreviewProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setConfirmed(true);
    setError("");
    try {
      const hash = await onConfirm();
      if (hash && typeof hash === "string") setTxHash(hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed.");
    } finally {
      setConfirmed(false);
    }
  };

  return (
    <Card className="max-w-sm w-full rounded-sm border border-white/[0.08] bg-[var(--origin-surface)] overflow-hidden hover:border-white/[0.12]">
      {!txHash ? (
        <>
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#A855F7]" />
              <span className="font-mono text-xs uppercase tracking-widest text-white/90">
                Simulating Transaction
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
              {network}
            </span>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 uppercase tracking-wide">Amount</span>
              <span className="font-mono text-base text-white token-amount">
                {amount} <span className="text-white/50 font-mono text-sm">{token}</span>
              </span>
            </div>
            {recipient && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-white/50 uppercase tracking-wide shrink-0">To</span>
                <span className="font-mono text-xs text-white/80 break-all text-right">{recipient}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 uppercase tracking-wide">Est. Gas</span>
              <span className="font-mono text-sm gas-amount text-[#A855F7]">{gas}</span>
            </div>
          </div>

          {error && (
            <p className="px-4 pb-2 text-xs text-red-400 font-mono">{error}</p>
          )}

          <div className="flex gap-2 px-4 pb-4">
            <button
              type="button"
              className="flex-1 font-mono text-xs uppercase tracking-widest h-9 border border-white/10 text-white/70 hover:text-white hover:border-white/20 rounded-sm transition-colors"
              onClick={onCancel}
              disabled={confirmed}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex-1 font-mono text-xs uppercase tracking-widest h-9 border border-[#A855F7]/50 bg-[#A855F7]/10 text-[#A855F7] hover:shadow-[0_2px_0_0_rgba(168,85,247,0.4)] rounded-sm transition-all disabled:opacity-50 inline-flex items-center justify-center gap-1"
              onClick={handleConfirm}
              disabled={confirmed}
            >
              {confirmed ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Signing...
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-6 px-4">
          <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-sm flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <Check className="w-5 h-5" />
          </div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-2">
            Transaction Sent
          </h4>
          <a
            href={`${NEAR_EXPLORER_URL}/txns/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-[#A855F7] hover:underline inline-flex items-center justify-center gap-1"
          >
            View on Explorer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </Card>
  );
}
