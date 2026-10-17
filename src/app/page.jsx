import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { Bot, BookOpen, Target, ChevronRight, FolderGit2, Sparkles, Activity } from "lucide-react"
import clientPromise from '@/lib/db'
import { modules } from '@/lib/curriculumData'
import { projects } from '@/lib/projectsData'
import { getSessionUser, getUserQuery } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const client = await clientPromise;
  const db = client.db('webdev-mentor-ai');
  
  const progressDoc = await db.collection('user_progress').findOne(getUserQuery(user.id));
  const userProgress = progressDoc?.modules || {};
  
  // Modules Stats
  const totalModules = modules.length;
  const completedModules = modules.filter(m => userProgress[m.slug]?.status === 'Completed').length;
  const completionPercentage = Math.round((completedModules / totalModules) * 100) || 0;

  // Projects Stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => userProgress[p.slug]?.status === 'Completed').length;

  // Recent Activity
  let recentActivities = [];
  Object.entries(userProgress).forEach(([slug, data]) => {
    if (data.updatedAt) {
      const isProject = projects.some(p => p.slug === slug);
      const itemMeta = isProject 
        ? projects.find(p => p.slug === slug) 
        : modules.find(m => m.slug === slug);
      
      if (itemMeta) {
        recentActivities.push({
          id: `prog-${slug}-${data.updatedAt.getTime()}`,
          type: isProject ? 'Project' : 'Module',
          title: itemMeta.title,
          action: data.status,
          date: new Date(data.updatedAt)
        });
      }
    }
  });
  recentActivities.sort((a, b) => b.date - a.date);
  const topActivities = recentActivities.slice(0, 3);

  // Find the current module
  const inProgressModule = modules.find(m => userProgress[m.slug]?.status === 'In Progress');
  const firstNotStartedModule = modules.find(m => !userProgress[m.slug] || userProgress[m.slug].status === 'Not Started');
  const currentModule = inProgressModule || firstNotStartedModule;

  // SVG parameters for radial progress
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="absolute inset-0 flex bg-background overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
          
          {/* Header */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/10 to-transparent blur-2xl rounded-3xl opacity-50 -z-10"></div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-on-surface mb-3 tracking-tight">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Architect.</span>
            </h1>
            <p className="text-on-surface-variant font-medium text-lg flex items-center gap-2">
              <Sparkles size={18} className="text-secondary animate-pulse" /> Neural inference active. Ready to synthesize your next module.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Overview Panel - Premium Radial Progress */}
            <Card className="lg:col-span-8 bg-surface-dim/80 backdrop-blur-xl border-outline-variant/30 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  
                  {/* Radial Progress */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        className="text-surface-bright"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="80"
                        cy="80"
                      />
                      <circle
                        className="text-secondary drop-shadow-[0_0_12px_rgba(56,217,197,0.6)] transition-all duration-1000 ease-out"
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="80"
                        cy="80"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl font-heading font-bold text-on-surface">{completionPercentage}%</span>
                      <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest mt-1">Done</span>
                    </div>
                  </div>

                  {/* Stats Detail */}
                  <div className="flex-1 space-y-6 w-full">
                    <div>
                      <h2 className="text-xl font-heading font-semibold text-on-surface mb-1">Full-Stack Curriculum</h2>
                      <p className="text-sm text-on-surface-variant">Mastering the SkillForge AI syllabus.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                          <BookOpen size={16} className="text-primary" />
                          <span className="text-xs font-mono uppercase">Modules</span>
                        </div>
                        <div className="text-2xl font-bold text-on-surface">{completedModules} <span className="text-sm font-normal text-on-surface-variant">/ {totalModules}</span></div>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
                          <FolderGit2 size={16} className="text-secondary" />
                          <span className="text-xs font-mono uppercase">Projects</span>
                        </div>
                        <div className="text-2xl font-bold text-on-surface">{completedProjects} <span className="text-sm font-normal text-on-surface-variant">/ {totalProjects}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions / Activity - Right Sidebar */}
            <div className="lg:col-span-4 space-y-6 flex flex-col">
              
              <Card className="bg-surface-dim/80 backdrop-blur-md border-outline-variant/30 flex-1">
                <CardHeader className="pb-3 border-b border-outline-variant/10">
                  <CardTitle className="text-sm font-mono text-on-surface-variant uppercase tracking-wider flex items-center gap-2">
                    <Activity size={16} className="text-info" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {topActivities.length > 0 ? (
                    <div className="space-y-4">
                      {topActivities.map((act) => (
                        <div key={act.id} className="flex gap-3">
                          <div className="mt-1 w-2 h-2 rounded-full bg-primary/70 shadow-[0_0_8px_rgba(145,133,255,0.8)] shrink-0"></div>
                          <div>
                            <p className="text-sm font-medium text-on-surface line-clamp-1">{act.title}</p>
                            <p className="text-xs text-on-surface-variant font-mono mt-0.5">{act.action} • {act.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-on-surface-variant text-center py-6">
                      No recent activity.
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/mentor" className="group">
                  <div className="h-full p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-high transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(145,133,255,0.2)] flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Bot size={20} />
                    </div>
                    <span className="text-xs font-semibold text-on-surface">AI Mentor</span>
                  </div>
                </Link>
                <Link href="/analytics" className="group">
                  <div className="h-full p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 hover:border-secondary/50 hover:bg-surface-container-high transition-all shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(56,217,197,0.2)] flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <Target size={20} />
                    </div>
                    <span className="text-xs font-semibold text-on-surface">Full Analytics</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Continue Learning - Glass Elevated Card */}
          <Card className="bg-surface-container-low/50 backdrop-blur-2xl border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                
                {currentModule ? (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="primary" className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest text-[10px]">
                          {inProgressModule ? 'Continue Learning' : 'Up Next'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-surface-bright to-surface-dim border border-outline-variant/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] text-on-surface font-mono font-bold text-2xl shrink-0">
                          {currentModule.number}
                        </div>
                        <div>
                          <h3 className="text-2xl font-heading font-bold text-on-surface mb-2">
                            {currentModule.title}
                          </h3>
                          <p className="text-sm text-on-surface-variant line-clamp-1 max-w-xl">
                            {currentModule.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link href={`/learning/modules/${currentModule.slug}`} className="w-full md:w-auto shrink-0">
                      <Button variant="primary" className="w-full shadow-[0_0_20px_rgba(145,133,255,0.3)] hover:shadow-[0_0_30px_rgba(145,133,255,0.5)] transition-shadow px-8 py-6 text-lg rounded-xl">
                        Synthesize Module <ChevronRight size={20} className="ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="w-full py-10 flex flex-col items-center justify-center text-center">
                    <Target size={48} className="text-secondary/50 mb-4 drop-shadow-[0_0_12px_rgba(56,217,197,0.4)]" />
                    <h3 className="text-2xl font-heading font-bold text-on-surface mb-2">Curriculum Mastered</h3>
                    <p className="text-on-surface-variant max-w-md">You have synthesized all 31 modules. Review your Analytics or consult the AI Mentor for advanced challenges.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
