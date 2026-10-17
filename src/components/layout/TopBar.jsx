import { Sparkles, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { auth, signOut } from "@/auth"
import { NotificationDropdown } from "./NotificationDropdown"

export async function TopBar() {
  const session = await auth();

  return (
    <header className="h-16 glass-card rounded-none border-b border-outline-variant/30 flex items-center justify-between pl-16 md:pl-6 pr-6 z-30 sticky top-0">
      <div className="flex items-center gap-4">
        {/* Search removed as per user request */}
      </div>
      <div className="flex items-center gap-4">
        <Badge status="info" className="hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-on-surface">
          <Sparkles size={12} className="text-secondary mr-1 shrink-0" />
          AI Powered Learning
        </Badge>
        <NotificationDropdown />
        {session?.user && (
          <div className="flex items-center gap-3 ml-2 border-l border-outline-variant/30 pl-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-on-surface leading-none">{session.user.providerName || session.user.name || 'User'}</p>
              <p className="text-[10px] text-on-surface-variant font-mono mt-1">{session.user.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-bright border border-outline-variant flex items-center justify-center overflow-hidden">
              <img src={session.user.providerImage || session.user.image || "https://api.dicebear.com/9.x/avataaars/svg?seed=Dev"} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <form
              action={async () => {
                "use server"
                await signOut({ redirectTo: "/login" })
              }}
            >
              <button title="Sign Out" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-error/10 transition-colors text-on-surface-variant hover:text-error ml-1">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}
