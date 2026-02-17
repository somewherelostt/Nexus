import { NetworkId } from "@near-wallet-selector/core";

export const NEAR_NETWORK_ID = (process.env.NEXT_PUBLIC_NEAR_NETWORK as NetworkId) || "testnet";
export const NEAR_NODE_URL = process.env.NEXT_PUBLIC_NEAR_NODE_URL || "https://rpc.testnet.near.org";
export const NEAR_CONTRACT_ID = process.env.NEXT_PUBLIC_NEAR_CONTRACT_ID || "";
