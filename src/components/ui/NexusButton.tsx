import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-mono uppercase tracking-widest transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-white/20 bg-white/5 text-white hover:border-white/30 hover:shadow-[0_2px_0_0_rgba(168,85,247,0.3)]",
        primary:
          "border border-[#A855F7]/40 bg-[#A855F7]/10 text-[#A855F7] hover:border-[#A855F7]/60 hover:shadow-[0_2px_0_0_rgba(168,85,247,0.5)] hover:shadow-[#A855F7]/20",
        secondary:
          "border border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20 hover:text-white",
        ghost: "text-white/70 hover:text-white hover:bg-white/5",
        destructive:
          "border border-red-500/30 text-red-400 hover:border-red-500/50 hover:shadow-[0_2px_0_0_rgba(239,68,68,0.3)]",
        link: "text-[#A855F7] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const NexusButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NexusButton.displayName = "NexusButton";

export { NexusButton, buttonVariants };
