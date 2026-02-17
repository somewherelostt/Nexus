import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NexusAI",
  description: "Private Multi-Chain Execution Assistant",
};

import { WalletProvider } from "@/context/WalletContext";
import { Navigation } from "@/components/layout/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.variable, "font-sans antialiased bg-background text-foreground min-h-screen selection:bg-accent/30")}>
        <WalletProvider>
             <Navigation />
             <main className="container mx-auto px-4 md:px-6 pt-20">
                {children}
             </main>
        </WalletProvider>
      </body>
    </html>
  );
}
