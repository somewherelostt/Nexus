"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link as LinkIcon, QrCode } from "lucide-react";

export function AcceptPayments() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_HOT_PAY_LINK_BASE_URL;
    if (!baseUrl) {
      setGeneratedLink("");
      return;
    }
    const uniqueId = Math.random().toString(36).substring(7);
    const link = `${baseUrl.replace(/\/$/, "")}/${uniqueId}?amount=${encodeURIComponent(amount || "0")}&desc=${encodeURIComponent(description)}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <QrCode className="w-24 h-24" />
        </div>
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
           <span className="bg-cyan-500/20 text-cyan-400 p-2 rounded-lg"><LinkIcon className="w-5 h-5" /></span>
           Accept Payments (PingPay)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Description</label>
          <Input 
            placeholder="Web Design Services" 
            className="bg-zinc-950 border-zinc-800 focus:border-cyan-500/50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
            <label className="text-sm text-zinc-400">Amount (USD equivalent)</label>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                <Input 
                    type="number"
                    placeholder="20.00" 
                    className="pl-7 bg-zinc-950 border-zinc-800 focus:border-cyan-500/50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
        </div>

        <div className="flex items-center gap-3 py-2">
             <label className="text-sm text-zinc-400 flex-1">Allow Fiat (Credit Card)</label>
             <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-500">Off</span>
                <div className="w-10 h-5 bg-cyan-900/50 rounded-full relative cursor-pointer border border-cyan-800">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full absolute top-0.5 right-0.5 shadow-sm shadow-cyan-400/50"></div>
                </div>
                <span className="text-xs text-cyan-400 font-medium">On</span>
             </div>
        </div>

        {!process.env.NEXT_PUBLIC_HOT_PAY_LINK_BASE_URL && (
          <p className="text-sm text-amber-400">Set NEXT_PUBLIC_HOT_PAY_LINK_BASE_URL to generate HOT Pay payment links.</p>
        )}
        <Button 
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium h-12"
            onClick={handleGenerateLink}
            disabled={!process.env.NEXT_PUBLIC_HOT_PAY_LINK_BASE_URL}
        >
            Generate Payment Link
        </Button>

        {generatedLink && (
            <div className="mt-6 p-4 bg-zinc-950 rounded-xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-3 rounded-lg">
                        <QRCodeSVG value={generatedLink} size={150} />
                    </div>
                    <div className="w-full">
                        <label className="text-xs text-zinc-500 mb-1 block">Shareable Link</label>
                        <div className="flex items-center gap-2">
                            <Input 
                                value={generatedLink} 
                                readOnly 
                                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-sm h-9"
                            />
                            <Button 
                                size="icon" 
                                variant="outline" 
                                className={`h-9 w-9 border-zinc-800 hover:bg-zinc-800 ${isCopied ? 'text-green-500 border-green-500/50' : 'text-zinc-400'}`}
                                onClick={copyToClipboard}
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
