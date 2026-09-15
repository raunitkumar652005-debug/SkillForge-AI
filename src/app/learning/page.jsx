import { modules } from "@/lib/curriculumData"
import Link from "next/link"
import { BookOpen, Clock, BarChart, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

export default function LearningPage() {
  return (
    <div className="flex-1 overflow-auto bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase">
            <BookOpen size={16} />
            <span>Curriculum</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
            Learning Paths
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-sans">
            Master Full-Stack Development step by step. From front-end basics to advanced back-end architectures, learn through structured, AI-guided modules.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Badge variant="primary" className="px-3 py-1 text-sm bg-primary/10 border-primary/30 text-primary">
              Full-Stack Development
            </Badge>
            <span className="text-on-surface-variant text-sm font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              31 Modules
            </span>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {modules.map((mod) => (
            <Card 
              key={mod.id} 
              className="flex flex-col h-full bg-surface-dim border border-outline-variant/40 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(6,182,212,0.15)] group overflow-hidden relative"
            >
              {/* Subtle top border gradient highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-6 flex flex-col h-full z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface font-mono font-bold text-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {mod.number}
                  </div>
                  <Badge variant="secondary" className="bg-surface-container/50 border-outline-variant/30 text-on-surface-variant">
                    {mod.status}
                  </Badge>
                </div>
                
                <h3 className="text-xl font-heading font-semibold text-on-surface mb-3 line-clamp-2 group-hover:text-primary-fixed-dim transition-colors">
                  {mod.title}
                </h3>
                
                <p className="text-on-surface-variant text-sm flex-grow line-clamp-3 mb-6">
                  {mod.description}
                </p>
                
                <div className="pt-4 mt-auto border-t border-outline-variant/20 flex items-center justify-between">
                  <div className="flex gap-3 text-xs font-mono text-on-surface-variant/70">
                    {/* Placeholder for future metadata like difficulty/time if available */}
                  </div>
                  <Link href={`/learning/modules/${mod.slug}`} className="w-full">
                    <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-300">
                      Start Learning
                      <ChevronRight size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
