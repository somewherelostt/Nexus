/**
 * Shade Agent integration (TEE-secured keys per NOVA MCP).
 * @see https://nova-25.gitbook.io/nova-docs/mcp-server
 * Set SHADE_API_URL (from Phala cloud) for real key retrieval.
 */

const SHADE_API_URL = process.env.NEXT_PUBLIC_SHADE_API_URL || process.env.SHADE_API_URL || "";

export interface AgentAction {
  type: "TRANSFER" | "SWAP" | "STAKE" | "DEPLOY_CONTRACT";
  params: Record<string, unknown>;
}

export class ShadeAgentService {
  private get baseUrl(): string {
    return SHADE_API_URL.replace(/\/$/, "");
  }

  async getShadeKey(groupId: string, userId: string, token?: string): Promise<string | null> {
    if (!this.baseUrl) return null;
    try {
      const res = await fetch(`${this.baseUrl}/api/key-management/get_key`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ group_id: groupId, user_id: userId }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.key ?? null;
    } catch {
      return null;
    }
  }

  async deployAgent(name: string): Promise<string> {
    if (!this.baseUrl) {
      throw new Error("Shade Agent integration requires NEXT_PUBLIC_SHADE_API_URL.");
    }
    const res = await fetch(`${this.baseUrl}/api/agent/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Deploy failed.");
    }
    const data = await res.json();
    return data?.agent_id ?? data?.id ?? "";
  }

  async executeAgentAction(agentId: string, action: AgentAction): Promise<string> {
    if (!this.baseUrl) {
      throw new Error("Shade Agent integration requires NEXT_PUBLIC_SHADE_API_URL.");
    }
    const res = await fetch(`${this.baseUrl}/api/agent/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId, action: action.type, params: action.params }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Execution failed.");
    }
    const data = await res.json();
    return data?.tx_hash ?? data?.hash ?? "";
  }

  async listAgents(ownerId: string): Promise<string[]> {
    if (!this.baseUrl) return [];
    try {
      const res = await fetch(`${this.baseUrl}/api/agent/list?owner=${encodeURIComponent(ownerId)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.agents) ? data.agents : Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
}

export const shadeAgentService = new ShadeAgentService();
