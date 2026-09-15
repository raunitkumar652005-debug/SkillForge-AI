import { Bot, Network, Zap, Shield, Sparkles, User, Loader2 } from "lucide-react"
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer"

export function ConversationStage({ messages = [], isLoading = false }) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 max-w-3xl mx-auto w-full h-full text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_32px_rgba(76,215,246,0.3)] border border-primary/30">
          <Bot size={32} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-on-surface">How can I assist you today?</h1>
          <p className="font-body text-on-surface-variant max-w-lg mx-auto">
            I am ready to review your architecture, pair program, explain deep concepts, or help debug complex issues.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-6">
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col items-start text-left gap-2">
            <Network size={20} className="text-primary" />
            <span className="font-heading text-sm font-semibold text-on-surface">Architectural Review</span>
            <span className="font-body text-xs text-on-surface-variant">Analyze my system design for bottlenecks.</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col items-start text-left gap-2">
            <Zap size={20} className="text-tertiary" />
            <span className="font-heading text-sm font-semibold text-on-surface">Code Refactoring</span>
            <span className="font-body text-xs text-on-surface-variant">Help me optimize this component.</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col items-start text-left gap-2">
            <Shield size={20} className="text-secondary" />
            <span className="font-heading text-sm font-semibold text-on-surface">Security Audit</span>
            <span className="font-body text-xs text-on-surface-variant">Check my code for common vulnerabilities.</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col items-start text-left gap-2">
            <Sparkles size={20} className="text-emerald-400" />
            <span className="font-heading text-sm font-semibold text-on-surface">Generate Boilerplate</span>
            <span className="font-body text-xs text-on-surface-variant">Scaffold a new feature quickly.</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-4xl mx-auto w-full gap-6 pb-32">
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
            msg.role === 'user' 
              ? 'bg-surface-bright text-on-surface' 
              : 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_12px_rgba(76,215,246,0.2)]'
          }`}>
            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          
          {/* Message Bubble */}
          <div className={`max-w-[85%] rounded-2xl p-5 ${
            msg.role === 'user'
              ? 'bg-surface-container text-on-surface rounded-tr-sm border border-outline-variant/20'
              : 'bg-surface-container-lowest text-on-surface rounded-tl-sm border border-primary/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          }`}>
            {msg.role === 'user' ? (
              <div className="whitespace-pre-wrap font-body text-[15px] leading-relaxed text-on-surface-variant">
                {msg.content}
              </div>
            ) : (
              <MarkdownRenderer content={msg.content} />
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex gap-4">
          <div className="w-8 h-8 mt-1 rounded-full bg-primary/20 text-primary border border-primary/30 shadow-[0_0_12px_rgba(76,215,246,0.2)] flex items-center justify-center shrink-0">
            <Bot size={16} />
          </div>
          <div className="max-w-[80%] rounded-2xl p-4 bg-surface-container-low text-on-surface-variant rounded-tl-sm border border-outline-variant/10 flex items-center gap-3">
            <Loader2 size={16} className="animate-spin text-primary" />
            <span className="text-sm font-mono animate-pulse">Neural inference active...</span>
          </div>
        </div>
      )}
    </div>
  )
}
