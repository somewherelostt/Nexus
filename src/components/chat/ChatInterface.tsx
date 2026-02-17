"use client";

import React, { useState, useRef, useEffect } from "react";
import { PromptCard } from "@/components/chat/PromptCard";
import { IntentPanel } from "@/components/chat/IntentPanel";
import { NexusButton } from "@/components/ui/NexusButton";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STARTER_PROMPTS = [
    "Send 1 NEAR to alice.near",
    "Swap 5 NEAR for USDC",
    "Check my portfolio balance",
    "Store a file privately in my vault",
    "Buy crypto with credit card",
    "Show my transaction history",
    "What's the price of NEAR?",
    "Deploy a simple token"
];

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
}

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "ai",
            content: "Hello. I am NexusAI. What would you like to execute on NEAR today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showIntents, setShowIntents] = useState(false);
    
    // Mock Intent Data State
    const [currentIntent, setCurrentIntent] = useState<any>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);
        setShowIntents(true); // Open panel on action

        // Simulate AI processing
        setTimeout(() => {
            setIsTyping(false);
            
            // Mock Response Logic
            let aiResponse = "I've analyzed your request.";
            let mockIntent = null;

            if (text.toLowerCase().includes("send")) {
                aiResponse = "I've prepared a transaction to transfer NEAR. Please confirm the details in the panel.";
                mockIntent = {
                    parsedIntent: "Transfer 1.0 NEAR to alice.near",
                    steps: [
                        { id: 1, label: "Validate Recipient (alice.near)", status: "completed" },
                        { id: 2, label: "Check Wallet Balance", status: "completed" },
                        { id: 3, label: "Construct Transaction", status: "ready" },
                        { id: 4, label: "Sign & Broadcast", status: "pending" }
                    ],
                    gasEstimate: "0.00042",
                    status: "ready"
                };
            } else if (text.toLowerCase().includes("swap")) {
                aiResponse = "I've found the best route for your swap on Ref Finance.";
                mockIntent = {
                     parsedIntent: "Swap 5 NEAR for USDC (Ref Finance)",
                     steps: [
                        { id: 1, label: "Fetch Routes (Ref Finance)", status: "completed" },
                        { id: 2, label: "Approve Token Spending", status: "pending" },
                        { id: 3, label: "Execute Swap", status: "pending" }
                    ],
                    gasEstimate: "0.0012",
                    status: "ready"
                };
            } else {
                 aiResponse = "I can help with that. Could you provide more specific details?";
                 setShowIntents(false);
            }

            const newAiMsg: Message = {
                 id: (Date.now() + 1).toString(),
                 role: "ai",
                 content: aiResponse,
                 timestamp: new Date()
            };
            setMessages(prev => [...prev, newAiMsg]);
            setCurrentIntent(mockIntent);

        }, 1500);
    };

    const handleConfirmAction = () => {
        if (!currentIntent) return;
        
        setCurrentIntent((prev: any) => ({ ...prev, status: "executing" }));
        
        setTimeout(() => {
             setCurrentIntent((prev: any) => ({ 
                 ...prev, 
                 status: "completed",
                 steps: prev.steps.map((s: any) => ({ ...s, status: "completed" }))
             }));
             
             setMessages(prev => [...prev, {
                 id: Date.now().toString(),
                 role: "ai",
                 content: "Transaction executed successfully on NEAR Testnet.",
                 timestamp: new Date()
             }]);
        }, 2000);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Chat Area */}
            <div className={cn(
                "flex flex-col h-full transition-all duration-500",
                showIntents ? "w-[65%]" : "w-full max-w-4xl mx-auto"
            )}>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-4 pb-4 custom-scrollbar">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 max-w-[90%]",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                                msg.role === "ai" 
                                    ? "bg-gradient-to-br from-accent to-accent-glow text-white" 
                                    : "bg-secondary border border-white/10 text-muted-foreground"
                            )}>
                                {msg.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            
                            <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                msg.role === "ai" 
                                    ? "bg-secondary/40 border border-white/5 text-white rounded-tl-none" 
                                    : "bg-white/5 border border-white/5 text-white/90 rounded-tr-none"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-4 mr-auto max-w-[90%]">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shrink-0 shadow-lg">
                                 <Bot className="w-5 h-5 text-white" />
                             </div>
                             <div className="bg-secondary/40 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                 <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                 <span className="w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce"></span>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Initial Prompts Grid (only show if few messages) */}
                {messages.length === 1 && !isTyping && (
                    <div className="grid grid-cols-2 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {STARTER_PROMPTS.map((prompt, i) => (
                            <PromptCard 
                                key={i} 
                                prompt={prompt} 
                                onClick={handleSendMessage} 
                                index={i + 1}
                            />
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <div className="mt-4 relative z-20">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-accent-glow rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative flex items-center bg-background rounded-2xl border border-white/10 focus-within:border-accent/50 transition-colors shadow-2xl">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                                placeholder="What do you want to accomplish?"
                                className="flex-1 bg-transparent border-none px-6 py-4 text-white placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
                            />
                            <div className="pr-2">
                                <NexusButton 
                                    size="icon" 
                                    variant="ghost"
                                    onClick={() => handleSendMessage(inputValue)}
                                    disabled={!inputValue.trim()}
                                    className="hover:bg-accent/10"
                                >
                                    {inputValue.trim() ? (
                                        <Send className="w-5 h-5 text-accent" />
                                    ) : (
                                        <Sparkles className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </NexusButton>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                         <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">
                            NexusAI Protocol v1.0 • Testnet
                         </span>
                    </div>
                </div>
            </div>

            {/* Intent Panel (Right Side) */}
            <AnimatePresence>
                {showIntents && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "35%" }}
                        exit={{ opacity: 0, x: 20, width: 0 }}
                        className="h-full rounded-2xl overflow-hidden shadow-2xl border border-white/5"
                    >
                        <IntentPanel 
                            intent={currentIntent} 
                            onConfirm={handleConfirmAction}
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
