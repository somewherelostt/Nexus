// Service for parsing natural language into executable intents
// Integration with NEAR AI / Private LLM

import { ActionPlan } from "@/components/features/ActionPreview";

export class AIService {
  async parseIntent(input: string): Promise<ActionPlan | null> {
    // In a real app, this calls the private inference enclave
    // For the demo, we simulate the parser's deterministic output
    
    const lower = input.toLowerCase();
    
    if (lower.includes("send") && lower.includes("eth")) {
        return {
            id: Date.now().toString(),
            type: "TRANSFER",
            params: {
                chain: "ETHEREUM",
                amount: "0.1",
                token: "ETH",
                to: "alice.near", // logic to resolve "alice.near" to ETH address would happen here
            },
            gasEstimate: "0.002 ETH"
        };
    }
    
    if (lower.includes("swap") || lower.includes("usDC")) {
        return {
             id: Date.now().toString(),
             type: "SWAP",
             params: {
                 chain: "NEAR",
                 amount: "10",
                 token: "NEAR -> USDC",
             },
             gasEstimate: "0.001 NEAR"
        }
    }

    return null;
  }
}

export const aiService = new AIService();
