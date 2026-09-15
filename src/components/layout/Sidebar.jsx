"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Bot, 
  BrainCircuit, 
  Video, 
  Bug, 
  BookOpen, 
  FolderGit2, 
  LineChart, 
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "AI Mentor", href: "/mentor", icon: Bot },
    { name: "Quiz Mode", href: "/quiz", icon: BrainCircuit },
    { name: "Mock Interview", href: "/interview", icon: Video },
    { name: "Debugging", href: "/debugging", icon: Bug },
    { name: "Revision", href: "/revision", icon: BookOpen },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Learning", href: "/learning", icon: GraduationCap },
    { name: "Analytics", href: "/analytics", icon: LineChart },
  ]

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 glass flex-shrink-0 border-r border-outline-variant/30 hidden md:flex flex-col relative group/sidebar`}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-surface border border-outline-variant/30 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors z-20 shadow-sm"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="h-16 flex items-center justify-center border-b border-outline-variant/30 overflow-hidden">
        <div className={`flex items-center gap-3 text-primary font-heading font-bold text-lg tracking-tight ${isCollapsed ? 'px-0' : 'px-6 w-full'}`}>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary-container flex items-center justify-center shrink-0">
            <Bot size={20} className="text-[#060911]" />
          </div>
          {!isCollapsed && <span className="truncate whitespace-nowrap">WebDev Mentor</span>}
        </div>
      </div>
      <div className={`flex-1 py-6 space-y-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {!isCollapsed && (
          <div className="text-xs font-mono font-medium text-on-surface-variant mb-4 px-2 uppercase tracking-widest truncate">
            Platform Tools
          </div>
        )}
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 py-2 rounded-md text-sm font-medium text-on-surface hover:bg-primary/10 hover:text-primary transition-colors group ${isCollapsed ? 'px-0 justify-center' : 'px-3'}`}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon size={18} className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0" />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </Link>
        ))}
      </div>
      <div className={`p-4 border-t border-outline-variant/30 ${isCollapsed ? 'flex justify-center px-2' : ''}`}>
        <Link
          href="/settings"
          className={`flex items-center gap-3 py-2 rounded-md text-sm font-medium text-on-surface hover:bg-surface-bright transition-colors ${isCollapsed ? 'px-0 justify-center w-full' : 'px-3'}`}
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings size={18} className="text-on-surface-variant shrink-0" />
          {!isCollapsed && <span className="truncate">Settings</span>}
        </Link>
      </div>
    </div>
  )
}
