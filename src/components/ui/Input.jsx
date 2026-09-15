import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-outline-variant bg-[#080C14] px-3 py-2 text-sm text-on-surface ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#475569] focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_0_8px_rgba(6,182,212,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
