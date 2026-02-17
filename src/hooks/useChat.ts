import { useState, useCallback } from "react";
import { aiService } from "@/services/ai";
import { novaService } from "@/services/nova";
import { nearService } from "@/services/near";
import { ActionPlan } from "@/components/features/ActionPreview";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to NexusAI. I am your private execution assistant. Connect your wallet to begin.",
      timestamp: Date.now(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionPlan | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const addMessage = (role: Message["role"], content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role,
        content,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleSend = useCallback(async (input: string) => {
    if (!input.trim()) return;
    
    addMessage("user", input);
    setIsProcessing(true);

    try {
      // 1. Log to Encrypted Memory (Simulated)
      await novaService.saveLog(await novaService.encrypt(input, "user-key"));

      // 2. Parse Intent
      const plan = await aiService.parseIntent(input);

      if (plan) {
        setPendingAction(plan);
        setShowPreview(true);
        addMessage("assistant", "I've analyzed your request. Please confirm the transaction details.");
      } else {
        addMessage("assistant", "I understood your message, but it doesn't look like a transaction request. (General chat not fully implemented yet)");
      }
    } catch (error) {
      console.error(error);
      addMessage("system", "Error processing request.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const confirmAction = useCallback(async () => {
    if (!pendingAction) return;
    
    setShowPreview(false);
    addMessage("system", `Initiating ${pendingAction.type}...`);
    
    try {
        let resultHash;

        if (pendingAction.type === "DEPLOY_AGENT" || pendingAction.type === "AGENT_ACTION") {
            addMessage("system", "Interacting with Shade Agent Service...");
            resultHash = await aiService.executeAgentIntent(pendingAction);
            addMessage("assistant", `✅ Agent Action Successful!`);
        } else {
            // Real MPC Execution
            addMessage("system", "Requesting signature from NEAR MPC Enclave...");
            // This triggers the wallet popup for the user to sign the NEAR transaction
            resultHash = await nearService.executeMPCAction(pendingAction);
             addMessage("assistant", `✅ Execution Confirmed on NEAR. Relaying to ${pendingAction.params.chain}...`);
        }
        
        addMessage("system", `Transaction Hash: ${resultHash}`);
        
    } catch (e: any) {
        console.error(e);
        addMessage("system", `Execution failed: ${e.message || "Unknown error"}`);
    }
    
    setPendingAction(null);
  }, [pendingAction]);

  const rejectAction = useCallback(() => {
    setShowPreview(false);
    setPendingAction(null);
    addMessage("system", "Action cancelled by user.");
  }, []);

  return {
    messages,
    isProcessing,
    handleSend,
    pendingAction,
    showPreview,
    setShowPreview,
    confirmAction,
    rejectAction
  };
}
