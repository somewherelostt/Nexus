"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// Removed missing Select component import
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 

import { ArrowRight, Wallet, Check, ExternalLink } from "lucide-react";

export function QuickSend() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [showConfirm, setShowConfirm] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleSend = () => {
    setShowConfirm(true);
  };

  const confirmTransaction = async () => {
    // Mock Transaction Logic
    // In a real implementation with HOT KIT, this would call the wallet adapter
    setTimeout(() => {
        setTxHash("9x8y7z...mockhash");
    }, 1500);
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
            placeholder="bob.testnet" 
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
                    placeholder="0.00" 
                    className="bg-zinc-950 border-zinc-800 focus:border-orange-500/50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
             </div>
             <div className="space-y-2">
                <label className="text-sm text-zinc-400">Token</label>
                {/* Fallback Select using standard HTML element */}
                <select 
                    className="w-full h-10 px-3 rounded-md border border-zinc-800 bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 text-white"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                >
                    <option value="USDC">USDC (NEAR)</option>
                    <option value="NEAR">NEAR</option>
                    <option value="USDT">USDT</option>
                    <option value="ETH">ETH (Aurora)</option>
                </select>
             </div>
        </div>

        <div className="pt-2">
            <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium h-12"
                onClick={handleSend}
            >
                Preview Transaction <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>

        {/* Confirmation Modal */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
            <DialogContent className="bg-black border-zinc-800 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Transaction</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Please review the details before confirming.
                    </DialogDescription>
                </DialogHeader>
                
                {!txHash ? (
                    <div className="space-y-4 py-4">
                        <div className="bg-zinc-900/50 rounded-lg p-4 space-y-3 border border-zinc-800/50">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Action</span>
                                <span className="text-orange-400 font-medium">Send {token}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">To</span>
                                <span className="text-white font-mono">{recipient || "bob.testnet"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Amount</span>
                                <span className="text-2xl font-bold text-white">{amount || "10"} <span className="text-sm text-zinc-400 font-normal">{token}</span></span>
                            </div>
                            <div className="h-px bg-zinc-800 my-2" />
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Network</span>
                                <span className="text-white">NEAR Testnet</span>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500">Est. Gas</span>
                                <span className="text-green-400">~0.00025 NEAR</span>
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
                            href={`https://testnet.nearblocks.io/txns/${txHash}`} 
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
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white"
                                onClick={confirmTransaction}
                            >
                                Confirm Transfer
                            </Button>
                        </>
                    )}
                    {txHash && (
                         <Button 
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                                onClick={() => { setShowConfirm(false); setTxHash(""); }}
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
