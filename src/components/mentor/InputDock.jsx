"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Paperclip, 
  Mic, 
  Sparkles,
  Loader2,
  X,
  Check
} from "lucide-react"

export function InputDock({ onSendMessage, isLoading }) {
  const [text, setText] = useState("")
  const [attachedFile, setAttachedFile] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [preRecordingText, setPreRecordingText] = useState("")
  const [voiceLang, setVoiceLang] = useState("en-IN")
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`
    }
  }, [text])

  const handleSend = () => {
    if ((!text.trim() && !attachedFile) || isLoading) return
    
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
    
    let finalMessage = text
    if (attachedFile) {
      const fileContext = `\n\n--- Attached File: ${attachedFile.name} ---\n\`\`\`\n${attachedFile.content}\n\`\`\`\n---`
      finalMessage = text ? `${text}${fileContext}` : fileContext.trim()
    }

    onSendMessage(finalMessage)
    setText("")
    setAttachedFile(null)
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 100 * 1024) {
      alert("File is too large. Please select a file under 100KB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setAttachedFile({
        name: file.name,
        content: event.target.result
      })
    }
    reader.onerror = () => {
      alert("Error reading file")
    }
    reader.readAsText(file)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = () => {
    setAttachedFile(null)
  }

  const TECH_TERMS = {
    'javascript': 'JavaScript',
    'java': 'Java',
    'mongodb': 'MongoDB',
    'github': 'GitHub',
    'react': 'React',
    'next.js': 'Next.js',
    'nextjs': 'Next.js',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'html': 'HTML',
    'css': 'CSS',
    'api': 'API',
    'ai': 'AI'
  }

  const normalizeTranscription = (text, isNewSentence) => {
    const tokens = text.split(/(\s+)/)
    let processed = tokens.map(token => {
      if (!token.trim()) return token
      
      const lower = token.toLowerCase()
      // Remove trailing punctuation for dictionary lookup
      const cleanLower = lower.replace(/[.,!?]+$/, '')
      
      if (TECH_TERMS[cleanLower]) {
        // Restore trailing punctuation if it was stripped
        return TECH_TERMS[cleanLower] + token.slice(cleanLower.length)
      }
      
      if (token === token.toUpperCase() && token.length > 1 && /[A-Z]/.test(token)) {
        return token
      }
      
      return lower
    }).join('')

    if (isNewSentence) {
      const firstAlphaIdx = processed.search(/[a-zA-Z]/)
      if (firstAlphaIdx !== -1) {
        processed = processed.substring(0, firstAlphaIdx) + 
                    processed.charAt(firstAlphaIdx).toUpperCase() + 
                    processed.substring(firstAlphaIdx + 1)
      }
    }

    return processed
  }

  const startListening = () => {
    if (isListening) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.")
      return
    }

    setPreRecordingText(text)

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = voiceLang 
    
    recognition.onresult = (event) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' '
        }
      }
      if (finalTranscript) {
        setText(prev => {
          const isNewSentence = !prev || /[\.\?\!\n]\s*$/.test(prev)
          const newlySpoken = normalizeTranscription(finalTranscript, isNewSentence)
          const prefix = prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? prev + ' ' : prev
          return prefix + newlySpoken
        })
      }
    }
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const cancelListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setText(preRecordingText)
    setIsListening(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Enter to send, Shift+Enter for new line
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="w-full sticky bottom-4 z-30 pt-4 px-6 lg:px-10 pb-4 max-w-6xl mx-auto">
      <div className="p-4 rounded-2xl bg-surface-container/90 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col gap-2 border border-outline-variant/30">
        {/* Context Toggle Strip & Attachment */}
        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center gap-2 min-h-[24px]">
            {attachedFile && (
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-on-surface text-xs font-mono">
                <Paperclip size={12} className="text-primary" />
                <span className="truncate max-w-[200px]">{attachedFile.name}</span>
                <button onClick={removeAttachment} className="hover:text-error text-on-surface-variant transition-colors ml-1">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant font-mono text-[11px]">
            <span className="font-semibold opacity-50">Tokens: {text.length}</span>
          </div>
        </div>

        {/* Textarea Input Area */}
        <div className="relative w-full">
          <textarea 
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full bg-surface-container-lowest/90 text-on-surface placeholder:text-outline font-body text-[14px] rounded-xl p-4 focus:outline-none resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-outline-variant/20 focus:border-primary/50 transition-colors disabled:opacity-50 overflow-y-auto" 
            style={{ minHeight: "56px", maxHeight: "250px" }}
            placeholder={isListening ? "Listening..." : "Ask an architectural follow-up, paste a stack trace, or enter /refactor command..."}
            rows={1}
          ></textarea>
        </div>

        {/* Bottom Action Deck */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors disabled:opacity-50" 
              title="Attach File or Code Snippet" 
              disabled={isLoading}
            >
              <Paperclip size={18} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept=".js,.jsx,.ts,.tsx,.html,.css,.json,.md,.txt,.log"
            />
            {isListening ? (
              <div className="flex items-center gap-1 bg-red-500/10 rounded-lg p-1 border border-red-500/20 animate-pulse">
                <button 
                  onClick={stopListening}
                  className="p-1.5 rounded-md bg-transparent text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Done"
                  aria-label="Done"
                >
                  <Check size={16} />
                </button>
                <button 
                  onClick={cancelListening}
                  className="p-1.5 rounded-md bg-transparent text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                  title="Cancel"
                  aria-label="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <select 
                  value={voiceLang}
                  onChange={(e) => setVoiceLang(e.target.value)}
                  disabled={isListening || isLoading}
                  className="bg-surface-container-high text-on-surface-variant hover:text-on-surface text-[11px] font-mono rounded-lg px-2 py-2 outline-none cursor-pointer transition-colors disabled:opacity-50 appearance-none"
                  title="Voice Language"
                >
                  <option value="en-IN">en-IN</option>
                  <option value="hi-IN">hi-IN</option>
                </select>
                <button 
                  onClick={startListening}
                  className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors disabled:opacity-50"
                  title="Voice Prompt" 
                  disabled={isLoading}
                >
                  <Mic size={18} />
                </button>
              </>
            )}
            <span className="hidden md:inline-block font-mono text-[11px] text-outline pl-2">
              Shift + Enter for new line
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSend}
              disabled={(!text.trim() && !attachedFile) || isLoading}
              className="px-5 py-2.5 rounded-xl bg-primary text-[#060911] font-heading text-sm flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(76,215,246,0.5)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>{isLoading ? "Running..." : "Run / Ask AI"}</span>
              <span className="px-1.5 py-0.5 rounded bg-[#060911]/20 font-mono text-[11px] ml-1">↵</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
