# NexusAI

> **Private Multi-Chain Execution Assistant** — Chat, manage, and move assets on NEAR with natural language.

**[Live App](https://nexus-ai.kaizenn.xyz/)** · **[Docs & overview](https://maazx.notion.site/NexusAI-30a32902e4a3805ea9c9c7469d373802?pvs=74)**

---

## The Story

**Web2 taught us to expect simplicity.** Open an app, tap a button, things just work. No seed phrases in the hallway, no “connect wallet” dead ends, no copy-pasting addresses from one tab to another.

Then we stepped into Web3. The promise was ownership, transparency, and freedom—but the experience was anything but smooth. New users hit walls: wrong network, failed transactions, opaque gas, and UIs built for power users, not for people who just want to *send 5 NEAR to a friend* or *see what they hold*.

**NexusAI is for everyone who lives in both worlds.** It keeps the power of the chain (NEAR) and the clarity of a single assistant. You say what you want in plain language; NexusAI figures out the intent, drafts the action, and gets out of the way. Portfolio, payments, encrypted vault, and activity—all through one interface, one narrative. No gatekeeping, no jargon by default. This is the bridge: from “I don’t get wallets” to “I just used my wallet without thinking about it.”

---

## Features

| Area | Description |
|------|-------------|
| **Assistant** | Chat with NexusAI. Send, swap, and manage assets on NEAR using natural language (e.g. *“Send 5 NEAR to alice.testnet”*, *“Swap 10 USDC to NEAR”*). |
| **Portfolio** | View balances, NEP-141 tokens, and native NEAR. Testnet-focused with optional NearBlocks indexer. |
| **Vault** | Encrypt and store files privately via [NOVA](https://nova-sdk.com) (IPFS + NEAR). Encrypt & Store and View flows with NEAR account gating. |
| **Payments** | Quick send (native NEAR), AI payment bar for intent-based sends, and [HOT Pay](https://hot-labs.gitbook.io/hot-pay/developer-api) integration for payment links and processed payments. |
| **Activity** | Transaction history and explorer links (NearBlocks / NEAR explorer). |
| **Points** | Placeholder for future rewards/points. |
| **Settings** | App and wallet preferences. |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js](https://nextjs.org) 14 (App Router), [React](https://react.dev) 18 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) 5 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 3, [Radix UI](https://www.radix-ui.com/) primitives, [Framer Motion](https://www.framer.com/motion/) |
| **State & Data** | [TanStack Query](https://tanstack.com/query) (React Query) 5, [Zustand](https://zustand-demo.pmnd.rs/) 4 |
| **Chain** | [NEAR Protocol](https://near.org) (testnet). RPC: [FastNEAR](https://rpc.testnet.fastnear.com) (default). |
| **Wallets** | [@near-wallet-selector](https://github.com/near/wallet-selector) (MyNearWallet + optional [Ethereum wallets](https://github.com/near/wallet-selector/tree/master/packages/ethereum-wallets) via [WalletConnect](https://cloud.walletconnect.com) / [Web3Modal](https://github.com/orgs/WalletConnect/repositories?q=web3modal)) |
| **EVM (optional)** | [wagmi](https://wagmi.sh) 2, [viem](https://viem.sh) 2, NEAR EVM testnet |
| **Vault** | [NOVA SDK](https://nova-sdk.com) (encrypted storage), server-side proxy for balance/RPC where needed |
| **Payments** | HOT Pay API (partner key), payment links widget |
| **AI / Intent** | Server actions with configurable LLM (e.g. [Cerebras](https://cerebras.net), [Groq](https://groq.com)) for parsing natural language into TRANSFER / SWAP / DEPLOY_AGENT JSON |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter), [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (Google Fonts) |

---

## Project Structure

```
nexus/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                 # API routes
│   │   │   ├── near/balance/   # NEAR balance proxy (avoids CORS)
│   │   │   └── nova/           # NOVA vault (upload, list, retrieve, config)
│   │   ├── actions/            # Server actions (e.g. AI intent parsing)
│   │   ├── chat/               # Chat UI
│   │   ├── payments/           # Payments page
│   │   ├── portfolio/         # Portfolio page
│   │   ├── transactions/      # Activity / tx history
│   │   ├── vault/             # Encrypted vault (NOVA)
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing (“Select Your Journey”)
│   ├── components/             # React components (layout, wallet, chat, payments, etc.)
│   ├── config/                 # NEAR, wagmi, app config
│   ├── context/                # WalletContext, ContextProvider (Wagmi + Query)
│   ├── hooks/
│   ├── lib/                    # near-rpc, vault-nova, ai-service, utils
│   └── services/              # NOVA, NEAR, Shade, AI clients
├── .env.example
├── package.json
└── README.md
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values. **Never commit `.env`.**

| Variable | Purpose |
|----------|---------|
| **NEAR** | |
| `NEXT_PUBLIC_NEAR_NODE_URL` | NEAR JSON-RPC (default: `https://rpc.testnet.fastnear.com`) |
| `NEXT_PUBLIC_NEAR_CONTRACT_ID` | DApp contract ID for wallet selector (optional; fallback used if empty) |
| `NEXT_PUBLIC_NEAR_EXPLORER_URL` | Block explorer base URL |
| `NEXT_PUBLIC_NEAR_INDEXER_URL` | NearBlocks-style indexer API (optional) |
| `NEARBLOCKS_API_KEY` | Optional for indexer auth |
| **NEAR EVM / WalletConnect** | |
| `NEXT_PUBLIC_NEAR_EVM_RPC_URL` | NEAR EVM RPC (e.g. testnet) |
| `NEXT_PUBLIC_NEAR_EVM_EXPLORER_URL` | NEAR EVM explorer |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | [WalletConnect](https://cloud.walletconnect.com) project ID (required for MetaMask / EVM wallets in selector) |
| **NOVA (Vault)** | |
| `NOVA_API_KEY` | Server-only NOVA API key ([nova-sdk.com](https://nova-sdk.com)) |
| `NEXT_PUBLIC_NOVA_CONTRACT_ID` | NOVA contract ID |
| **HOT Pay** | |
| `HOT_PAY_API_KEY` | Partner API key from [pay.hot-labs.org](https://pay.hot-labs.org/admin/api-keys) |
| `NEXT_PUBLIC_HOT_PAY_LINK_BASE_URL` | Base URL for payment links widget |
| **AI (Intent parsing)** | |
| `CEREBRAS_API_KEY` | Cerebras API key (if using Cerebras) |
| `GROQ_API_KEY` | Groq API key (if using Groq) |
| **App (optional)** | |
| `NEXT_PUBLIC_APP_NAME` | e.g. `NexusAI` |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `NEXT_PUBLIC_APP_DESCRIPTION` | Meta / SEO |
| `NEXT_PUBLIC_APP_ICON` | Icon URL |

See `.env.example` for the full list and comments.

---

## Getting Started

**Requirements:** Node.js 18+, npm or pnpm.

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your keys (see above).

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Connect Wallet** to sign in with MyNearWallet (and MetaMask if `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` is set).

**Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Architecture Notes

- **Wallet:** [@near-wallet-selector](https://github.com/near/wallet-selector) with MyNearWallet; Ethereum wallets (MetaMask) added only when a valid WalletConnect project ID is set, to avoid 403s and hangs on deploy.
- **Balance:** Browser calls the app’s `/api/near/balance` proxy to avoid CORS and deprecated public RPC issues; server-side code can call NEAR RPC directly.
- **RPC default:** `https://rpc.testnet.fastnear.com` (deprecated `rpc.testnet.near.org` removed).
- **AI intents:** Server actions parse natural language into typed JSON (TRANSFER, SWAP, DEPLOY_AGENT); LLM provider and keys are configurable via env.
- **Vault:** NOVA SDK for encryption and storage; API routes act as a secure server-side client (NOVA API key never exposed to the client).

---

## License

Private. All rights reserved.

---

**NexusAI** · NEAR Testnet · Private execution
