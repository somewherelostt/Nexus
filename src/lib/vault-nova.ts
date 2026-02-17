/**
 * NOVA vault integration — read-only view calls + types.
 * Docs: https://nova-25.gitbook.io/nova-docs/
 * Upload requires signer + Pinata (backend or wallet sign flow).
 */

import { NEAR_NODE_URL, NOVA_CONTRACT_ID } from "@/config/near";

const NEXUS_VAULT_GROUP_PREFIX = "nexus-vault";

export interface NovaTransaction {
  group_id: string;
  user_id: string;
  file_hash: string;
  ipfs_hash: string;
}

export function getVaultGroupId(accountId: string): string {
  const safe = accountId.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${NEXUS_VAULT_GROUP_PREFIX}-${safe}`.slice(0, 64);
}

export function truncateHash(hash: string | null | undefined, chars = 6): string {
  if (!hash) return "";
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

function toBase64(s: string): string {
  if (typeof Buffer !== "undefined") return Buffer.from(s, "utf8").toString("base64");
  return btoa(unescape(encodeURIComponent(s)));
}

/** Call NEAR contract view method (no signer). */
async function nearViewCall<T>(method: string, args: Record<string, string>): Promise<T> {
  const res = await fetch(NEAR_NODE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "vault",
      method: "query",
      params: {
        request_type: "call_function",
        account_id: NOVA_CONTRACT_ID,
        method_name: method,
        args_base64: toBase64(JSON.stringify(args)),
        finality: "final",
      },
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "RPC error");
  const result = data.result?.result;
  if (!result) return [] as T;
  let raw: string;
  if (Array.isArray(result)) {
    raw = String.fromCharCode(...result);
  } else if (typeof result === "string") {
    try {
      raw = atob(result);
    } catch {
      raw = result;
    }
  } else {
    raw = String(result);
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return [] as T;
  }
}

/** Fetch file list for user's vault group from NOVA contract. Requires NEXT_PUBLIC_NOVA_CONTRACT_ID. */
export async function fetchVaultTransactions(
  accountId: string
): Promise<NovaTransaction[]> {
  if (!NOVA_CONTRACT_ID) return [];
  const groupId = getVaultGroupId(accountId);
  try {
    const list = await nearViewCall<NovaTransaction[]>("get_transactions_for_group", {
      group_id: groupId,
      user_id: accountId,
    });
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** Derive a short fingerprint for display (e.g. from group id). */
export function vaultKeyFingerprint(accountId: string): string {
  const groupId = getVaultGroupId(accountId);
  let h = 0;
  for (let i = 0; i < groupId.length; i++) h = (h << 5) - h + groupId.charCodeAt(i);
  const hex = Math.abs(h).toString(16).slice(0, 12);
  return truncateHash(hex.padStart(12, "0"), 4);
}
