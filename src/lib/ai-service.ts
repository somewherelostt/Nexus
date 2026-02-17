export interface ParsedIntent {
    action: "SEND" | "SWAP" | "VAULT_UPLOAD" | "PORTFOLIO" | "PAYMENT_LINK" | "UNKNOWN";
    token?: string;
    amount?: string;
    recipient?: string;
    chain?: string;
    description?: string; // For payment links
    file?: string; // For vault
}

export async function parseIntent(text: string): Promise<ParsedIntent> {
    // In a real app, this would call Groq or Cerebras API
    // checking process.env.GROQ_API_KEY or process.env.CEREBRAS_API_KEY
    
    // Mock Logic for Demo
    const lower = text.toLowerCase();
    
    if (lower.includes("send")) {
        // "send 5 NEAR to alice.testnet"
        const amount = lower.match(/(\d+(\.\d+)?)/)?.[0] || "0";
        const token = lower.includes("usdc") ? "USDC" : "NEAR";
        const recipient = lower.match(/to\s+(\S+)/)?.[1] || undefined;
        
        return {
            action: "SEND",
            amount,
            token,
            recipient,
            chain: "NEAR Testnet"
        };
    }
    
    if (lower.includes("swap")) {
        // "swap 10 USDC to NEAR"
        const amount = lower.match(/(\d+(\.\d+)?)/)?.[0] || "0";
        const fromToken = lower.includes("usdc") ? "USDC" : "NEAR";
        // Simplified
        return {
            action: "SWAP",
            amount,
            token: fromToken === "USDC" ? "NEAR" : "USDC", // Target token
            chain: "NEAR Testnet"
        };
    }
    
    if (lower.includes("portfolio") || lower.includes("balance")) {
        return { action: "PORTFOLIO" };
    }
    
    if (lower.includes("vault") || lower.includes("store") || lower.includes("upload")) {
        return { action: "VAULT_UPLOAD" };
    }
    
    if (lower.includes("payment link")) {
         const amount = lower.match(/(\d+(\.\d+)?)/)?.[0] || "0";
         return {
            action: "PAYMENT_LINK",
            amount,
            description: "Services"
         };
    }

    return { action: "UNKNOWN" };
}
