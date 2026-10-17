"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ModeRibbon } from "@/components/mentor/ModeRibbon"
import { ContextRail } from "@/components/mentor/ContextRail"
import { ConversationStage } from "@/components/mentor/ConversationStage"
import { InputDock } from "@/components/mentor/InputDock"

export default function MentorClient() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState("")
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [conversations, setConversations] = useState([])
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true)
  
  // Ref for debouncing
  const searchTimeoutRef = useRef(null)

  const fetchConversationsList = async (query = "") => {
    try {
      const url = query ? `/api/chat/history/all?q=${encodeURIComponent(query)}` : '/api/chat/history/all'
      const res = await fetch(url)
      if (res.status === 403) {
        router.push('/pricing?feature=mentor')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setConversations(data.conversations || [])
      }
    } catch (err) {
      console.error('Failed to load conversations list', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (val) => {
    setSearchQuery(val)
    setIsSearching(true)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchConversationsList(val)
    }, 300)
  }

  const fetchHistory = async (convId = null, isNew = false) => {
    try {
      let url = '/api/chat/history'
      if (isNew) url += '?new=true'
      else if (convId) url += `?conversationId=${convId}`
      
      const response = await fetch(url)
      if (response.status === 403) {
        router.push('/pricing?feature=mentor')
        return
      }
      if (response.ok) {
        const data = await response.json()
        setSessionId(data.sessionId)
        setActiveConversationId(data.conversationId)
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Failed to load history', err)
    }
  }

  useEffect(() => {
    fetchHistory()
    fetchConversationsList(searchQuery)
    
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return

    const userMessage = { role: "user", content: text }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
        }),
      })

      if (response.status === 403) {
        router.push('/pricing?feature=mentor')
        return
      }

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Agent")
      }

      const data = await response.json()
      const aiResponseText = data.response || "No response received."

      setMessages((prev) => [...prev, { role: "ai", content: aiResponseText }])
      
      if (data.conversationId && !activeConversationId) {
        setActiveConversationId(data.conversationId)
      }
      
      // Refresh list to show newly generated titles
      fetchConversationsList(searchQuery)
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "**Error**: Unable to reach the AI Mentor. Please check your network connection." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectConversation = (id) => {
    if (id === activeConversationId) return
    setIsMobileHistoryOpen(false)
    fetchHistory(id)
  }

  const handleNewConversation = async () => {
    setIsMobileHistoryOpen(false)
    await fetchHistory(null, true)
    await fetchConversationsList(searchQuery)
  }

  const handleRenameConversation = async (id, newTitle) => {
    try {
      const res = await fetch(`/api/chat/history/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      });
      if (res.status === 403) {
        router.push('/pricing?feature=mentor');
        return;
      }
      if (res.ok) {
        await fetchConversationsList(searchQuery);
      }
    } catch (err) {
      console.error('Failed to rename conversation', err);
    }
  }

  const handleDeleteConversation = async (id) => {
    try {
      const res = await fetch(`/api/chat/history/${id}`, {
        method: 'DELETE'
      });
      if (res.status === 403) {
        router.push('/pricing?feature=mentor');
        return;
      }
      if (res.ok) {
        if (id === activeConversationId) {
          await handleNewConversation();
        } else {
          await fetchConversationsList(searchQuery);
        }
      } else {
        const errorData = await res.json();
        console.error('Failed to delete conversation on server:', errorData);
        alert('Failed to delete conversation: ' + (errorData.error || res.statusText));
      }
    } catch (err) {
      console.error('Failed to delete conversation locally', err);
      alert('Failed to delete conversation. Check your network.');
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col z-10 bg-background/90 backdrop-blur-3xl overflow-hidden">
      <ModeRibbon onToggleHistory={() => setIsMobileHistoryOpen(!isMobileHistoryOpen)} />
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Desktop/Tablet Context Rail */}
        <div className={`hidden md:flex h-full border-r border-outline-variant/30 shrink-0 transition-all duration-300 ${isDesktopSidebarOpen ? 'w-64 xl:w-80' : 'w-0 overflow-hidden border-none'}`}>
          <div className="w-64 xl:w-80 shrink-0 h-full">
            <ContextRail 
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
              onRenameConversation={handleRenameConversation}
              onDeleteConversation={handleDeleteConversation}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              isSearching={isSearching}
            />
          </div>
        </div>

        {/* Mobile History Drawer */}
        {isMobileHistoryOpen && (
          <div className="absolute inset-0 z-50 md:hidden flex">
            <div className="w-80 max-w-[80vw] h-full bg-surface-container-lowest/95 backdrop-blur-3xl border-r border-outline-variant/30 shadow-2xl flex flex-col">
              <ContextRail 
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={handleNewConversation}
                onRenameConversation={handleRenameConversation}
                onDeleteConversation={handleDeleteConversation}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                isSearching={isSearching}
              />
            </div>
            <div 
              className="flex-1 bg-black/40 backdrop-blur-sm cursor-pointer" 
              onClick={() => setIsMobileHistoryOpen(false)}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-y-auto relative">
          <button 
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="hidden md:flex absolute top-4 left-4 z-20 p-2 rounded-lg bg-surface-container-high/60 backdrop-blur text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all"
            title="Toggle Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>
          
          <ConversationStage messages={messages} isLoading={isLoading} />
          <InputDock onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
