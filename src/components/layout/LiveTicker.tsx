"use client";

import { useQuery } from "@tanstack/react-query";

const GAS_ESTIMATE = "~0.00025";

export function LiveTicker() {
  const { data: nearPrice } = useQuery({
    queryKey: ["near-price"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=near-protocol&vs_currencies=usd"
      );
      const data = await res.json();
      return (data?.["near-protocol"]?.usd as number) ?? 0;
    },
    staleTime: 60_000,
  });

  return (
    <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-white/70">
      <span className="flex items-center gap-1.5">
        <span className="text-white/50">NEAR</span>
        <span className="text-white font-medium tabular-nums">
          ${nearPrice != null ? nearPrice.toFixed(2) : "—"}
        </span>
      </span>
      <span className="h-3 w-px bg-white/20" aria-hidden />
      <span className="flex items-center gap-1.5">
        <span className="text-white/50">Gas</span>
        <span className="text-emerald-400/90 font-medium tabular-nums">
          {GAS_ESTIMATE} NEAR
        </span>
      </span>
    </div>
  );
}
