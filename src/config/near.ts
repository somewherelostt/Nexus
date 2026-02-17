import { NetworkId } from "@near-wallet-selector/core";

/** NEAR network: testnet | mainnet. Set via NEXT_PUBLIC_NEAR_NETWORK. */
export const NEAR_NETWORK_ID = (process.env.NEXT_PUBLIC_NEAR_NETWORK as NetworkId) || "testnet";
/** NEAR RPC URL. Set via NEXT_PUBLIC_NEAR_NODE_URL. */
export const NEAR_NODE_URL = process.env.NEXT_PUBLIC_NEAR_NODE_URL || "https://rpc.testnet.near.org";
/** App/contract ID for wallet selector (e.g. multisig or dapp contract). Set via NEXT_PUBLIC_NEAR_CONTRACT_ID. */
export const NEAR_CONTRACT_ID = process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID ?? "";
/** NOVA contract for vault (e.g. nova-sdk-6.testnet). Set via NEXT_PUBLIC_NOVA_CONTRACT_ID. */
export const NOVA_CONTRACT_ID = process.env.NEXT_PUBLIC_NOVA_CONTRACT_ID || process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID || "";
/** Block explorer base URL for tx links. Set via NEXT_PUBLIC_NEAR_EXPLORER_URL. */
export const NEAR_EXPLORER_URL = process.env.NEXT_PUBLIC_NEAR_EXPLORER_URL || "https://testnet.nearblocks.io";
