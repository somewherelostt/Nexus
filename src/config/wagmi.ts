import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http } from 'wagmi';
import { defineChain } from 'viem';

const NEAR_EVM_RPC = process.env.NEXT_PUBLIC_NEAR_EVM_RPC_URL || 'https://eth-rpc.testnet.near.org';
const NEAR_EVM_EXPLORER = process.env.NEXT_PUBLIC_NEAR_EVM_EXPLORER_URL || 'https://eth-explorer-testnet.near.org';

export const nearEvmTestnet = defineChain({
  id: 398,
  name: 'NEAR EVM Testnet',
  network: 'near-evm-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'NEAR',
    symbol: 'NEAR',
  },
  rpcUrls: {
    default: { http: [NEAR_EVM_RPC] },
    public: { http: [NEAR_EVM_RPC] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: NEAR_EVM_EXPLORER },
  },
  testnet: true,
});

/** Raw projectId from env. */
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '';

/** Placeholder/invalid IDs that cause Web3Modal 403s — treat as "no WalletConnect". */
const PLACEHOLDER_IDS = new Set([
  '',
  'placeholder-required',
  'c0fec857183e87834731305710d0c3f7', // old default
]);

/** True only when we have a real WalletConnect project ID (from cloud.walletconnect.com). */
export const hasValidWalletConnectProjectId = (): boolean => {
  const id = (projectId || '').trim();
  return id.length > 0 && !PLACEHOLDER_IDS.has(id);
};

const metadata = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'NexusAI',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Private Multi-Chain Execution Assistant',
  url: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://nexus-ai.app'),
  icons: process.env.NEXT_PUBLIC_APP_ICON ? [process.env.NEXT_PUBLIC_APP_ICON] : ['https://avatars.githubusercontent.com/u/37784886'],
};

export const config = defaultWagmiConfig({
  chains: [nearEvmTestnet],
  projectId: projectId || 'placeholder-required',
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [nearEvmTestnet.id]: http(),
  },
});
