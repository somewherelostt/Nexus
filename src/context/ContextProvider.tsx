"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import React, { ReactNode, useEffect, useRef } from "react";
import { State, WagmiProvider } from "wagmi";

import { config, projectId, hasValidWalletConnectProjectId } from "@/config/wagmi";

const queryClient = new QueryClient();

// Only initialize Web3Modal when WalletConnect project ID is set (NEAR EVM / WalletConnect).
// When unset, the app uses NEAR-native wallets only (MyNearWallet) and does not throw.
// Run after mount to avoid "deferred DOM Node could not be resolved" and reduce 403/analytics noise.
function useWeb3Modal() {
  const initialized = useRef(false);
  useEffect(() => {
    if (!hasValidWalletConnectProjectId() || initialized.current || typeof document === "undefined") return;
    initialized.current = true;
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      enableAnalytics: false,
      enableOnramp: false,
    });
  }, []);
}

export function ContextProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  useWeb3Modal();
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
