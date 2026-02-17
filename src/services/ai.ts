import { ActionPlan } from "@/components/features/ActionPreview";
import { parseIntentAction } from "@/app/actions/ai";
import { nearService } from "./near";
import { shadeAgentService } from "./shade";

export class AIService {
  async parseIntent(input: string): Promise<ActionPlan | null> {
    const result = await parseIntentAction(input);
    
    if (!result) return null;

    return {
        id: Date.now().toString(),
        type: result.type as any,
        params: result.params,
        gasEstimate: result.gasEstimate || "0.01 NEAR" // Fallback
    };
  }

  async executeAgentIntent(action: ActionPlan) {
      if (action.type === "TRANSFER") {
          // Real On-Chain Transfer
          if (action.params.chain === "NEAR" || !action.params.chain) {
              const amountYocto = (parseFloat(action.params.amount) * 1e24).toLocaleString('fullwide', {useGrouping:false}).split('.')[0];
              
              return await nearService.signAndSendTransaction(
                  action.params.to,
                  [
                      {
                        type: "Transfer",
                        params: {
                            deposit: amountYocto 
                        }
                      }
                  ]
              );
          }
      }

      if (action.type === "DEPLOY_AGENT") {
          return await shadeAgentService.deployAgent(action.params.name);
      }
      
      if (action.type === "AGENT_ACTION") {
          return await shadeAgentService.executeAgentAction(
              action.params.agentId, 
              { type: "STAKE", params: { amount: "10" } } 
          );
      }
      
      return null;
  }
}

export const aiService = new AIService();
