"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { map, distinctUntilChanged } from "rxjs";
import { setupWalletSelector, NetworkId, WalletSelector, AccountState } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupEthereumWallets } from "@near-wallet-selector/ethereum-wallets";
import "@near-wallet-selector/modal-ui/styles.css";
import { NEAR_NETWORK_ID, NEAR_CONTRACT_ID } from "../config/near";
import { fetchNEARBalance } from "../lib/near-rpc";
import { config, projectId as envProjectId } from "../config/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";

interface WalletContextType {
  selector: WalletSelector | null;
  modal: WalletSelectorModal | null;
  accounts: AccountState[];
  accountId: string | null;
  balance: string | null;
  signIn: () => void;
  signOut: () => void;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const init = useCallback(async () => {
    try {
      const modules = [setupMyNearWallet()];
      // Always add Ethereum wallets (MetaMask, etc.) so they appear in the NEAR selector.
      // Use env project ID or placeholder so Web3Modal can init; get a valid ID from cloud.walletconnect.com to avoid 403s.
      const pid = (envProjectId || "placeholder-required").trim();
      const web3Modal = createWeb3Modal({
        wagmiConfig: config,
        projectId: pid,
      });
      modules.push(
        setupEthereumWallets({
          wagmiConfig: config as Parameters<typeof setupEthereumWallets>[0]["wagmiConfig"],
          web3Modal,
        })
      );

      const _selector = await setupWalletSelector({
        network: NEAR_NETWORK_ID,
        modules,
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

  useEffect(() => {
    if (!accountId) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    fetchNEARBalance(accountId).then((n) => {
      if (!cancelled) setBalance(n.toFixed(4));
    });
    return () => { cancelled = true; };
  }, [accountId]);

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
        balance,
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

