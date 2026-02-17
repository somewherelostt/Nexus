/**
 * NOVA vault client — calls Next.js API routes so auth runs server-side (avoids CORS).
 * Set NOVA_API_KEY in .env (server-only). Get key at https://nova-sdk.com
 */

import { getVaultGroupId } from "@/lib/vault-nova";

export interface NovaUploadResult {
  cid: string;
  trans_id: string;
  file_hash: string;
}

export interface NovaTransaction {
  group_id: string;
  user_id: string;
  file_hash: string;
  ipfs_hash: string;
}

let configCache: { enabled: boolean } | null = null;

/**
 * Whether NOVA is configured (server has NOVA_API_KEY). Cached.
 */
export async function isNovaSdkAvailable(): Promise<boolean> {
  if (configCache !== null) return configCache.enabled;
  try {
    const res = await fetch("/api/nova/config");
    const data = await res.json();
    configCache = { enabled: !!data?.enabled };
    return configCache.enabled;
  } catch {
    configCache = { enabled: false };
    return false;
  }
}

/**
 * Sync check for UI that already fetched config (e.g. from React Query).
 */
export function getNovaConfigCache(): boolean | null {
  return configCache?.enabled ?? null;
}

export function setNovaConfigCache(enabled: boolean): void {
  configCache = { enabled };
}

/**
 * Upload file via NOVA (API route runs SDK server-side).
 */
export async function uploadWithNovaSdk(
  accountId: string,
  file: File
): Promise<NovaUploadResult> {
  const formData = new FormData();
  formData.set("accountId", accountId);
  formData.set("file", file);
  const res = await fetch("/api/nova/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Upload failed");
  }
  return data as NovaUploadResult;
}

/**
 * List vault files via NOVA API.
 */
export async function listVaultWithNovaSdk(
  accountId: string
): Promise<NovaTransaction[]> {
  const res = await fetch(
    `/api/nova/list?${new URLSearchParams({ accountId })}`
  );
  const data = await res.json();
  if (!res.ok) return [];
  return Array.isArray(data?.transactions) ? data.transactions : [];
}

/**
 * Retrieve and download a file. Returns blob URL for download.
 */
export async function retrieveWithNovaSdk(
  accountId: string,
  groupId: string,
  ipfsHash: string
): Promise<Blob> {
  const res = await fetch("/api/nova/retrieve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, groupId, ipfsHash }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error ?? "Retrieve failed");
  }
  return res.blob();
}

export { getVaultGroupId };
