/**
 * NOVA SDK client — uses nova-sdk-js for real upload/list/retrieve.
 * Requires NOVA API key from https://nova-sdk.com (Manage Account).
 * Encryption, IPFS upload, and NEAR recording are done by the SDK/MCP.
 */

import { NovaSdk, NovaError } from "nova-sdk-js";
import { Buffer } from "buffer";
import { NEAR_NODE_URL } from "@/config/near";
import { getVaultGroupId } from "@/lib/vault-nova";

const NOVA_API_KEY = process.env.NEXT_PUBLIC_NOVA_API_KEY ?? "";
const NOVA_CONTRACT_ID =
  process.env.NEXT_PUBLIC_NOVA_CONTRACT_ID?.trim() || "nova-sdk.near";

export type { NovaError };

export interface NovaUploadResult {
  cid: string;
  trans_id: string;
  file_hash: string;
}

export interface NovaRetrieveResult {
  data: Buffer;
  ipfs_hash: string;
  group_id: string;
}

export interface NovaTransaction {
  group_id: string;
  user_id: string;
  file_hash: string;
  ipfs_hash: string;
}

let sdkInstance: NovaSdk | null = null;
let sdkAccountId: string | null = null;

/**
 * Get a NovaSdk instance for the given NEAR account.
 * Uses API key from NEXT_PUBLIC_NOVA_API_KEY (obtain at nova-sdk.com).
 */
export function getNovaSdk(accountId: string): NovaSdk | null {
  if (!NOVA_API_KEY?.trim()) return null;
  if (sdkInstance && sdkAccountId === accountId) return sdkInstance;
  try {
    sdkInstance = new NovaSdk(accountId, {
      apiKey: NOVA_API_KEY.trim(),
      contractId: NOVA_CONTRACT_ID,
      rpcUrl: NEAR_NODE_URL,
    });
    sdkAccountId = accountId;
    return sdkInstance;
  } catch {
    return null;
  }
}

export function isNovaSdkAvailable(): boolean {
  return !!NOVA_API_KEY?.trim();
}

/**
 * Ensure the vault group exists, then upload file via NOVA SDK.
 * File is encrypted by the SDK and stored via NOVA (IPFS + NEAR).
 */
export async function uploadWithNovaSdk(
  accountId: string,
  file: File
): Promise<NovaUploadResult> {
  const sdk = getNovaSdk(accountId);
  if (!sdk) {
    throw new Error(
      "NOVA SDK is not configured. Add NEXT_PUBLIC_NOVA_API_KEY from nova-sdk.com to use Encrypt & Store."
    );
  }
  const groupId = getVaultGroupId(accountId);
  try {
    await sdk.registerGroup(groupId);
  } catch {
    // Group may already exist
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));
  return sdk.upload(groupId, buffer, file.name);
}

/**
 * List files in the vault group via NOVA SDK (same data as on-chain).
 */
export async function listVaultWithNovaSdk(
  accountId: string
): Promise<NovaTransaction[]> {
  const sdk = getNovaSdk(accountId);
  if (!sdk) return [];
  const groupId = getVaultGroupId(accountId);
  try {
    return sdk.getTransactionsForGroup(groupId, accountId);
  } catch {
    return [];
  }
}

/**
 * Retrieve and decrypt a file via NOVA SDK.
 */
export async function retrieveWithNovaSdk(
  accountId: string,
  groupId: string,
  ipfsHash: string
): Promise<NovaRetrieveResult> {
  const sdk = getNovaSdk(accountId);
  if (!sdk) {
    throw new Error(
      "NOVA SDK is not configured. Add NEXT_PUBLIC_NOVA_API_KEY to view files."
    );
  }
  return sdk.retrieve(groupId, ipfsHash);
}
