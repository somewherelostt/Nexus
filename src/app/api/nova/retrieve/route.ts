import { NextRequest, NextResponse } from "next/server";
import { NovaSdk } from "nova-sdk-js";
import { isEvmAddress } from "@/lib/vault-nova";

const NOVA_API_KEY = (
  process.env.NOVA_API_KEY ?? process.env.NEXT_PUBLIC_NOVA_API_KEY ?? ""
).trim();
const CONTRACT_ID =
  (process.env.NEXT_PUBLIC_NOVA_CONTRACT_ID ?? "").trim() || "nova-sdk.near";
const RPC_URL =
  process.env.NEXT_PUBLIC_NEAR_NODE_URL ?? "https://rpc.testnet.near.org";

export async function POST(request: NextRequest) {
  if (!NOVA_API_KEY) {
    return NextResponse.json(
      { error: "NOVA is not configured. Set NOVA_API_KEY in .env." },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const { accountId, groupId, ipfsHash } = body as {
      accountId?: string;
      groupId?: string;
      ipfsHash?: string;
    };
    if (!accountId?.trim() || !groupId?.trim() || !ipfsHash?.trim()) {
      return NextResponse.json(
        { error: "Missing accountId, groupId, or ipfsHash" },
        { status: 400 }
      );
    }
    const id = accountId.trim();
    if (isEvmAddress(id)) {
      return NextResponse.json(
        { error: "NOVA vault requires a NEAR account. Connect a NEAR wallet to view files." },
        { status: 400 }
      );
    }
    const sdk = new NovaSdk(id, {
      apiKey: NOVA_API_KEY,
      contractId: CONTRACT_ID,
      rpcUrl: RPC_URL,
    });
    const result = await sdk.retrieve(groupId!.trim(), ipfsHash!.trim());
    const bytes = Buffer.isBuffer(result.data)
      ? result.data
      : Buffer.from(result.data as ArrayBuffer);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="vault-${ipfsHash.slice(0, 8)}.bin"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Retrieve failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
