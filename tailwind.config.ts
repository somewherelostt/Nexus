import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        /* Legacy semantic (kept for compatibility) */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          glow: "hsl(var(--accent-glow))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        alert: {
          DEFAULT: "hsl(var(--alert))",
          foreground: "hsl(var(--alert-foreground))",
        },
        border: "hsl(var(--border, 0 0% 100% / 0.1))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        /* Origin palette */
        origin: {
          background: "var(--origin-background)",
          surface: "var(--origin-surface)",
          "surface-highlight": "var(--origin-surface-highlight)",
          "border-dim": "var(--origin-border-dim)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "nexus-gradient": "linear-gradient(to right, #8B5CF6, #EC4899, #00D4FF)",
        "origin-accent": "linear-gradient(to right, #A855F7, #EC4899)",
        "origin-accent-hover": "linear-gradient(to right, #A855F7, #EC4899, #F97316)",
        "nexus-radial": "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.15), transparent 60%)",
        "origin-header": "linear-gradient(90deg, rgba(168,85,247,0.12), rgba(236,72,153,0.08))",
      },
      boxShadow: {
        "nexus-glow": "0 0 20px rgba(168, 85, 247, 0.25)",
        "nexus-glow-sm": "0 0 10px rgba(168, 85, 247, 0.15)",
        "origin-border-glow": "0 2px 0 0 transparent",
        "origin-btn-hover": "0 2px 0 0 rgba(168, 85, 247, 0.5), 0 0 12px rgba(168, 85, 247, 0.15)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
