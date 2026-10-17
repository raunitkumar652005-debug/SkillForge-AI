import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  primary: "bg-gradient-to-r from-primary via-[#8A7CFF] to-[#7A6DF4] text-[#0B1020] font-bold hover:scale-[1.01] hover:shadow-[0_0_18px_rgba(145,133,255,0.35)] transition-all",
  secondary: "bg-[#151D32]/80 border border-outline-variant/60 text-[#F4F6FC] hover:border-primary/80 hover:bg-primary/10 transition-all",
  outline: "bg-[#151D32]/60 border border-outline-variant/50 text-[#F4F6FC] hover:bg-surface-bright hover:border-primary/50 transition-all",
  monospace: "h-[28px] font-mono text-xs bg-surface-bright border border-outline-variant text-on-surface hover:border-primary transition-colors px-2",
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
