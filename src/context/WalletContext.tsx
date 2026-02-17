"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import "@near-wallet-selector/modal-ui/styles.css";

// Basic interface for context
interface WalletContextType {
  selector: any;
  modal: any;
  accountId: string | null;
  signIn: () => void;
  signOut: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [selector, setSelector] = useState<any>(null);
  const [modal, setModal] = useState<any>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const initWallet = async () => {
      try {
        const _selector = await setupWalletSelector({
          network: "testnet",
          modules: [setupMyNearWallet()],
        });

        const _modal = setupModal(_selector, {
          contractId: "guest-book.testnet", // Placeholder
        });

        const state = _selector.store.getState();
        
        setSelector(_selector);
        setModal(_modal);

        // Check if already signed in
        if (state.accounts.length > 0) {
          setAccountId(state.accounts[0].accountId);
        }

        // Subscribe to changes
        _selector.store.observable.subscribe((state) => {
            if (state.accounts.length > 0) {
                setAccountId(state.accounts[0].accountId);
            } else {
                setAccountId(null);
            }
        });

      } catch (err) {
        console.error("Failed to init wallet", err);
      }
    };

    initWallet();
  }, []);

  const signIn = () => {
    modal?.show();
  };

  const signOut = async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    await wallet.signOut();
  };

  return (
    <WalletContext.Provider value={{ selector, modal, accountId, signIn, signOut }}>
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
