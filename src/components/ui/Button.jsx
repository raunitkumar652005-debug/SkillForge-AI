import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  primary: "bg-gradient-to-br from-primary to-[#3B82F6] text-[#060911] font-black hover:scale-[1.01] hover:shadow-[0_0_16px_rgba(6,182,212,0.4)] transition-all",
  secondary: "bg-[#131d31]/60 border border-[#334155] text-[#F8FAFC] hover:border-primary hover:bg-primary/10 transition-all",
  monospace: "h-[28px] font-mono text-xs bg-surface-bright border border-[#334155] text-on-surface hover:border-primary transition-colors px-2",
  ghost: "hover:bg-surface-bright text-on-surface-variant hover:text-on-surface transition-colors"
}

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant !== "monospace" && size === "default" && "h-10 px-4 py-2",
          variant !== "monospace" && size === "sm" && "h-9 rounded-md px-3",
          variant !== "monospace" && size === "lg" && "h-11 rounded-md px-8",
          variant !== "monospace" && size === "icon" && "h-10 w-10",
          buttonVariants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
