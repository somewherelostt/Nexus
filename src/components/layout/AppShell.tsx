"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[var(--origin-background)]">
      <Sidebar />
      <div className="flex-1 ml-20 flex flex-col min-h-screen relative">
        <TopBar />
        <main className="flex-1 px-6 pt-24 pb-12 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
