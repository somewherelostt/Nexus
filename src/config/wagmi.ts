import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http } from 'wagmi';
import { defineChain } from 'viem';

// Define the custom NEAR EVM Testnet chain
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
    default: { http: ['https://eth-rpc.testnet.near.org'] },
    public: { http: ['https://eth-rpc.testnet.near.org'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://eth-explorer-testnet.near.org' },
  },
  testnet: true,
});

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c0fec857183e87834731305710d0c3f7'; 

const metadata = {
  name: 'NexusAI',
  description: 'Private Multi-Chain Execution Assistant',
  url: 'https://nexus-ai.app', // reliable url
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [nearEvmTestnet],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [nearEvmTestnet.id]: http(),
  },
});
