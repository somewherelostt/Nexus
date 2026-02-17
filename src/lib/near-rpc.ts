import { NEAR_NODE_URL } from "@/config/near";

const NEAR_TESTNET_BLOCKS_API = "https://api-testnet.nearblocks.io";

const YOTTO_NEAR = 1e24;

export interface NEARAccountView {
  amount: string;
  block_hash: string;
  block_height: number;
  code_hash: string;
  locked: string;
  storage_paid_at: number;
  storage_usage: number;
}

/** Fetch NEAR account balance via RPC (view_account) */
export async function fetchNEARAccount(
  accountId: string
): Promise<NEARAccountView | null> {
  try {
    const res = await fetch(NEAR_NODE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "dontcare",
        method: "query",
        params: {
          request_type: "view_account",
          finality: "final",
          account_id: accountId,
        },
      }),
    });
    const data = await res.json();
    if (data.error) return null;
    return data.result as NEARAccountView;
  } catch {
    return null;
  }
}

/** Convert yoctoNEAR string to NEAR number */
export function yoctoToNEAR(amount: string): number {
  return Number(amount) / YOTTO_NEAR;
}

/** Get NEAR balance as number (NEAR) */
export async function fetchNEARBalance(accountId: string): Promise<number> {
  const account = await fetchNEARAccount(accountId);
  if (!account) return 0;
  return yoctoToNEAR(account.amount);
}

/** Transaction from NearBlocks API */
export interface NearBlocksTx {
  transaction_hash: string;
  block_timestamp: string;
  signer_id: string;
  receiver_id: string;
  actions?: Array<{ action: string; [k: string]: unknown }>;
  status?: string;
  outcome?: { status?: string };
}

/** Fetch last N transactions for account from NearBlocks testnet API */
export async function fetchAccountTxns(
  accountId: string,
  limit = 5
): Promise<NearBlocksTx[]> {
  try {
    const res = await fetch(
      `${NEAR_TESTNET_BLOCKS_API}/v1/account/${encodeURIComponent(accountId)}/txns?limit=${limit}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const list = data?.txns ?? data?.data?.txns ?? (Array.isArray(data) ? data : []);
    return Array.isArray(list) ? list.slice(0, limit) : [];
  } catch {
    return [];
  }
}
