"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Search, CheckCircle, BookOpen, Clock } from 'lucide-react';

export function RevisionClient({ revisionData, userProgress }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Process data for rendering
  const processedData = revisionData.map(mod => {
    const status = userProgress[mod.slug]?.status || 'Not Started';
    return { ...mod, status };
  });

  const filteredData = processedData
    .filter(mod => filter === 'All' || mod.status === filter)
    .filter(mod => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        mod.title?.toLowerCase().includes(q) ||
        mod.description?.toLowerCase().includes(q) ||
        mod.keywords?.toLowerCase().includes(q) ||
        mod.tags?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      // Prefer completed modules at the top
      if (a.status === 'Completed' && b.status !== 'Completed') return -1;
      if (b.status === 'Completed' && a.status !== 'Completed') return 1;
      return 0; // maintain default order (module number) otherwise
    });

  const totalModules = revisionData.length;
  const completedModules = processedData.filter(m => m.status === 'Completed').length;
  const availableForRevision = processedData.filter(m => m.sectionsCount > 0).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-surface-dim border-outline-variant/30">
          <div className="p-6">
            <div className="flex items-center gap-3 text-on-surface-variant mb-2 font-mono text-sm uppercase tracking-wider">
              <BookOpen size={18} className="text-primary" /> Total Modules
            </div>
            <div className="text-3xl font-heading font-bold text-on-surface">{totalModules}</div>
          </div>
        </Card>
        <Card className="bg-surface-dim border-outline-variant/30">
          <div className="p-6">
            <div className="flex items-center gap-3 text-on-surface-variant mb-2 font-mono text-sm uppercase tracking-wider">
              <CheckCircle size={18} className="text-emerald-400" /> Completed
            </div>
            <div className="text-3xl font-heading font-bold text-on-surface">{completedModules}</div>
          </div>
        </Card>
        <Card className="bg-surface-dim border-outline-variant/30">
          <div className="p-6">
            <div className="flex items-center gap-3 text-on-surface-variant mb-2 font-mono text-sm uppercase tracking-wider">
              <Clock size={18} className="text-secondary" /> Revisable
            </div>
            <div className="text-3xl font-heading font-bold text-on-surface">{availableForRevision}</div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', 'Completed', 'In Progress', 'Not Started'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72 shrink-0">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search modules, concepts, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/50 rounded-xl py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Modules Grid */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant bg-surface-dim rounded-xl border border-dashed border-outline-variant/30">
          No modules match your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map(mod => (
            <Card 
              key={mod.slug} 
              className="flex flex-col h-full bg-surface-dim border border-outline-variant/40 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(6,182,212,0.15)] group overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-6 flex flex-col h-full z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface font-mono font-bold text-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {mod.moduleNumber}
                  </div>
                  <Badge variant={mod.status === 'Completed' ? 'primary' : mod.status === 'In Progress' ? 'info' : 'secondary'} className={`bg-surface-container/50 border-outline-variant/30 ${mod.status === 'Completed' ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {mod.status}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-heading font-semibold text-on-surface mb-2 line-clamp-2 group-hover:text-primary-fixed-dim transition-colors">
                  {mod.title}
                </h3>
                
                <p className="text-on-surface-variant text-sm flex-grow line-clamp-3 mb-6">
                  {mod.description}
                </p>
                
                <div className="pt-4 mt-auto border-t border-outline-variant/20 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant/70">
                    <span>{mod.sectionsCount} Revision Sections</span>
                  </div>
                  <Link href={`/revision/${mod.slug}`} className="w-full">
                    <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-300">
                      Review
                      <ChevronRight size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
