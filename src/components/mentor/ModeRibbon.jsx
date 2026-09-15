import { 
  Menu
} from "lucide-react"

export function ModeRibbon({ onToggleHistory }) {
  return (
    <div className="w-full md:hidden bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 flex items-center justify-between gap-4 shadow-[0_1px_8px_rgba(0,0,0,0.3)] sticky top-0 z-10">
      <div className="flex items-center gap-2 py-1">
        <button 
          onClick={onToggleHistory}
          className="md:hidden px-2.5 py-1.5 rounded-lg bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all flex items-center justify-center shrink-0"
        >
          <Menu size={18} />
        </button>
        <span className="font-heading font-semibold text-sm md:hidden ml-2 text-on-surface">AI Mentor</span>
      </div>
    </div>
  )
}
