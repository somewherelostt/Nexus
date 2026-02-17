"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { parseIntentAction } from "@/app/actions/ai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Loader2 } from "lucide-react";

export function AIPaymentBar() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { selector, accountId } = useWallet();

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setStatus("loading");
    setMessage("");
    try {
      const result = await parseIntentAction(text);
      if (!result) {
        setStatus("error");
        setMessage("Could not parse intent. Try: Send 5 NEAR to [address]");
        return;
      }
      if (result.type === "TRANSFER" && (result.params?.chain === "NEAR" || !result.params?.chain)) {
        const to = result.params?.to;
        const amount = result.params?.amount;
        if (!selector || !accountId) {
          setStatus("error");
          setMessage("Connect your NEAR wallet first.");
          return;
        }
        if (!to || !amount) {
          setStatus("error");
          setMessage("Missing recipient or amount in parsed intent.");
          return;
        }
        const amt = parseFloat(String(amount));
        if (isNaN(amt) || amt <= 0) {
          setStatus("error");
          setMessage("Invalid amount.");
          return;
        }
        const wallet = await selector.wallet();
        const amountYocto = BigInt(Math.floor(amt * 1e24)).toString();
        const txResult = await wallet.signAndSendTransaction({
          receiverId: to,
          actions: [{ type: "Transfer", params: { deposit: amountYocto } }],
        });
        const hash = (txResult as { transaction?: { hash?: string } })?.transaction?.hash ?? (txResult as { transaction_outcome?: { id?: string } })?.transaction_outcome?.id ?? "";
        setStatus("success");
        setMessage(hash ? `Sent ${amount} NEAR to ${to}. Tx: ${hash.slice(0, 8)}...` : "Transaction submitted.");
      } else {
        setStatus("success");
        setMessage(`Intent: ${result.type}. For swaps or other actions use the Chat or full Payments flow.`);
      }
      setInput("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const PRESETS = [
    "Send 5 NEAR to [address]",
    "Create a $20 payment link",
    "Show incoming payments",
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mt-6">
      <label className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        AI Payment Assistant
      </label>

      <form onSubmit={handleCommand} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Send 5 NEAR to account.testnet"
            className="bg-black/50 border-zinc-800 text-white pl-4 pr-12 h-12 rounded-lg focus:border-purple-500/50"
            disabled={status === "loading"}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1 h-10 w-10 bg-purple-600 hover:bg-purple-500 text-white rounded-md"
            disabled={status === "loading" || !input.trim()}
          >
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </form>

      {(status === "success" || status === "error") && message && (
        <p className={`mt-2 text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}

      <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
        {PRESETS.map((preset, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInput(preset)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-zinc-800 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700"
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
