import { NextResponse } from "next/server";

/** Prefer server-only key; fall back to public so existing .env works. */
function getNovaApiKey(): string {
  return (
    (process.env.NOVA_API_KEY ?? process.env.NEXT_PUBLIC_NOVA_API_KEY ?? "").trim()
  );
}

/**
 * Returns whether NOVA is configured (API key set in .env).
 * Client uses this to show/hide Encrypt & Store.
 */
export async function GET() {
  const enabled = !!getNovaApiKey();
  return NextResponse.json({ enabled });
}
