import { Search, Bell, Terminal } from "lucide-react"
import { Badge } from "@/components/ui/Badge"

export function TopBar() {
  return (
    <header className="h-16 glass-card rounded-none border-b border-outline-variant/30 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        {/* Search removed as per user request */}
      </div>
      <div className="flex items-center gap-4">
        <Badge status="info" className="hidden sm:inline-flex">
          <Terminal size={12} className="mr-1" />
          Agent Ready
        </Badge>
        <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-bright transition-colors text-on-surface-variant hover:text-on-surface relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-bright border border-outline-variant flex items-center justify-center overflow-hidden">
          <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Dev" alt="User Avatar" />
        </div>
      </div>
    </header>
  )
}
