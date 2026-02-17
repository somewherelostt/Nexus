import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[14px] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-secondary/50 text-primary border border-accent/20 hover:border-accent/50 hover:shadow-nexus-glow-sm hover:bg-secondary",
        primary:
          "bg-background border border-accent/30 text-primary shadow-[0_0_15px_rgba(108,92,231,0.15)] hover:shadow-[0_0_25px_rgba(108,92,231,0.3)] hover:border-accent/60 relative overflow-hidden group",
        secondary:
          "bg-transparent border border-white/10 text-secondary-foreground hover:bg-white/5 hover:text-primary hover:border-white/20",
        ghost: "hover:bg-accent/10 hover:text-accent",
        destructive:
          "bg-transparent border border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive hover:shadow-[0_0_15px_rgba(255,59,59,0.2)]",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-[#6C5CE7] to-[#00D4FF] text-white border-none hover:opacity-90 shadow-nexus-glow"
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-[16px] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const NexusButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // For the primary variant, we can add a subtle internal glow effect if needed
    // but the CSS class handling above usually suffices.
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
NexusButton.displayName = "NexusButton"

export { NexusButton, buttonVariants }
