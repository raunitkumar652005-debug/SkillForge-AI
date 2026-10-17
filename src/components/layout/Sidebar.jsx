"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Bot, 
  BrainCircuit, 
  Video, 
  BookOpen, 
  FolderGit2, 
  LineChart, 
  Settings,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react"
import { BrandLogo } from "@/components/ui/BrandLogo"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "AI Mentor", href: "/mentor", icon: Bot },
    { name: "Quiz Mode", href: "/quiz", icon: BrainCircuit },
    { name: "Mock Interview", href: "/interview", icon: Video },
    { name: "Revision", href: "/revision", icon: BookOpen },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Learning", href: "/learning", icon: GraduationCap },
    { name: "Analytics", href: "/analytics", icon: LineChart },
    { name: "Pricing & Plans", href: "/pricing", icon: Sparkles },
  ]

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-40 w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-bright border border-outline-variant/30 glass transition-colors"
        title="Open Navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        ${isCollapsed ? 'md:w-20' : 'md:w-64'} 
        w-64
        fixed md:static inset-y-0 left-0 z-50
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        glass flex-shrink-0 border-r border-outline-variant/30 
        flex flex-col group/sidebar
      `}>
        
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute right-4 top-5 text-on-surface-variant hover:text-primary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Collapse Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-6 w-6 h-6 bg-surface border border-outline-variant/30 rounded-full items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors z-20 shadow-sm"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="h-16 flex items-center border-b border-outline-variant/30 overflow-hidden">
          <Link
            href="/"
            className={`flex items-center ${isCollapsed ? 'md:px-0 md:justify-center px-6 w-full' : 'px-6 w-full'} transition-opacity hover:opacity-90`}
          >
            <BrandLogo size="md" collapsed={isCollapsed} />
          </Link>
        </div>
      <div className={`flex-1 py-6 space-y-1 overflow-y-auto ${isCollapsed ? 'md:px-2 px-4' : 'px-4'}`}>
        <div className={`text-xs font-mono font-medium text-on-surface-variant mb-4 px-2 uppercase tracking-widest truncate ${isCollapsed ? 'md:hidden' : ''}`}>
          Platform Tools
        </div>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 py-2 rounded-md text-sm font-medium text-on-surface hover:bg-primary/10 hover:text-primary transition-colors group ${isCollapsed ? 'md:px-0 md:justify-center px-3' : 'px-3'}`}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon size={18} className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
            <span className={`truncate ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
          </Link>
        ))}
      </div>
      <div className={`p-4 border-t border-outline-variant/30 ${isCollapsed ? 'md:flex md:justify-center md:px-2 px-4' : 'px-4'}`}>
        <Link
          href="/settings"
          className={`flex items-center gap-3 py-2 rounded-md text-sm font-medium text-on-surface hover:bg-surface-bright transition-colors ${isCollapsed ? 'md:px-0 md:justify-center md:w-auto w-full px-3' : 'px-3'}`}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings size={18} className="text-on-surface-variant shrink-0" />
          <span className={`truncate ${isCollapsed ? 'md:hidden' : ''}`}>Settings</span>
        </Link>
      </div>
    </div>
    </>
  )
}
