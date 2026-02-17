import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NexusAI",
  description: "Private Multi-Chain Execution Assistant",
};

import { config } from "@/config/wagmi";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { ContextProvider } from "@/context/ContextProvider";

import { WalletProvider } from "@/context/WalletContext";
import { AppShell } from "@/components/layout/AppShell";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(inter.variable, jetbrainsMono.variable, "font-sans antialiased bg-[var(--origin-background)] text-foreground min-h-screen selection:bg-accent/30")} suppressHydrationWarning>
        <ContextProvider initialState={initialState}>
            <WalletProvider>
                 <OnboardingModal />
                 <AppShell>{children}</AppShell>
            </WalletProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
