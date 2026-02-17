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

/** Fetch NEAR balance for account (in NEAR). Mock returns a number. */
export async function fetchNEARBalance(accountId: string): Promise<number> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return 12.5; // Mock
}

/** Fetch recent transactions for account. Returns NearBlocks-style list. */
export async function fetchAccountTxns(accountId: string, limit: number): Promise<NearBlocksTx[]> {
    const list = await fetchAccountHistory(accountId);
    return list.slice(0, limit).map((tx) => ({
        transaction_hash: tx.hash,
        signer_id: tx.signer_id,
        receiver_id: tx.receiver_id,
        block_timestamp: new Date(tx.block_timestamp).toISOString(),
        actions: tx.actions,
        status: tx.status,
        outcome: { status: tx.status },
    }));
}

export async function fetchAccountHistory(accountId: string): Promise<Transaction[]> {
    // MOCK DATA for Demo
    // Real implementation requires Indexer API (NearBlocks, Pikespeak, etc.)
    
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency

    return [
        {
            hash: "ABC...123",
            signer_id: accountId,
            receiver_id: "alice.testnet",
            block_timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
            actions: [{ action: "TRANSFER", deposit: "5000000000000000000000000" }], // 5 NEAR
            status: "SUCCESS"
        },
        {
            hash: "DEF...456",
            signer_id: "bob.testnet",
            receiver_id: accountId,
            block_timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
            actions: [{ action: "TRANSFER", deposit: "10000000000000000000000000" }], // 10 NEAR
            status: "SUCCESS"
        },
        {
            hash: "GHI...789",
            signer_id: accountId,
            receiver_id: "ref-finance-101.testnet",
            block_timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
            actions: [{ action: "FUNCTION_CALL", method: "swap" }],
            status: "SUCCESS"
        },
        {
             hash: "JKL...012",
             signer_id: accountId,
             receiver_id: "token.testnet",
             block_timestamp: Date.now() - 1000 * 60 * 60 * 48,
             actions: [{ action: "FUNCTION_CALL", method: "ft_transfer" }],
             status: "FAILURE"
        },
        {
            hash: "MNO...345",
            signer_id: accountId,
            receiver_id: "market.testnet",
            block_timestamp: Date.now() - 1000 * 60 * 30, 
            actions: [{ action: "FUNCTION_CALL", method: "storage_deposit", deposit: "10000000000000000000000" }],
            status: "PENDING"
        }
    ];
}
