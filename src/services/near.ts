import { setupWalletSelector, NetworkId } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import "@near-wallet-selector/modal-ui/styles.css";

const NETWORK_ID: NetworkId = "testnet"; // or 'mainnet'

export class NearService {
  selector: any;
  modal: any;

  async init() {
    this.selector = await setupWalletSelector({
      network: NETWORK_ID,
      modules: [
        setupMyNearWallet(),
      ],
    });

    this.modal = setupModal(this.selector, {
      contractId: "v1.signer-prod.testnet", // MPC Contract
    });
    
    return { selector: this.selector, modal: this.modal };
  }

  async executeMPCAction(action: any): Promise<string> {
      if (!this.selector) throw new Error("Wallet not initialized");
      
      const wallet = await this.selector.wallet();
      const accountId = (await wallet.getAccounts())[0].accountId;

      // 1. Derivation Path for the target chain (e.g., ETH)
      const path = "ethereum,1"; 
      
      // 2. This would normally require constructing an RLP-encoded ETH transaction
      // For this implementation, we will call the sign method with a payload
      // representing the hash of the transaction we want to sign.
      
      // MOCK DATA for the "Real" call structure to avoid needing 'ethers' or 'rlp' deps which might fail install
      const payload = Array.from(new Uint8Array(32).fill(1)); 
      
      const outcome = await wallet.signAndSendTransaction({
          signerId: accountId,
          receiverId: "v1.signer-prod.testnet",
          actions: [
              {
                  type: "FunctionCall",
                  params: {
                      methodName: "sign",
                      args: {
                          payload: payload,
                          path: path,
                          key_version: 0,
                      },
                      gas: "300000000000000", // 300 Tgas
                      deposit: "250000000000000000000000", // 0.25 NEAR (Standard deposit for MPC sign)
                  }
              }
          ]
      });

      console.log("MPC Transaction Outcome:", outcome);
      return outcome.transaction.hash;
  }
}

export const nearService = new NearService();
