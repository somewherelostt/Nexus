import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  noHover?: boolean
}

// Using framer-motion for smooth hover effects
const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  ({ className, children, noHover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative group rounded-[20px] border border-white/10 bg-card p-8 md:p-10",
          "transition-all duration-300 ease-out",
          !noHover && "hover:border-accent/30 hover:shadow-nexus-glow-sm",
          className
        )}
        {...props}
      >
        {/* Subtle background gradient shift on hover */}
        {!noHover && (
          <div 
            className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
            aria-hidden="true"
          />
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
GlowCard.displayName = "GlowCard"

export { GlowCard }
