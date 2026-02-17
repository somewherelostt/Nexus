"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface PromptCardProps {
    prompt: string;
    onClick: (prompt: string) => void;
    index?: number;
}

export function PromptCard({ prompt, onClick, index = 0 }: PromptCardProps) {
    return (
        <button
            onClick={() => onClick(prompt)}
            className="group relative flex items-center justify-between p-4 w-full text-left bg-secondary/50 hover:bg-secondary border border-white/5 hover:border-accent/30 rounded-[20px] transition-all duration-300 hover:shadow-nexus-glow-sm overflow-hidden"
        >
            <span className="text-sm text-muted-foreground group-hover:text-white transition-colors line-clamp-2 z-10">
                {prompt}
            </span>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-4 h-4 text-accent" />
            </div>

            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>
    );
}
