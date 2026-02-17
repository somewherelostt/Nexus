"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { NEAR_EXPLORER_URL } from "@/config/near";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ArrowRight, Wallet, Check, ExternalLink, Loader2 } from "lucide-react";

const GAS_ESTIMATE_NEAR = "0.00025";

export function QuickSend() {
  const { selector, accountId } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("NEAR");
  const [showConfirm, setShowConfirm] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    setError("");
    setTxHash("");
    if (!recipient.trim()) {
      setError("Enter recipient address.");
      return;
    }
    const amt = parseFloat(amount || "0");
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (token !== "NEAR") {
      setError("Only NEAR native transfer is supported here. For USDC/other use HOT Pay API or swap.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmTransaction = async () => {
    if (!selector || !recipient.trim()) return;
    const amt = parseFloat(amount || "0");
    if (isNaN(amt) || amt <= 0) return;
    setSending(true);
    setError("");
    try {
      const wallet = await selector.wallet();
      const amountYocto = BigInt(Math.floor(amt * 1e24)).toString();
      const result = await wallet.signAndSendTransaction({
        receiverId: recipient.trim(),
        actions: [
          {
            type: "Transfer",
            params: { deposit: amountYocto },
          },
        ],
      });
      const hash =
        (result as { transaction?: { hash?: string } })?.transaction?.hash ??
        (result as { transaction_outcome?: { id?: string } })?.transaction_outcome?.id ??
        (result as { receipts_outcome?: { id?: string }[] })?.receipts_outcome?.[0]?.id ??
        "";
      setTxHash(hash);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Transaction failed.";
      setError(message);
    } finally {
      setSending(false);
    }
  };


  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Wallet className="w-24 h-24" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <span className="bg-orange-500/20 text-orange-400 p-2 rounded-lg"><Wallet className="w-5 h-5" /></span>
          Quick Send (HOT Pay)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Recipient Address</label>
          <Input
            placeholder="e.g. account.near or account.testnet"
            className="bg-zinc-950 border-zinc-800 focus:border-orange-500/50"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Amount</label>
            <Input
              type="number"
              step="any"
              placeholder="0.00"
              className="bg-zinc-950 border-zinc-800 focus:border-orange-500/50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Token</label>
            <select
              className="w-full h-10 px-3 rounded-md border border-zinc-800 bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 text-white"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            >
              <option value="NEAR">NEAR</option>
              <option value="USDC">USDC (NEAR)</option>
              <option value="USDT">USDT</option>
              <option value="ETH">ETH (Aurora)</option>
            </select>
          </div>
        </div>

        {!accountId && (
          <p className="text-sm text-amber-400">Connect your NEAR wallet to send.</p>
        )}

        <div className="pt-2">
          <Button
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium h-12"
            onClick={handleSend}
            disabled={!accountId}
          >
            Preview Transaction <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="bg-black border-zinc-800 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Transaction</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Please review the details before confirming.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="rounded-lg p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {!txHash ? (
              <div className="space-y-4 py-4">
                <div className="bg-zinc-900/50 rounded-lg p-4 space-y-3 border border-zinc-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Action</span>
                    <span className="text-orange-400 font-medium">Send {token}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">To</span>
                    <span className="text-white font-mono break-all">{recipient || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Amount</span>
                    <span className="text-2xl font-bold text-white">{amount || "0"} <span className="text-sm text-zinc-400 font-normal">{token}</span></span>
                  </div>
                  <div className="h-px bg-zinc-800 my-2" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Network</span>
                    <span className="text-white">NEAR Testnet</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Est. Gas</span>
                    <span className="text-green-400">~{GAS_ESTIMATE_NEAR} NEAR</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 animate-pulse">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Transaction Sent</h3>
                  <p className="text-zinc-400 text-sm mt-1">Your transaction has been submitted.</p>
                </div>
                <a
                  href={`${NEAR_EXPLORER_URL}/txns/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1 mt-2"
                >
                  View on Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <DialogFooter className="sm:justify-between gap-2">
              {!txHash && (
                <>
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white"
                    onClick={() => { setShowConfirm(false); setError(""); }}
                    disabled={sending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white"
                    onClick={confirmTransaction}
                    disabled={sending || token !== "NEAR"}
                  >
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing...</> : "Confirm Transfer"}
                  </Button>
                </>
              )}
              {txHash && (
                <Button
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                  onClick={() => { setShowConfirm(false); setTxHash(""); setError(""); }}
                >
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
