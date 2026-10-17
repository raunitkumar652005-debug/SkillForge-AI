"use client";

import { useState, useEffect } from 'react';
import { ListTree, ChevronRight, X, ChevronLeft } from 'lucide-react';

export function ModuleTOC({ headings }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && isOpen) {
        setIsOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -70% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:top-24 lg:right-6 lg:bottom-auto z-50 p-4 lg:p-3 lg:px-4 rounded-full lg:rounded-xl glass border border-outline-variant/30 text-primary hover:text-primary-fixed hover:bg-surface-container transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5)] lg:shadow-md flex items-center gap-2 group"
        title="Open Table of Contents"
      >
        <ListTree size={20} />
        <span className="font-mono text-xs font-semibold uppercase tracking-widest hidden lg:block">On this page</span>
        <ChevronLeft size={16} className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      />
      
      {/* TOC Panel Container */}
      <div className={`fixed lg:static top-0 right-0 h-full z-50 w-72 lg:w-[320px] xl:w-[340px] shrink-0 border-l border-outline-variant/30 bg-surface-container-lowest/95 lg:bg-surface-dim/40 backdrop-blur-3xl lg:backdrop-blur-xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 lg:p-8 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4 shrink-0">
            <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase">
              <ListTree size={16} />
              <span>On this page</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-primary transition-colors p-1.5 hover:bg-surface-container rounded-lg group"
              title="Close TOC"
            >
              <ChevronRight size={16} className="hidden lg:block text-on-surface-variant group-hover:text-primary transition-colors" />
              <X size={18} className="lg:hidden" />
            </button>
          </div>
          
          {headings.length > 0 ? (
            <ul className="space-y-3 flex-1 overflow-y-auto pr-3 custom-scrollbar">
              {headings.map((heading, i) => (
                <li key={i} className={`text-sm ${heading.level === 3 ? 'ml-4' : ''}`}>
                  <a 
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(heading.id);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 80;
                        // Since scrolling is now on a different container, we need to scroll the specific container
                        const scrollContainer = document.getElementById('lesson-scroll-container');
                        if (scrollContainer) {
                          const containerY = el.getBoundingClientRect().top + scrollContainer.scrollTop - scrollContainer.getBoundingClientRect().top - 40;
                          scrollContainer.scrollTo({ top: containerY, behavior: 'smooth' });
                        } else {
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }
                      if (isMobile) setIsOpen(false);
                    }}
                    className={`block transition-colors line-clamp-2 leading-relaxed py-0.5 ${
                      activeId === heading.id 
                        ? 'text-primary font-medium' 
                        : 'text-on-surface-variant/80 hover:text-primary'
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-on-surface-variant italic">No sections found.</p>
          )}
        </div>
      </div>
    </>
  );
}
