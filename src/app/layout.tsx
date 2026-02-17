import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
      <body className={cn(inter.variable, outfit.variable, "font-sans antialiased bg-background text-foreground min-h-screen")}>
        <WalletProvider>
             <Navigation />
             <main className="container mx-auto p-4">
                {children}
             </main>
        </WalletProvider>
      </body>
    </html>
  );
}
