"use client";

import { ShieldCheck, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttestationBadgeProps {
  attestationId?: string;
  isVerified?: boolean;
}

export function AttestationBadge({ attestationId, isVerified = true }: AttestationBadgeProps) {
  return (
    <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-500",
        isVerified 
            ? "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20" 
            : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
    )}>
        <ShieldCheck className="w-3 h-3" />
        <span>Enclave Verified</span>
        {attestationId && (
            <span className="opacity-50 ml-1 border-l border-current pl-2">
                ID: {attestationId.slice(0, 8)}
            </span>
        )}
    </div>
  );
}
