"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const markAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead', notificationId: id })
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async (e) => {
    if (e) e.stopPropagation();
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' })
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const clearNotifications = async (e) => {
    if (e) e.stopPropagation();
    try {
      await fetch('/api/notifications', { method: 'DELETE' });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative flex items-center z-50" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Notifications"
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors relative ${isOpen ? 'bg-surface-bright text-on-surface' : 'text-on-surface-variant hover:bg-surface-bright hover:text-on-surface'}`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)] flex items-center justify-center text-[8px] font-bold text-on-primary">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute top-12 right-0 w-80 sm:w-96 bg-surface-container border border-outline-variant/30 shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-dim/50">
            <h3 className="font-heading font-semibold text-on-surface">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button type="button" onClick={markAllAsRead} className="text-xs text-primary hover:text-primary-variant transition-colors flex items-center gap-1" title="Mark all as read">
                  <CheckCheck size={14} />
                </button>
              )}
              {notifications.length > 0 && (
                <button type="button" onClick={clearNotifications} className="text-xs text-error hover:text-error/80 transition-colors flex items-center gap-1" title="Clear all">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <Bell size={32} className="text-on-surface-variant/30 mb-3" />
                <p className="text-sm font-medium text-on-surface">No notifications</p>
                <p className="text-xs text-on-surface-variant mt-1">You&apos;re all caught up!</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-3 rounded-xl flex gap-3 transition-colors ${notif.read ? 'opacity-70 hover:bg-surface-container' : 'bg-surface-bright/50 border border-primary/20 hover:bg-surface-bright cursor-pointer'}`}
                  onClick={(e) => !notif.read && markAsRead(notif._id, e)}
                >
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-transparent' : 'bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{notif.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-on-surface-variant/70 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
