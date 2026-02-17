"use client";

import React, { useState, useRef, useEffect } from "react";
import { PromptCard } from "@/components/chat/PromptCard";
import { IntentPanel } from "@/components/chat/IntentPanel";
import { TransactionPreview } from "@/components/chat/TransactionPreview";
import { PortfolioCard } from "@/components/chat/PortfolioCard";
import { VaultCard } from "@/components/chat/VaultCard";
import { NexusButton } from "@/components/ui/NexusButton";
import { Send, Bot, User, Sparkles, Mic } from "lucide-react";
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

    const makeTxConfirmHandler = (data: { action?: string; amount?: string; recipient?: string; token?: string } | null) => async (): Promise<string | void> => {
        if (!selector || !data?.amount) return;
        const receiverId = data.recipient || (data.action === "SWAP" ? (NEAR_CONTRACT_ID || "wrap.testnet") : undefined);
        if (!receiverId) return;
        const amt = parseFloat(data.amount || "0");
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
        <div className="flex h-[calc(100vh-8rem)] gap-0">
            {/* Chat Area - 70% width when panel open */}
            <div className={cn(
                "flex flex-col h-full transition-all duration-500 bg-[#0F0F1A]",
                showIntents ? "w-[70%]" : "w-full max-w-4xl mx-auto"
            )}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-6 px-8 pt-6 pb-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-3 max-w-[85%]",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            {/* Avatar */}
                            {msg.role === "ai" && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                                     <Bot className="w-5 h-5 text-white" />
                                </div>
                            )}
                            
                            {/* Content */}
                            <div>
                                {msg.type === "text" && (
                                    <div className={cn(
                                        "p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                                        msg.role === "user" 
                                            ? "bg-[#1A1A2E] text-white rounded-tr-sm" 
                                            : "bg-[#1A1A2E] border border-white/5 text-zinc-100 rounded-tl-sm"
                                    )}>
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
                         <div className="flex gap-3 mr-auto max-w-[90%]">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                                 <Bot className="w-5 h-5 text-white" />
                             </div>
                             <div className="bg-[#1A1A2E] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                 <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                 <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-[#0F0F1A]/80 backdrop-blur-md">
                     <div className="max-w-4xl mx-auto relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[28px] opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative flex items-center bg-[#0A0A0F] rounded-[28px] border border-white/10 focus-within:border-indigo-500/50 transition-colors shadow-2xl">
                             <input
                                 type="text"
                                 value={inputValue}
                                 onChange={(e) => setInputValue(e.target.value)}
                                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                                 placeholder={PLACEHOLDERS[currentPlaceholder]}
                                 className="flex-1 bg-transparent border-none px-6 py-4 text-white placeholder:text-zinc-500 focus:ring-0 focus:outline-none h-14"
                             />
                             <div className="pr-2 flex items-center gap-1">
                                <NexusButton size="icon" variant="ghost" className="rounded-full text-zinc-400 hover:text-white hover:bg-white/5">
                                    <Mic className="w-5 h-5" />
                                </NexusButton>
                                <NexusButton 
                                    size="icon" 
                                    className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white w-10 h-10 shadow-lg"
                                    onClick={() => handleSendMessage(inputValue)}
                                    disabled={!inputValue.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </NexusButton>
                             </div>
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
                        className="h-full border-l border-white/5 bg-[#0F0F1A] shadow-2xl relative z-10"
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
