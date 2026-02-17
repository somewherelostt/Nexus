"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, Sparkles, ArrowRight, UserPlus, CreditCard, ExternalLink, HelpCircle, CheckCircle2 } from "lucide-react";

export function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [walletCreated, setWalletCreated] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if user has already onboarded
    const hasOnboarded = localStorage.getItem("nearai_onboarded");
    if (!hasOnboarded) {
      setIsOpen(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("nearai_onboarded", "true");
    setIsOpen(false);
    // Redirect or trigger welcome message logic here
    window.location.href = "/";
  };

  const skipToConnect = () => setStep(3);
  const goToCreate = () => setStep(2);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl relative">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500" 
                    style={{ width: `${(step / 3) * 100}%` }}
                />
            </div>

            <div className="p-8">
                {/* Step Indicators */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div 
                            key={s} 
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${s === step ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-zinc-800'}`} 
                        />
                    ))}
                </div>

              {/* Step 1: Welcome */}
              {step === 1 && (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse blur-xl"></div>
                         <Sparkles className="w-24 h-24 text-blue-400 relative z-10" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome to NexusAI</h2>
                    <h3 className="text-xl text-zinc-300">Your AI for the Decentralized Web</h3>
                    <p className="text-zinc-500 mt-2 max-w-md mx-auto">
                      No crypto experience needed. Just type what you want to do.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div 
                        className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 hover:border-blue-500/50 cursor-pointer transition-all group text-left"
                        onClick={goToCreate}
                    >
                        <div className="bg-blue-900/20 w-10 h-10 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <h4 className="font-semibold text-white">I'm New to Crypto</h4>
                        <p className="text-sm text-zinc-500 mt-1">Create a wallet easily with email or Google.</p>
                    </div>

                    <div 
                        className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 hover:border-purple-500/50 cursor-pointer transition-all group text-left"
                        onClick={skipToConnect}
                    >
                        <div className="bg-purple-900/20 w-10 h-10 rounded-lg flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                            <Wallet className="w-5 h-5" />
                        </div>
                         <h4 className="font-semibold text-white">I Have a Wallet</h4>
                         <p className="text-sm text-zinc-500 mt-1">Connect your existing NEAR wallet to start.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Create Wallet */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Create Your NEAR Wallet</h2>
                    <p className="text-zinc-400 max-w-lg mx-auto">
                        NEAR is a fast, low-cost blockchain. Think of your wallet as your secure account for the decentralized web.
                    </p>
                  </div>

                  <div className="space-y-3 max-w-md mx-auto">
                    <Button 
                        variant="outline" 
                        className="w-full h-14 justify-start px-6 text-zinc-200 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                        onClick={() => {
                            // Simulate finding user
                            setTimeout(() => setStep(3), 500); 
                        }}
                    >
                        <CreditCard className="w-5 h-5 mr-3 text-zinc-400" />
                        Create with Email / Google (FastAuth)
                    </Button>
                    
                     <div className="flex items-center gap-2 justify-center my-4">
                        <div className="h-px bg-zinc-800 flex-1"></div>
                        <span className="text-xs text-zinc-600 uppercase">Or</span>
                        <div className="h-px bg-zinc-800 flex-1"></div>
                     </div>

                     <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-lg flex gap-3 text-sm text-blue-200">
                        <HelpCircle className="w-5 h-5 shrink-0" />
                        <div>
                            <p className="font-medium">Setup Notice</p>
                            <p className="opacity-80">We'll automatically set you up on <strong>NEAR Testnet</strong> and give you free test tokens to practice with.</p>
                        </div>
                     </div>
                  </div>

                  <div className="text-center pt-4">
                     <button 
                        className="text-sm text-zinc-500 hover:text-zinc-300 underline"
                        onClick={skipToConnect}
                    >
                        I already have a wallet
                     </button>
                  </div>
                </div>
              )}

              {/* Step 3: Connect & Start */}
              {step === 3 && (
                <div className="space-y-6 text-center">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Connect & Start</h2>
                    <p className="text-zinc-400">
                        Connect your wallet to enable NexusAI's capabilities.
                    </p>
                  </div>

                  {!isConnected ? (
                     <div className="max-w-xs mx-auto space-y-4">
                        <Button 
                            className="w-full h-16 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-medium shadow-lg shadow-purple-900/20"
                            onClick={() => {
                                setIsConnecting(true);
                                // Simulate connection
                                setTimeout(() => {
                                    setIsConnecting(false);
                                    setIsConnected(true);
                                }, 1500);
                            }}
                            disabled={isConnecting}
                        >
                            {isConnecting ? (
                                <span className="flex items-center gap-2">Connecting... <span className="animate-spin">⏳</span></span>
                            ) : (
                                <span className="flex items-center gap-2"><Wallet className="w-5 h-5" /> Connect Wallet</span>
                            )}
                        </Button>

                        <div className="grid grid-cols-4 gap-2 opacity-50 px-4">
                            {/* Icons representing wallets - placeholders */}
                            <div className="h-8 bg-zinc-800 rounded flex items-center justify-center p-1" title="MyNearWallet">MNW</div>
                            <div className="h-8 bg-zinc-800 rounded flex items-center justify-center p-1" title="Meteor">☄️</div>
                            <div className="h-8 bg-zinc-800 rounded flex items-center justify-center p-1" title="HERE">Here</div>
                            <div className="h-8 bg-zinc-800 rounded flex items-center justify-center p-1" title="Ledger">🛡️</div>
                        </div>

                        <div className="pt-4">
                            <a 
                                href="https://near-faucet.io/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300"
                            > 
                                Need test tokens? Get Test NEAR <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                        </div>
                     </div>
                  ) : (
                    <div className="py-8 animate-in zoom-in duration-300">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-green-500/30">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white">Wallet Connected!</h3>
                                <p className="text-zinc-400 font-mono bg-zinc-950 px-3 py-1 rounded border border-zinc-800 text-sm">
                                    yourname.testnet
                                </p>
                            </div>
                            
                            <div className="bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-700 mt-2">
                                <span className="text-zinc-400 text-sm">Balance:</span> <span className="text-white font-bold ml-1">10.5 NEAR</span>
                            </div>

                            <Button 
                                className="mt-6 w-full max-w-xs bg-white text-black hover:bg-zinc-200 h-12 font-medium"
                                onClick={handleComplete}
                            >
                                Start Using NexusAI <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
