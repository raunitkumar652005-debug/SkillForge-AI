import { projects } from "@/lib/projectsData"
import Link from "next/link"
import { FolderGit2, ChevronRight, TerminalSquare } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import clientPromise from '@/lib/db'
import { getSessionUser, getUserQuery } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const client = await clientPromise;
  const db = client.db('webdev-mentor-ai');
  const progressDoc = await db.collection('user_progress').findOne(getUserQuery(user.id));
  const userProgress = progressDoc?.modules || {};

  return (
    <div className="absolute inset-0 flex bg-background overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase">
            <FolderGit2 size={16} />
            <span>Hands-on Practice</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
            Projects
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-sans">
            Apply your knowledge by building real-world applications. Complete these 10 curated projects to build a professional portfolio and solidify your skills.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <Badge variant="primary" className="px-3 py-1 text-sm bg-primary/10 border-primary/30 text-primary">
              Full-Stack Portfolio
            </Badge>
            <span className="text-on-surface-variant text-sm font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              {projects.length} Projects
            </span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-4">
          {projects.map((proj) => {
            const status = userProgress[proj.slug]?.status || 'Not Started';
            return (
              <Card 
                key={proj.id} 
                className="flex flex-col h-full bg-surface-dim border border-outline-variant/40 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(6,182,212,0.15)] group overflow-hidden relative"
              >
                {/* Subtle top border gradient highlight on hover */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="p-6 flex flex-col h-full z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-high border border-outline-variant/50 text-on-surface font-mono font-bold text-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {proj.number}
                    </div>
                    <Badge variant={status === 'Completed' ? 'primary' : status === 'In Progress' ? 'info' : 'secondary'} className={`bg-surface-container/50 border-outline-variant/30 ${status === 'Completed' ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {status}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-heading font-semibold text-on-surface mb-2 line-clamp-2 group-hover:text-primary-fixed-dim transition-colors">
                    {proj.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-surface-container-highest text-xs text-on-surface-variant border-none">{proj.difficulty}</Badge>
                    {proj.techStack.slice(0, 3).map((tech) => (
                      <Badge key={tech} className="bg-primary/5 text-xs text-primary/80 border-primary/20">{tech}</Badge>
                    ))}
                    {proj.techStack.length > 3 && <Badge className="bg-primary/5 text-xs text-primary/80 border-primary/20">+{proj.techStack.length - 3}</Badge>}
                  </div>

                  <p className="text-on-surface-variant text-sm flex-grow line-clamp-3 mb-6">
                    {proj.description}
                  </p>
                  
                  <div className="pt-4 mt-auto border-t border-outline-variant/20 flex flex-col gap-4">
                    <div className="flex items-start gap-2 text-xs font-mono text-on-surface-variant/70">
                      <TerminalSquare size={14} className="shrink-0 mt-0.5" />
                      <span className="line-clamp-1">Related: Module {proj.relatedModules[0]?.number}</span>
                    </div>
                    <Link href={`/projects/${proj.slug}`} className="w-full">
                      <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary transition-all duration-300">
                        View Project Details
                        <ChevronRight size={16} className="ml-2 opacity-50 group-hover:opacity-100" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
    </div>
  )
}
