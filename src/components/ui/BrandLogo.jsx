import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * SkillForge Developer Icon
 * Combines angled code brackets in Electric Violet (#9185FF)
 * with a high-energy central lightning spark in Neon Teal (#38D9C5).
 */
export function BrandIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      aria-label="SkillForge AI Icon"
    >
      <defs>
        <linearGradient id="sf-spark-grad" x1="13" y1="6" x2="19" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38D9C5" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="sf-bracket-grad" x1="6" y1="10" x2="26" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9185FF" />
          <stop offset="1" stopColor="#7A6DF4" />
        </linearGradient>
      </defs>

      {/* Subtle container squircle */}
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="8"
        fill="#151D32"
        stroke="rgba(145, 133, 255, 0.2)"
        strokeWidth="1.5"
      />

      {/* Left Code Bracket: < */}
      <path
        d="M9.5 11L5.5 16L9.5 21"
        stroke="url(#sf-bracket-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Code Bracket: > */}
      <path
        d="M22.5 11L26.5 16L22.5 21"
        stroke="url(#sf-bracket-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Lightning Spark */}
      <path
        d="M17.5 6.5L12.5 15H17L14.5 25.5L20.5 13.5H16L17.5 6.5Z"
        fill="url(#sf-spark-grad)"
      />
    </svg>
  )
}

/**
 * Reusable Brand Wordmark and Logo
 */
export function BrandLogo({
  size = "md",
  showWordmark = true,
  collapsed = false,
  subtitle = null,
  className = ""
}) {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44,
    xl: 56
  }

  const iconPx = typeof size === "number" ? size : iconSizes[size] || 32

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <BrandIcon size={iconPx} />
      {showWordmark && !collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-heading font-extrabold text-lg tracking-tight text-on-surface">
              Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Forge</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 tracking-widest uppercase">
              AI
            </span>
          </div>
          {subtitle && (
            <span className="text-[11px] font-mono text-on-surface-variant tracking-wide mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
