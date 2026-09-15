import * as React from "react"
import { cn } from "@/lib/utils"

const statusColors = {
  success: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  warning: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  error: "text-rose-400 bg-rose-400/10 border-rose-400/30",
  info: "text-primary bg-primary/10 border-primary/30",
  neutral: "text-on-surface-variant bg-surface-bright border-outline-variant/30",
}

const dotColors = {
  success: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  warning: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
  error: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
  info: "bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]",
  neutral: "bg-on-surface-variant",
}

function Badge({ className, status = "neutral", children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-mono font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        statusColors[status],
        className
      )}
      {...props}
    >
      <span className="relative flex h-1.5 w-1.5">
        {status !== "neutral" && (
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColors[status].split(' ')[0])}></span>
        )}
        <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColors[status])}></span>
      </span>
      {children}
    </div>
  )
}

export { Badge }
