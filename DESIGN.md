---
name: Obsidian Cybernetic
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ddb7ff'
  on-tertiary: '#490080'
  tertiary-container: '#c78dff'
  on-tertiary-container: '#5a009b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  gutter-sm: 1rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies a cinematic, hyper-refined developer intelligence terminal. Designed for professional engineers, technical architects, and builders, it balances computational precision with an immersive void aesthetic. The interface evokes mastery, focus, and quiet computational power—reminiscent of high-end speculative engineering environments rather than noisy gaming dashboards.

The visual direction blends **Technical Minimalism** with **Controlled Glassmorphism and Ambient Luminescence**:
- Deep obsidian and void-slate foundations eliminate visual fatigue during sustained coding sessions.
- Translucent surface layers with high-density backdrop blurs communicate spatial architecture without feeling decorative.
- Laser-guided luminous accents (electric cyan, cobalt indigo, and spectral violet) draw deliberate focal hierarchy to real-time agent output, token consumption, and code diagnostics.
- Crisp vector edges and micro-bevel highlights project a tangible, machined instrument feel.

## Colors

The palette operates on a calibrated luminance model tailored exclusively for dark surfaces:

- **Canvas & Void Substrates:** The base surface (`#060911`) and default canvas (`#0B0F19`) anchor the view. Elevated layers step up through precise slate steps (`#111827`, `#131D31`).
- **Primary (Electric Cyan - `#06B6D4` / `#22D3EE`):** Signifies live inference, interactive runtime controls, AI suggestions, and primary actions.
- **Secondary (Cobalt / Indigo - `#6366F1` / `#3B82F6`):** Governs structural technical components, secondary actions, and pipeline workflows.
- **Tertiary (Spectral Violet - `#A855F7` / `#8B5CF6`):** Designates multi-model synthesis, heuristic scores, and neural agent metrics.
- **Micro-Borders & Separation:** Borders never use pure white or solid flat gray; they employ alpha-channel slate (`#1E293B` at 60–80% or `#334155` at 40%) with directional 1px linear gradients simulating overhead light glancing across glass edges.
- **Functional Semantics:**
  - Success/Valid: Emerald (`#10B981`)
  - Warning/Refactor: Amber (`#F59E0B`)
  - Error/Breakage: Crimson (`#EF4444`)

## Typography

The typographic hierarchy enforces a disciplined dual-system pairing:

1. **Geometric Humanist Sans (`Plus Jakarta Sans` & `Inter`):** Drives editorial titles, card headers, and long-form narrative feedback from the AI mentor. Tight letter tracking (`-0.01em` to `-0.03em`) lends headlines an authoritative, engineered cadence.
2. **Precision Monospace (`JetBrains Mono`):** Applied to telemetry parameters, metadata tags, commit SHAs, file directories, syntax outputs, and metric flags. The letterforms ensure strict tabular alignment for numerical data streams.

## Layout & Spacing

This design system uses a responsive 12-column structural grid system built on an 8pt architectural rhythm, with a supplementary 4pt sub-grid for dense console interfaces.

- **Desktop (>= 1280px):** 12 columns, 24px (`1.5rem`) gutters, 32px (`2rem`) margins. Max container constraint of 1440px for editorial views; full-width fluid layouts for IDE split-views and AST graph inspect windows.
- **Tablet (768px – 1279px):** 8 columns, 16px (`1rem`) gutters, 24px (`1.5rem`) margins. Side panels collapse into dockable drawers.
- **Mobile (< 768px):** 4 columns, 16px (`1rem`) gutters, 16px (`1rem`) margins. Stacked single-column layouts with horizontal swipe strips for telemetry counters.

## Elevation & Depth

Spatial layering relies on translucent glass planes and ambient light physics rather than blunt, drop-shadowed drop-offs.

- **Layer 0 (Canvas Base):** Deep void `#060911` with an optional micro-grain mesh texture (1.5% opacity) to eliminate pixel banding.
- **Layer 1 (Panels & Shells):** `#0B0F19` with 90% opacity, `backdrop-filter: blur(16px)`, outlined by a 1px border of `#1E293B` (opacity 0.6).
- **Layer 2 (Elevated Glass Cards & Modals):** `#111827` at 75% opacity, `backdrop-filter: blur(24px)`. Key highlight: a top-edge inner stroke gradient transitioning from `rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.0)`. Ambient shadow: `0 16px 32px -8px rgba(0, 0, 0, 0.6)`.
- **Layer 3 (Active Focus & AI Glow):** Applied to active terminal instances, focused inputs, or processing nodes. Accented with directional colored glows:
  - Primary Active: `0 0 24px -4px rgba(6, 182, 212, 0.25), 0 0 0 1px rgba(6, 182, 212, 0.5)`
  - Neural Synthesis Active: `0 0 24px -4px rgba(168, 85, 247, 0.25), 0 0 0 1px rgba(168, 85, 247, 0.5)`

## Shapes

The design system adopts a **Soft (Level 1)** geometry language. Radii remain tight and deliberate (`0.25rem` / 4px base, `0.5rem` / 8px for cards, `0.75rem` / 12px for floating panels). This restrained curvature communicates structural solidity, avoiding the toy-like softness of bulbous radii while escaping the starkness of brutalist zero-radius rectangles.

## Components

### Buttons
- **Primary Action:** Solid cyan-to-indigo gradient fill (`linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)`), text `#060911` (900 weight) for instant contrast. On hover: subtle scale (`1.01`) and an outer photon aura (`box-shadow: 0 0 16px rgba(6, 182, 212, 0.4)`).
- **Secondary / Ghost:** Glass fill (`rgba(19, 29, 49, 0.6)`), 1px border (`#334155`), text `#F8FAFC`. On hover: border turns `#06B6D4` with surface tint `rgba(6, 182, 212, 0.08)`.
- **Monospace Tool Action:** 28px height, `JetBrains Mono` label, flat background with 1px border. Dedicated to git triggers, terminal clears, and diff reverts.

### Chips & Status Badges
- Constructed with `JetBrains Mono` at `label-sm` sizing.
- Pill shape or 4px soft radius containing a 6px pulsating circular beacon indicating model state (e.g., green for `AST Parsed`, cyan for `Agent Generating`, violet for `Optimizing`).
- Background: 12% alpha-fill matching the status color with a 30% alpha-border.

### Cards & Container Panels
- Glass-backed containers with hairline separation borders.
- Card headers feature an integrated toolbar line with muted monospace metadata (e.g., `MEMORY: 24MB`, `LATENCY: 180ms`) alongside human-readable titles.
- Hover states on interactive cards trigger a gradient shift across the border, flowing light along the card edge.

### Code Diffs & Diagnostic Terminal
- Custom syntax-highlighted block using `JetBrains Mono`.
- Background `#080C14`, inset 1px border `#1E293B`.
- Gutter displays line numbers in muted gray (`#475569`), with inline diff insertions tinted with `rgba(16, 185, 129, 0.12)` and deletions with `rgba(239, 68, 68, 0.12)`.

### Inputs & Prompt Interface
- Deep inset glass background (`#080C14`), border `#1E293B`, placeholder text `#475569`.
- Focused state features an instantaneous border illumination to cyan (`#06B6D4`) paired with an inner shadow and keyboard command hint badge (`⌘ + ↵`) docked on the right.

### Checkboxes & Radio Controls
- Geometric square and circular selectors with 1px slate borders (`#334155`).
- Active state renders a solid cyan check or dot accompanied by an ambient micro-glow.
