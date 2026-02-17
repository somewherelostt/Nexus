import { setupWalletSelector, WalletSelector } from "@near-wallet-selector/core";
import { setupModal, WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import { NEAR_NETWORK_ID, NEAR_CONTRACT_ID } from "../config/near";

export class NearService {
  selector: WalletSelector | null = null;
  modal: WalletSelectorModal | null = null;

  private static instance: NearService;

  private constructor() {}

  public static getInstance(): NearService {
    if (!NearService.instance) {
      NearService.instance = new NearService();
    }
    return NearService.instance;
  }

  async init(): Promise<{ selector: WalletSelector; modal: WalletSelectorModal }> {
    if (this.selector && this.modal) {
      return { selector: this.selector, modal: this.modal };
    }

    this.selector = await setupWalletSelector({
      network: NEAR_NETWORK_ID,
      modules: [setupMyNearWallet()],
    });

    this.modal = setupModal(this.selector, {
      contractId: NEAR_CONTRACT_ID,
    });

    return { selector: this.selector, modal: this.modal };
  }

  async signIn() {
    if (!this.modal) await this.init();
    this.modal?.show();
  }

  async signOut() {
    if (!this.selector) await this.init();
    const wallet = await this.selector?.wallet();
    await wallet?.signOut();
  }

  async getAccountId(): Promise<string | null> {
      if (!this.selector) await this.init();
      const accounts = this.selector?.store.getState().accounts;
      return accounts?.[0]?.accountId || null;
  }

  async signAndSendTransaction(receiverId: string, actions: any[]) {
      if (!this.selector) await this.init();
      const wallet = await this.selector?.wallet();
      return await wallet?.signAndSendTransaction({
          receiverId,
          actions
      });
  }
}

export const nearService = NearService.getInstance();
