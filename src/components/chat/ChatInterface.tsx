"use client";

import React, { useState, useRef, useEffect } from "react";
import { PromptCard } from "@/components/chat/PromptCard";
import { IntentPanel } from "@/components/chat/IntentPanel";
import { TransactionPreview } from "@/components/chat/TransactionPreview";
import { PortfolioCard } from "@/components/chat/PortfolioCard";
import { VaultCard } from "@/components/chat/VaultCard";
import { Send, Bot, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { parseIntent } from "@/lib/ai-service";
import { useWallet } from "@/context/WalletContext";
import { NEAR_CONTRACT_ID } from "@/config/near";

const STARTER_PROMPTS = [
    "Send 5 NEAR to [address]",
    "Swap 10 USDC to NEAR",
    "Show my portfolio",
    "Store a file privately",
    "Create a payment link for $50",
    "Get test NEAR"
];

const PLACEHOLDERS = [
    "Send NEAR to a friend...",
    "Swap 10 USDC to NEAR...",
    "Store a file privately...",
    "Create a payment link..."
];

interface Message {
    id: string;
    role: "user" | "ai";
    type?: "text" | "tx_preview" | "portfolio" | "vault";
    content: string; // For text
    data?: any; // For cards
    timestamp: Date;
}

export function ChatInterface() {
    const { selector } = useWallet();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "ai",
            type: "text",
            content: "Hello. I am NexusAI. What would you like to execute on NEAR today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showIntents, setShowIntents] = useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
    const [currentIntent, setCurrentIntent] = useState<any>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Rotate placeholders
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholder((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            type: "text",
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);
        setShowIntents(true); 

        // AI Processing
        const intent = await parseIntent(text);
        
        setTimeout(() => {
            setIsTyping(false);
            
            let aiMsg: Message | null = null;
            let panelIntent = null;

            if (intent.action === "SEND" || intent.action === "SWAP") {
                // SWAP has no recipient from parser; use swap target so Confirm works
                const recipient = intent.action === "SWAP"
                    ? (NEAR_CONTRACT_ID || "wrap.testnet")
                    : intent.recipient;
                const txData = {
                    action: intent.action,
                    token: intent.token,
                    amount: intent.amount,
                    recipient,
                    network: intent.chain,
                    gas: "0.00025 NEAR"
                };
                aiMsg = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    type: "tx_preview",
                    content: "",
                    data: txData,
                    timestamp: new Date()
                };

                panelIntent = {
                    parsedIntent: intent.action === "SEND"
                        ? `Transfer ${intent.amount} ${intent.token} to ${intent.recipient}`
                        : `Swap ${intent.amount} TOKENS for ${intent.token}`,
                    action: intent.action,
                    token: intent.token,
                    amount: intent.amount,
                    recipient,
                    gasEstimate: "0.00025",
                    steps: [
                        { id: 1, label: "Query HOT KIT rates", status: "completed" },
                        { id: 2, label: "Build NEAR Intent", status: "completed" },
                        { id: 3, label: "Sign via WalletConnect", status: "pending" }
                    ],
                    status: "ready"
                };

            } else if (intent.action === "PORTFOLIO") {
                aiMsg = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    type: "portfolio",
                    content: "",
                    timestamp: new Date()
                };
                 panelIntent = {
                    parsedIntent: "Fetch Portfolio Balance",
                    action: "QUERY",
                    steps: [{ id: 1, label: "Fetch Balances", status: "completed" }],
                    gasEstimate: "0",
                    status: "completed"
                };

            } else if (intent.action === "VAULT_UPLOAD") {
                 aiMsg = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    type: "vault",
                    content: "",
                    timestamp: new Date()
                };
                 panelIntent = {
                    parsedIntent: "Access Nova Vault",
                    action: "ACCESS",
                    steps: [{ id: 1, label: "Verify Encryption Key", status: "completed" }],
                    gasEstimate: "0",
                    status: "completed"
                };
            } else {
                 aiMsg = {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    type: "text",
                    content: "I can help with transfers, swaps, portfolio checks, or secure file storage. Could you clarify?",
                    timestamp: new Date()
                };
            }

            if (aiMsg) {
                setMessages(prev => [...prev, aiMsg!]);
            }
            setCurrentIntent(panelIntent);

        }, 1500);
    };

    const makeTxConfirmHandler = (data: { action?: string; amount?: string; recipient?: string; token?: string } | null) => async (recipientOverride?: string, amountOverride?: string): Promise<string | void> => {
        if (!selector) return;
        const receiverId =
            recipientOverride?.trim() ||
            (data?.recipient && data.recipient !== "[address]" && !/^\[.+\]$/.test(data.recipient.trim()) ? data.recipient : undefined) ||
            (data?.action === "SWAP" ? (NEAR_CONTRACT_ID || "wrap.testnet") : undefined);
        if (!receiverId) return;
        const amountStr = amountOverride?.trim() || data?.amount || "0";
        const amt = parseFloat(amountStr);
        if (isNaN(amt) || amt <= 0) return;
        const wallet = await selector.wallet();
        const amountYocto = BigInt(Math.floor(amt * 1e24)).toString();
        const result = await wallet.signAndSendTransaction({
            receiverId,
            actions: [{ type: "Transfer", params: { deposit: amountYocto } }],
        });
        const hash = (result as { transaction?: { hash?: string } })?.transaction?.hash ?? (result as { transaction_outcome?: { id?: string } })?.transaction_outcome?.id ?? (result as { receipts_outcome?: { id?: string }[] })?.receipts_outcome?.[0]?.id ?? "";
        if (currentIntent) {
            setCurrentIntent((prev: any) => ({
                ...prev,
                status: "completed",
                steps: (prev?.steps ?? []).map((s: any) => ({ ...s, status: "completed" })),
            }));
        }
        return hash;
    };

    return (
        <div className="flex flex-1 min-h-0 gap-0 bg-[var(--origin-background)]">
            {/* Chat Area */}
            <div className={cn(
                "flex flex-col min-h-0 flex-1 transition-all duration-500 bg-[var(--origin-background)]",
                showIntents ? "w-[70%]" : "w-full max-w-4xl mx-auto"
            )}>
                {/* Messages - scrollable */}
                <div className="flex-1 min-h-0 overflow-y-auto space-y-6 px-6 pt-6 pb-4">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-3 max-w-[85%] items-start",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            {msg.role === "ai" && (
                                <div className="w-8 h-8 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                                    <Bot className="w-4 h-4 text-[#A855F7]" />
                                </div>
                            )}
                            <div className={cn("min-w-0 flex-1", msg.role === "user" && "flex justify-end")}>
                                {msg.type === "text" && (
                                    <div
                                        className={cn(
                                            "py-2 leading-relaxed",
                                            msg.role === "user"
                                                ? "font-mono text-xs text-white/90 text-right"
                                                : "border-l-2 border-[#A855F7] pl-4 text-sm text-white/85"
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                )}
                                {msg.type === "tx_preview" && msg.data && (
                                    <TransactionPreview
                                        action={msg.data.action}
                                        token={msg.data.token}
                                        amount={msg.data.amount}
                                        recipient={msg.data.recipient}
                                        network={msg.data.network}
                                        gas={msg.data.gas}
                                        onConfirm={makeTxConfirmHandler(msg.data)}
                                        onCancel={() => setCurrentIntent(null)}
                                    />
                                )}
                                {msg.type === "portfolio" && <PortfolioCard />}
                                {msg.type === "vault" && <VaultCard />}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3 mr-auto max-w-[90%] items-center">
                            <div className="w-8 h-8 rounded-sm border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                                <Bot className="w-4 h-4 text-[#A855F7]" />
                            </div>
                            <div className="h-8 flex items-center gap-1 border-l-2 border-[#A855F7] pl-4 min-w-[4rem]">
                                <span className="loader-pulse-bar w-16" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Starter prompts when only welcome message */}
                {messages.length === 1 && (
                    <div className="px-6 pb-3 flex-shrink-0">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Try</p>
                        <div className="flex flex-wrap gap-2">
                            {STARTER_PROMPTS.slice(0, 4).map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => handleSendMessage(prompt)}
                                    className="font-mono text-xs px-3 py-2 rounded-sm border border-white/10 text-white/70 hover:border-[#A855F7]/40 hover:text-white hover:bg-white/5 transition-colors text-left"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* CLI-style Input - always visible at bottom */}
                <div className="flex-shrink-0 p-4 pt-3 border-t border-white/[0.06] bg-[var(--origin-background)]">
                    <label className="sr-only" htmlFor="chat-input">Type your command</label>
                    <div className="max-w-4xl mx-auto flex items-center bg-[#0A0A0A] border border-white/[0.12] rounded-sm focus-within:border-[#A855F7]/50 focus-within:shadow-[0_0_0_1px_rgba(168,85,247,0.3)] transition-all">
                        <span className="pl-4 font-mono text-xs text-white/50 select-none">$</span>
                        <input
                            id="chat-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                            placeholder={PLACEHOLDERS[currentPlaceholder]}
                            className={cn(
                                "flex-1 bg-transparent border-none px-2 py-3.5 text-sm text-white placeholder:text-white/40 focus:ring-0 focus:outline-none font-mono",
                                !inputValue && "caret-blink"
                            )}
                            autoFocus
                        />
                        <div className="pr-2 flex items-center gap-1">
                            <button
                                type="button"
                                className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-sm transition-colors"
                                aria-label="Voice"
                            >
                                <Mic className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                className="font-mono text-xs uppercase tracking-widest h-9 px-3 border border-[#A855F7]/40 text-[#A855F7] hover:shadow-[0_2px_0_0_rgba(168,85,247,0.4)] rounded-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
                                onClick={() => handleSendMessage(inputValue)}
                                disabled={!inputValue.trim()}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Panel - 30% width */}
            <AnimatePresence>
                {showIntents && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "30%" }}
                        exit={{ opacity: 0, x: 20, width: 0 }}
                        className="h-full border-l border-white/[0.06] bg-[var(--origin-background)] relative z-10"
                    >
                        <IntentPanel 
                            intent={currentIntent} 
                            onConfirm={currentIntent?.recipient != null ? makeTxConfirmHandler(currentIntent) : () => {}}
                            onCancel={() => {
                                setShowIntents(false);
                                setCurrentIntent(null);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
