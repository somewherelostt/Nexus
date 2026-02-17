"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { map, distinctUntilChanged } from "rxjs";
import { setupWalletSelector, WalletSelector, AccountState } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupEthereumWallets } from "@near-wallet-selector/ethereum-wallets";
import "@near-wallet-selector/modal-ui/styles.css";
import { NEAR_NETWORK_ID, NEAR_CONTRACT_ID } from "../config/near";
import { fetchNEARBalance } from "../lib/near-rpc";
import { config, projectId as envProjectId, hasValidWalletConnectProjectId } from "../config/wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";

/** Fallback contract ID when env is unset so wallet modal has a valid target (testnet). */
const FALLBACK_CONTRACT_ID = "guest-book.testnet";

interface WalletContextType {
  selector: WalletSelector | null;
  modal: WalletSelectorModal | null;
  accounts: AccountState[];
  accountId: string | null;
  balance: string | null;
  signIn: () => void;
  signOut: () => void;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accounts, setAccounts] = useState<AccountState[]>([]);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = React.useRef<(() => void) | null>(null);

  const init = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    setError(null);
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    setSelector(null);
    setModal(null);
    setLoading(true);

    try {
      const modules = [setupMyNearWallet()];
      // Add MetaMask / Ethereum wallets when we have a valid WalletConnect project ID.
      if (hasValidWalletConnectProjectId()) {
        const pid = (envProjectId || "").trim();
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
      }

      const contractId = (NEAR_CONTRACT_ID || FALLBACK_CONTRACT_ID).trim() || FALLBACK_CONTRACT_ID;
      const _selector = await setupWalletSelector({
        network: NEAR_NETWORK_ID,
        modules,
      });

      const _modal = setupModal(_selector, {
        contractId,
      });

      const state = _selector.store.getState();
      setAccounts(state.accounts);

      const subscription = _selector.store.observable
        .pipe(
          map((state) => state.accounts),
          distinctUntilChanged()
        )
        .subscribe((nextAccounts) => {
          setAccounts(nextAccounts);
        });
      cleanupRef.current = () => subscription.unsubscribe();

      setSelector(_selector);
      setModal(_modal);
      setLoading(false);
    } catch (err) {
      console.error("Failed to initialise wallet selector", err);
      setError("Wallet failed to load. Refresh the page or try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    init();
    // Safety: ensure loading never stays true forever (e.g. deploy / network issues).
    const t = setTimeout(() => {
      setLoading((prev) => (prev ? false : prev));
    }, 6000);
    return () => {
      clearTimeout(t);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
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
    if (modal) {
      setError(null);
      modal.show();
    } else if (!loading) {
      setError("Wallet not ready. Refresh the page or try again.");
    }
  };

  const retry = () => {
    setError(null);
    init();
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
        error,
        retry,
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

