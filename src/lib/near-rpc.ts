/**
 * NEAR RPC and indexer integration.
 * Balance via NEAR JSON-RPC view_account; transaction history via NearBlocks API.
 * @see https://docs.near.org/api/rpc/introduction
 * @see https://docs.near.org/tools/ecosystem-apis/nearblocks
 */

const NEAR_RPC_URL = process.env.NEXT_PUBLIC_NEAR_NODE_URL || "https://rpc.testnet.near.org";
const NEAR_INDEXER_BASE = process.env.NEXT_PUBLIC_NEAR_INDEXER_URL || "https://api-testnet.nearblocks.io";
const NEAR_INDEXER_API_KEY = process.env.NEARBLOCKS_API_KEY || "";

export interface Transaction {
  hash: string;
  signer_id: string;
  receiver_id: string;
  block_timestamp: number;
  actions: {
    action: "TRANSFER" | "FUNCTION_CALL" | "DEPLOY_CONTRACT";
    method?: string;
    deposit?: string;
  }[];
  status: "SUCCESS" | "FAILURE" | "PENDING";
}

/** Shape used by portfolio (NearBlocks-style tx list) */
export interface NearBlocksTx {
  transaction_hash: string;
  signer_id: string;
  receiver_id: string;
  block_timestamp: string;
  actions?: { action?: string; method?: string; deposit?: string }[];
  status: string;
  outcome?: { status?: string };
}

/** Fetch NEAR balance for account (in NEAR) via RPC view_account. */
export async function fetchNEARBalance(accountId: string): Promise<number> {
  const res = await fetch(NEAR_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "balance",
      method: "query",
      params: {
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      },
    }),
  });
  const data = await res.json();
  if (data.error) {
    if (data.error.message?.includes("does not exist")) return 0;
    throw new Error(data.error.message || "RPC error");
  }
  const amount = data.result?.amount ?? "0";
  return Number(amount) / 1e24;
}

/** NearBlocks API tx entry shape (subset we use). */
interface NearBlocksTxRaw {
  transaction_hash: string;
  predecessor_account_id: string;
  receiver_account_id: string;
  block_timestamp: string;
  actions?: { action?: string; method?: string; deposit?: number }[];
  outcomes?: { status?: boolean };
}

/** Fetch recent transactions for account from NearBlocks indexer. */
export async function fetchAccountTxns(accountId: string, limit: number): Promise<NearBlocksTx[]> {
  const url = `${NEAR_INDEXER_BASE}/v1/account/${encodeURIComponent(accountId)}/txns?limit=${limit}`;
  const headers: HeadersInit = { Accept: "application/json" };
  if (NEAR_INDEXER_API_KEY) headers["Authorization"] = NEAR_INDEXER_API_KEY;

  const res = await fetch(url, { headers });
  if (!res.ok) return [];
  const json = await res.json();
  const txns: NearBlocksTxRaw[] = json.txns ?? [];
  return txns.slice(0, limit).map((tx) => ({
    transaction_hash: tx.transaction_hash,
    signer_id: tx.predecessor_account_id,
    receiver_id: tx.receiver_account_id,
    block_timestamp: tx.block_timestamp,
    actions: (tx.actions ?? []).map((a: { action?: string; method?: string; deposit?: number }) => ({
      action: a.action,
      method: a.method,
      deposit: a.deposit != null ? String(a.deposit) : undefined,
    })),
    status: tx.outcomes?.status === true ? "Success" : "Failure",
    outcome: { status: tx.outcomes?.status === true ? "Success" : "Failure" },
  }));
}

/** Fetch account history as Transaction[] (for TransactionTable). */
export async function fetchAccountHistory(accountId: string): Promise<Transaction[]> {
  const list = await fetchAccountTxns(accountId, 50);
  return list.map((tx) => ({
    hash: tx.transaction_hash,
    signer_id: tx.signer_id,
    receiver_id: tx.receiver_id,
    block_timestamp: typeof tx.block_timestamp === "string" ? new Date(tx.block_timestamp).getTime() : Number(tx.block_timestamp),
    actions: (tx.actions ?? []).map((a) => ({
      action: (a.action === "TRANSFER" ? "TRANSFER" : a.action === "FUNCTION_CALL" ? "FUNCTION_CALL" : "FUNCTION_CALL") as Transaction["actions"][0]["action"],
      method: a.method,
      deposit: a.deposit,
    })),
    status: tx.status === "Success" || tx.outcome?.status === "Success" ? "SUCCESS" : tx.status === "Pending" ? "PENDING" : "FAILURE",
  }));
}
