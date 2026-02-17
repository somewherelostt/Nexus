import { NextRequest, NextResponse } from "next/server";

const NEAR_RPC_URL =
  process.env.NEXT_PUBLIC_NEAR_NODE_URL || "https://rpc.testnet.fastnear.com";

/** Proxy NEAR view_account RPC to avoid CORS / "Failed to fetch" from the browser. */
export async function GET(request: NextRequest) {
  const accountId = request.nextUrl.searchParams.get("accountId");
  if (!accountId?.trim()) {
    return NextResponse.json(
      { error: "Missing accountId" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(NEAR_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "balance",
        method: "query",
        params: {
          request_type: "view_account",
          finality: "final",
          account_id: accountId.trim(),
        },
      }),
    });
    const data = await res.json();

    if (data.error) {
      if (data.error.message?.includes("does not exist")) {
        return NextResponse.json({ balance: 0 });
      }
      return NextResponse.json(
        { error: data.error.message || "RPC error" },
        { status: 502 }
      );
    }

    const amount = data.result?.amount ?? "0";
    const balance = Number(amount) / 1e24;
    return NextResponse.json({ balance });
  } catch (err) {
    console.error("NEAR balance proxy error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch balance" },
      { status: 502 }
    );
  }
}
