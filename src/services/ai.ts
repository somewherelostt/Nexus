// Service for parsing natural language into executable intents
// Integration with NEAR AI / Private LLM

import { ActionPlan } from "@/components/features/ActionPreview";
import { shadeAgentService, AgentAction } from "./shade";

export class AIService {
  async parseIntent(input: string): Promise<ActionPlan | null> {
    // In a real app, this calls the private inference enclave
    // For the demo, we simulate the parser's deterministic output
    
    const lower = input.toLowerCase();
    
    // Existing Intents
    if (lower.includes("send") && lower.includes("eth")) {
        return {
            id: Date.now().toString(),
            type: "TRANSFER",
            params: {
                chain: "ETHEREUM",
                amount: "0.1",
                token: "ETH",
                to: "alice.near", 
            },
            gasEstimate: "0.002 ETH"
        };
    }
    
    if (lower.includes("swap") || lower.includes("usdc")) {
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

    // New Shade Agent Intents
    if (lower.includes("deploy") && lower.includes("agent")) {
        return {
            id: Date.now().toString(),
            type: "DEPLOY_AGENT",
            params: {
                name: "my-shade-agent-" + Date.now().toString().slice(-4),
                type: "shade-basic"
            },
            gasEstimate: "0.5 NEAR"
        }
    }

    if (lower.includes("agent") && lower.includes("do")) {
         return {
            id: Date.now().toString(),
            type: "AGENT_ACTION",
            params: {
                agentId: "my-shade-agent.testnet",
                action: "STAKE",
                details: "Stake 10 NEAR"
            },
            gasEstimate: "0.01 NEAR"
        }
    }

    return null;
  }

  async executeAgentIntent(action: ActionPlan) {
      if (action.type === "DEPLOY_AGENT") {
          return await shadeAgentService.deployAgent(action.params.name);
      }
      if (action.type === "AGENT_ACTION") {
          return await shadeAgentService.executeAgentAction(
              action.params.agentId, 
              { type: "STAKE", params: { amount: "10" } } // Simplified for demo
          );
      }
      return null;
  }
}

export const aiService = new AIService();
