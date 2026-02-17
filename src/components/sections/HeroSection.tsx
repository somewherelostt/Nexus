"use client";

import { motion } from "framer-motion";
import { NexusButton } from "@/components/ui/NexusButton";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center md:flex-row md:justify-between px-4 md:px-0 overflow-hidden">
      
      {/* Background radial gradient for the "Lighting Strategy" */}
      <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-nexus-radial opacity-40 pointer-events-none z-0" />

      {/* Left: Content */}
      <div className="z-10 flex flex-col items-start max-w-2xl space-y-8 md:pr-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent-foreground/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Nexus Protocol V1.0 Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] text-foreground">
            Private <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Multi-Chain
            </span> <br />
            Execution.
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
        >
          Orchestrate complex DeFi operations across chains with localized AI privacy. 
          Zero data leaks. Verifiable execution.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/chat">
            <NexusButton variant="primary" size="lg" className="group">
              Launch Assistant
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </NexusButton>
          </Link>
          
          <NexusButton variant="secondary" size="lg">
            View Architecture
            <Terminal className="ml-2 w-4 h-4 text-muted-foreground" />
          </NexusButton>
        </motion.div>
      </div>

      {/* Right: Abstract Luminous Ring (Placeholder for 3D element) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="relative mt-20 md:mt-0 z-10 w-full max-w-[500px] aspect-square flex items-center justify-center"
      >
        {/* Ring Layers */}
        <div className="absolute inset-0 rounded-full border border-accent/20 animate-[spin_10s_linear_infinite]" />
        <div className="absolute inset-[10%] rounded-full border border-accent/10 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
        <div className="absolute inset-[20%] rounded-full border border-white/5 animate-[pulse_4s_ease-in-out_infinite]" />
        
        {/* Central Core */}
        <div className="w-32 h-32 rounded-full bg-accent/10 blur-3xl" />
        <div className="w-16 h-16 rounded-full bg-accent/20 blur-xl" />
        
      </motion.div>

    </section>
  );
}
