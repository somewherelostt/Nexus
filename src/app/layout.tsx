import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NexusAI",
  description: "Private Multi-Chain Execution Assistant",
};

import { config } from "@/config/wagmi";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { ContextProvider } from "@/context/ContextProvider";

import { WalletProvider } from "@/context/WalletContext";
import { Navigation } from "@/components/layout/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, "font-sans antialiased bg-background text-foreground min-h-screen selection:bg-accent/30")}>
        <ContextProvider initialState={initialState}>
            <WalletProvider>
                 <Navigation />
                 <main className="container mx-auto px-4 md:px-6 pt-20">
                    {children}
                 </main>
            </WalletProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
