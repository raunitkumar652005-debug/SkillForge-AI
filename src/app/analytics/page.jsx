import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { BarChart, BookOpen, Target, CheckCircle2, Bot, MessageSquare, Clock, FolderGit2 } from "lucide-react"
import clientPromise from '@/lib/db'
import { modules } from '@/lib/curriculumData'
import { projects } from '@/lib/projectsData'
import { getSessionUser, getUserQuery } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const client = await clientPromise;
  const db = client.db('webdev-mentor-ai');

  // 1. Fetch user progress
  const progressDoc = await db.collection('user_progress').findOne(getUserQuery(user.id));
  const userProgress = progressDoc?.modules || {};

  // 2. Fetch AI Mentor data strictly scoped to this user
  const conversations = await db.collection('conversations').find(getUserQuery(user.id)).toArray();
  const convIds = conversations.map(c => c._id);
  
  const messages = convIds.length > 0 
    ? await db.collection('messages').find({ conversationId: { $in: convIds } }).toArray()
    : [];

  const totalUserMessages = messages.filter(m => m.role === 'user').length;
  const totalAiMessages = messages.filter(m => m.role === 'ai').length;

  // 3. Process Modules Analytics
  const totalModules = modules.length;
  let modulesCompleted = 0;
  let modulesInProgress = 0;
  
  modules.forEach(mod => {
    const status = userProgress[mod.slug]?.status;
    if (status === 'Completed') modulesCompleted++;
    else if (status === 'In Progress') modulesInProgress++;
  });
  
  const modulesNotStarted = totalModules - modulesCompleted - modulesInProgress;
  const moduleProgressPercentage = Math.round((modulesCompleted / totalModules) * 100) || 0;

  // 4. Process Projects Analytics
  const totalProjects = projects.length;
  let projectsCompleted = 0;
  let projectsInProgress = 0;

  projects.forEach(proj => {
    const status = userProgress[proj.slug]?.status;
    if (status === 'Completed') projectsCompleted++;
    else if (status === 'In Progress') projectsInProgress++;
  });
  
  const projectsNotStarted = totalProjects - projectsCompleted - projectsInProgress;
  const projectProgressPercentage = Math.round((projectsCompleted / totalProjects) * 100) || 0;

  // 5. Build Recent Activity Timeline
  let recentActivities = [];

  // Add module/project activities
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

  // Add chat activities
  conversations.forEach(conv => {
    if (conv.createdAt) {
      recentActivities.push({
        id: `chat-${conv._id}`,
        type: 'AI Mentor',
        title: conv.title || 'Conversation',
        action: 'Started session',
        date: new Date(conv.createdAt)
      });
    }
  });

  // Sort by most recent first and take top 8
  recentActivities.sort((a, b) => b.date - a.date);
  const topActivities = recentActivities.slice(0, 8);

  // SVG Radial Math for Curriculum Status
  const r = 54;
  const c = 2 * Math.PI * r;
  
  const compDash = (modulesCompleted / totalModules) * c;
  const inProgDash = (modulesInProgress / totalModules) * c;
  const notStDash = (modulesNotStarted / totalModules) * c;

  const compOffset = c;
  const inProgOffset = c - compDash;
  const notStOffset = c - compDash - inProgDash;

  return (
    <div className="absolute inset-0 flex bg-background overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase">
              <BarChart size={16} />
              <span>Performance Analytics</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
              Learning Dashboard
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-sans">
              Comprehensive telemetry of your progress across modules, projects, and neural mentorship sessions.
            </p>
          </div>

          {/* KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-surface-dim/80 backdrop-blur-xl border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Overall Progress</div>
                  <Target size={16} className="text-emerald-400" />
                </div>
                <div className="text-4xl font-heading font-bold text-on-surface">{moduleProgressPercentage}%</div>
                <div className="w-full bg-surface-bright h-1.5 rounded-full mt-4 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all" style={{ width: `${moduleProgressPercentage}%` }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface-dim/80 backdrop-blur-xl border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Modules Done</div>
                  <CheckCircle2 size={16} className="text-primary" />
                </div>
                <div className="text-4xl font-heading font-bold text-on-surface flex items-baseline gap-1">
                  {modulesCompleted} <span className="text-lg font-medium text-on-surface-variant">/ {totalModules}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-3 font-mono">{modulesInProgress} active</p>
              </CardContent>
            </Card>

            <Card className="bg-surface-dim/80 backdrop-blur-xl border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Projects Done</div>
                  <FolderGit2 size={16} className="text-secondary" />
                </div>
                <div className="text-4xl font-heading font-bold text-on-surface flex items-baseline gap-1">
                  {projectsCompleted} <span className="text-lg font-medium text-on-surface-variant">/ {totalProjects}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-3 font-mono">{projectsInProgress} active</p>
              </CardContent>
            </Card>

            <Card className="bg-surface-dim/80 backdrop-blur-xl border-outline-variant/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">AI Sessions</div>
                  <Bot size={16} className="text-info" />
                </div>
                <div className="text-4xl font-heading font-bold text-on-surface">{conversations.length}</div>
                <p className="text-xs text-on-surface-variant mt-3 font-mono">{totalUserMessages + totalAiMessages} msgs exchanged</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-8">
              
              {/* Curriculum Progress Detail (Radial) */}
              <Card className="bg-surface-container-low/80 backdrop-blur-xl border-outline-variant/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 blur-[50px] rounded-full"></div>
                <CardHeader className="border-b border-outline-variant/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen size={18} className="text-primary" /> Curriculum Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    
                    {/* Donut Chart */}
                    <div className="relative shrink-0 flex items-center justify-center">
                      <svg className="w-40 h-40 transform -rotate-90">
                        {/* Not Started */}
                        <circle
                          className="text-surface-variant drop-shadow-[0_0_2px_rgba(255,255,255,0.1)] transition-all duration-1000"
                          strokeWidth="12"
                          strokeDasharray={`${notStDash} ${c}`}
                          strokeDashoffset={c}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r={r} cx="80" cy="80"
                        />
                        {/* In Progress */}
                        <circle
                          className="text-info drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-1000"
                          strokeWidth="12"
                          strokeDasharray={`${inProgDash} ${c}`}
                          strokeDashoffset={inProgOffset}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r={r} cx="80" cy="80"
                        />
                        {/* Completed */}
                        <circle
                          className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)] transition-all duration-1000"
                          strokeWidth="12"
                          strokeDasharray={`${compDash} ${c}`}
                          strokeDashoffset={compOffset}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r={r} cx="80" cy="80"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-heading font-bold text-on-surface">{moduleProgressPercentage}%</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-4 w-full">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-dim border border-outline-variant/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                          <span className="text-sm font-medium text-on-surface">Completed</span>
                        </div>
                        <span className="font-mono text-sm">{modulesCompleted}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-dim border border-outline-variant/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-info shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                          <span className="text-sm font-medium text-on-surface">In Progress</span>
                        </div>
                        <span className="font-mono text-sm">{modulesInProgress}</span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-surface-dim border border-outline-variant/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                          <span className="text-sm font-medium text-on-surface">Not Started</span>
                        </div>
                        <span className="font-mono text-sm text-on-surface-variant">{modulesNotStarted}</span>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
              
              {/* AI Mentor Stats Detail */}
              <Card className="bg-surface-container-low/80 backdrop-blur-xl border-outline-variant/30">
                <CardHeader className="border-b border-outline-variant/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare size={18} className="text-info" /> Mentor Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 text-on-surface-variant">
                      <Bot size={32} className="mx-auto mb-3 opacity-50" />
                      <p>Start chatting with the AI Mentor to see your stats here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-dim p-6 rounded-2xl border border-outline-variant/20 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-primary/30 transition-colors">
                        <div className="text-4xl font-heading font-bold text-primary mb-2">{totalUserMessages}</div>
                        <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">User Prompts</div>
                      </div>
                      <div className="bg-surface-dim p-6 rounded-2xl border border-outline-variant/20 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-secondary/30 transition-colors">
                        <div className="text-4xl font-heading font-bold text-secondary mb-2">{totalAiMessages}</div>
                        <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">AI Responses</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Progress */}
              <Card className="bg-surface-container-low/80 backdrop-blur-xl border-outline-variant/30">
                <CardHeader className="border-b border-outline-variant/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FolderGit2 size={18} className="text-secondary" /> Project Portfolio Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-sm mb-2 font-mono">
                        <span className="text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]">Completed ({projectsCompleted})</span>
                        <span className="text-on-surface-variant">{Math.round((projectsCompleted/totalProjects)*100)}%</span>
                      </div>
                      <div className="w-full bg-surface-bright h-2.5 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all" style={{ width: `${(projectsCompleted/totalProjects)*100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2 font-mono">
                        <span className="text-info drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]">In Progress ({projectsInProgress})</span>
                        <span className="text-on-surface-variant">{Math.round((projectsInProgress/totalProjects)*100)}%</span>
                      </div>
                      <div className="w-full bg-surface-bright h-2.5 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                        <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all" style={{ width: `${(projectsInProgress/totalProjects)*100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2 font-mono">
                        <span className="text-on-surface-variant">Not Started ({projectsNotStarted})</span>
                        <span className="text-on-surface-variant/70">{Math.round((projectsNotStarted/totalProjects)*100)}%</span>
                      </div>
                      <div className="w-full bg-surface-bright h-2.5 rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                        <div className="bg-surface-variant h-full rounded-full transition-all" style={{ width: `${(projectsNotStarted/totalProjects)*100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column */}
            <div className="space-y-8">
              
              {/* Recent Activity Timeline */}
              <Card className="bg-surface-container-low/80 backdrop-blur-xl border-outline-variant/30 h-full">
                <CardHeader className="border-b border-outline-variant/10 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock size={18} className="text-secondary" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {topActivities.length === 0 ? (
                    <div className="text-center py-12 text-on-surface-variant">
                      <Clock size={32} className="mx-auto mb-3 opacity-50" />
                      <p>Your recent learning activity will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-secondary/30 before:to-transparent">
                      {topActivities.map((act, i) => (
                        <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          
                          {/* Timeline dot */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant/40 bg-surface-container-high shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                            {act.type === 'Project' ? (
                              <FolderGit2 size={16} className="text-secondary drop-shadow-[0_0_4px_rgba(168,85,247,0.8)]" />
                            ) : act.type === 'Module' ? (
                              <BookOpen size={16} className="text-primary drop-shadow-[0_0_4px_rgba(59,130,246,0.8)]" />
                            ) : (
                              <Bot size={16} className="text-info drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]" />
                            )}
                          </div>
                          
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-outline-variant/20 bg-surface-dim/80 backdrop-blur shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:border-outline-variant/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="text-[10px] py-0 px-2 bg-surface-container border-outline-variant/30 text-on-surface-variant font-mono">
                                {act.type}
                              </Badge>
                              <time className="text-[10px] font-mono text-on-surface-variant/70">
                                {act.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </time>
                            </div>
                            <div className="text-sm font-semibold text-on-surface line-clamp-1 mb-1">{act.title}</div>
                            <div className="text-xs text-on-surface-variant">
                              {act.action === 'Completed' ? (
                                <span className="text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)] flex items-center gap-1"><CheckCircle2 size={12} /> Completed</span>
                              ) : act.action === 'In Progress' ? (
                                <span className="text-info drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]">Started</span>
                              ) : (
                                <span>{act.action}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
