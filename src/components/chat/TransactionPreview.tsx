"use client";

import { Card } from "@/components/ui/card";
import { Check, ExternalLink, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { NEAR_EXPLORER_URL } from "@/config/near";

const isPlaceholderRecipient = (r?: string) =>
  !r || r === "[address]" || /^\[.+\]$/.test(r.trim());

interface TransactionPreviewProps {
  action: string;
  token: string;
  amount: string;
  recipient?: string;
  network: string;
  gas: string;
  onConfirm: (recipientOverride?: string, amountOverride?: string) => Promise<string | void>;
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
  const needsRecipient = isPlaceholderRecipient(recipient);
  const [recipientInput, setRecipientInput] = useState("");
  const [amountInput, setAmountInput] = useState(amount);

  const resolvedRecipient = needsRecipient ? recipientInput.trim() : (recipient ?? "");
  const resolvedAmount = amountInput.trim();
  const amountValid = resolvedAmount.length > 0 && !Number.isNaN(parseFloat(resolvedAmount)) && parseFloat(resolvedAmount) > 0;
  const canConfirm = amountValid && (!needsRecipient || resolvedRecipient.length > 0);

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setConfirmed(true);
    setError("");
    try {
      const hash = await onConfirm(
        needsRecipient ? resolvedRecipient : undefined,
        resolvedAmount ? resolvedAmount : undefined
      );
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
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 uppercase tracking-wide block">
                Amount
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="decimal"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0"
                  className="flex-1 font-mono text-base px-3 py-2 rounded-sm border border-white/10 bg-[#0A0A0A] text-white placeholder:text-white/40 focus:outline-none focus:border-[#A855F7]/50 token-amount"
                />
                <span className="font-mono text-sm text-white/50 shrink-0">{token}</span>
              </div>
            </div>
            {needsRecipient ? (
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 uppercase tracking-wide block">
                  To (recipient address)
                </label>
                <input
                  type="text"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  placeholder="e.g. account.near or account.testnet"
                  className="w-full font-mono text-sm px-3 py-2 rounded-sm border border-white/10 bg-[#0A0A0A] text-white placeholder:text-white/40 focus:outline-none focus:border-[#A855F7]/50"
                />
              </div>
            ) : recipient ? (
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-white/50 uppercase tracking-wide shrink-0">To</span>
                <span className="font-mono text-xs text-white/80 break-all text-right">{recipient}</span>
              </div>
            ) : null}
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/50 uppercase tracking-wide">Est. Gas</span>
              <span className="font-mono text-sm gas-amount text-[#A855F7]">{gas}</span>
            </div>
          </div>

          <p className="px-4 font-mono text-[10px] text-white/40">
            Confirm here. Your wallet will then ask you to sign.
          </p>

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
              className="flex-1 font-mono text-xs uppercase tracking-widest h-9 border border-[#A855F7]/50 bg-[#A855F7]/10 text-[#A855F7] hover:shadow-[0_2px_0_0_rgba(168,85,247,0.4)] rounded-sm transition-all disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-1"
              onClick={handleConfirm}
              disabled={confirmed || !canConfirm}
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
