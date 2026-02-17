import { NextRequest, NextResponse } from "next/server";
import { NovaSdk } from "nova-sdk-js";
import { getVaultGroupId, isEvmAddress } from "@/lib/vault-nova";

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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const accountId = formData.get("accountId") as string | null;
    if (!file || !accountId?.trim()) {
      return NextResponse.json(
        { error: "Missing file or accountId" },
        { status: 400 }
      );
    }
    const id = accountId.trim();
    if (isEvmAddress(id)) {
      return NextResponse.json(
        {
          error:
            "NOVA vault requires a NEAR account. Connect a NEAR wallet (e.g. My Near Wallet) to use Encrypt & Store.",
        },
        { status: 400 }
      );
    }
    const sdk = new NovaSdk(id, {
      apiKey: NOVA_API_KEY,
      contractId: CONTRACT_ID,
      rpcUrl: RPC_URL,
    });
    const groupId = getVaultGroupId(id);
    try {
      await sdk.registerGroup(groupId);
    } catch {
      // Group may already exist
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await sdk.upload(groupId, buffer, file.name || "file");
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[NOVA upload]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
