import { useState } from 'react';
import { Plus, Inbox, MessageSquare, Pencil, Trash2, Check, X } from "lucide-react"

export function ContextRail({ 
  conversations = [], 
  activeConversationId, 
  onSelectConversation, 
  onNewConversation,
  onRenameConversation,
  onDeleteConversation,
  searchQuery,
  onSearchChange,
  isSearching
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleStartEdit = (e, conv) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditTitle(conv.title || 'New Conversation');
  };

  const handleSaveEdit = (e, id) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = (e, id) => {
    e.stopPropagation();
    onDeleteConversation(id);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  return (
    <div className="flex flex-col bg-surface-container-lowest/50 p-6 justify-between gap-6 overflow-y-auto h-full w-full">
      <div className="flex flex-col gap-4">
        {/* Active Conversation Threads */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">Session Threads</span>
            <button 
              onClick={onNewConversation}
              className="text-primary hover:text-primary-fixed transition-colors font-heading text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Plus size={14} /> New
            </button>
          </div>
          
          {/* Search Input */}
          <div className="px-2 pb-2">
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery || ""}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="w-full bg-surface-container-high text-on-surface text-xs px-3 py-1.5 rounded-md border border-outline-variant/30 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-on-surface-variant/50"
            />
          </div>

          <div className="flex flex-col gap-2">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-on-surface-variant border border-dashed border-outline-variant/30 rounded-lg">
                <Inbox size={24} className="mb-2 opacity-50" />
                <span className="font-mono text-xs">
                  {searchQuery ? "No conversations found" : "No active sessions"}
                </span>
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = activeConversationId === conv._id;
                return (
                  <div
                    key={conv._id}
                    onClick={() => {
                      if (editingId !== conv._id && confirmDeleteId !== conv._id) {
                        onSelectConversation(conv._id);
                      }
                    }}
                    className={`group flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                      isActive 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/20'
                    }`}
                  >
                    <MessageSquare size={16} className={`shrink-0 mt-0.5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                      {confirmDeleteId === conv._id ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-error font-medium">Delete conversation?</span>
                          <div className="flex gap-2">
                            <button onClick={(e) => handleConfirmDelete(e, conv._id)} className="text-xs px-2 py-1 bg-error/10 text-error rounded hover:bg-error/20">Yes</button>
                            <button onClick={handleCancelDelete} className="text-xs px-2 py-1 bg-surface-container-high text-on-surface rounded hover:bg-surface-container-highest">No</button>
                          </div>
                        </div>
                      ) : editingId === conv._id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(e, conv._id);
                              if (e.key === 'Escape') handleCancelEdit(e);
                            }}
                            autoFocus
                            className="bg-surface-container-high text-on-surface text-sm px-2 py-1 rounded w-full focus:outline-none focus:ring-1 focus:ring-primary min-w-0"
                          />
                          <button onClick={(e) => handleSaveEdit(e, conv._id)} className="text-primary hover:text-primary-fixed p-1 shrink-0">
                            <Check size={14} />
                          </button>
                          <button onClick={handleCancelEdit} className="text-on-surface-variant hover:text-error p-1 shrink-0">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium truncate ${isActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                            {conv.title || 'New Conversation'}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 xl:hidden group-hover:xl:flex">
                            <button 
                              onClick={(e) => handleStartEdit(e, conv)} 
                              className="text-on-surface-variant hover:text-primary transition-colors p-1"
                              title="Rename"
                            >
                              <Pencil size={12} />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteClick(e, conv._id)} 
                              className="text-on-surface-variant hover:text-error transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {editingId !== conv._id && confirmDeleteId !== conv._id && (
                        <span className="text-[10px] text-on-surface-variant/70 font-mono mt-0.5">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
