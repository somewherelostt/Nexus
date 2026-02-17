"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { map, distinctUntilChanged } from "rxjs";
import { setupWalletSelector, NetworkId, WalletSelector, AccountState } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupEthereumWallets } from "@near-wallet-selector/ethereum-wallets";
import "@near-wallet-selector/modal-ui/styles.css";
import { NEAR_NETWORK_ID, NEAR_CONTRACT_ID } from "../config/near";
import { config } from "../config/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";

interface WalletContextType {
  selector: WalletSelector | null;
  modal: WalletSelectorModal | null;
  accounts: AccountState[];
  accountId: string | null;
  signIn: () => void;
  signOut: () => void;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = useCallback(async () => {
    try {
      const web3Modal = createWeb3Modal({
        wagmiConfig: config,
        projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c0fec857183e87834731305710d0c3f7',
      });

      const _selector = await setupWalletSelector({
        network: NEAR_NETWORK_ID,
        modules: [
            setupMyNearWallet(),
            setupEthereumWallets({ wagmiConfig: config, web3Modal })
        ],
      });

      const _modal = setupModal(_selector, {
        contractId: NEAR_CONTRACT_ID,
      });

      const state = _selector.store.getState();
      setAccounts(state.accounts);

      // Subscribe to changes
      const subscription = _selector.store.observable
        .pipe(
          map((state) => state.accounts),
          distinctUntilChanged()
        )
        .subscribe((nextAccounts) => {
          setAccounts(nextAccounts);
        });

      setSelector(_selector);
      setModal(_modal);
      setLoading(false);

      return () => subscription.unsubscribe();

    } catch (err) {
      console.error("Failed to initialise wallet selector", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const accountId = useMemo(() => accounts[0]?.accountId || null, [accounts]);

  const signIn = () => {
    modal?.show();
  };

  const signOut = async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    await wallet.signOut();
  };

  return (
    <WalletContext.Provider
      value={{
        selector,
        modal,
        accounts,
        accountId,
        signIn,
        signOut,
        loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

