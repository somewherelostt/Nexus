import { NextRequest, NextResponse } from "next/server";
import { NovaSdk } from "nova-sdk-js";
import { getVaultGroupId, isEvmAddress } from "@/lib/vault-nova";

const NOVA_API_KEY = (
  process.env.NOVA_API_KEY ?? process.env.NEXT_PUBLIC_NOVA_API_KEY ?? ""
).trim();
const CONTRACT_ID =
  (process.env.NEXT_PUBLIC_NOVA_CONTRACT_ID ?? "").trim() || "nova-sdk.near";
const RPC_URL =
  process.env.NEXT_PUBLIC_NEAR_NODE_URL ?? "https://rpc.testnet.fastnear.com";

export async function GET(request: NextRequest) {
  const accountId = request.nextUrl.searchParams.get("accountId");
  if (!accountId?.trim()) {
    return NextResponse.json(
      { error: "Missing accountId" },
      { status: 400 }
    );
  }
  const id = accountId.trim();
  if (isEvmAddress(id)) {
    return NextResponse.json({ transactions: [] });
  }
  if (!NOVA_API_KEY) {
    return NextResponse.json({ transactions: [] });
  }
  try {
    const sdk = new NovaSdk(id, {
      apiKey: NOVA_API_KEY,
      contractId: CONTRACT_ID,
      rpcUrl: RPC_URL,
    });
    const groupId = getVaultGroupId(id);
    const transactions = await sdk.getTransactionsForGroup(groupId, id);
    return NextResponse.json({ transactions });
  } catch {
    return NextResponse.json({ transactions: [] });
  }
}
