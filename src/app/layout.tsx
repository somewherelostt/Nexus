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
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

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
                 <OnboardingModal />
                 <div className="flex min-h-screen">
                    {/* Sidebar Fixed */}
                    <Sidebar />
                    
                    {/* Main Content Area */}
                    <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
                        {/* Top Bar Fixed/Sticky */}
                         <TopBar />
                         
                        <main className="flex-1 px-8 pt-24 pb-12 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                 </div>
            </WalletProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
