import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, FolderGit2, CheckCircle2, ListTree, Code2 } from 'lucide-react';
import { projects } from '@/lib/projectsData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ModuleProgressActions } from '@/components/learning/ModuleProgressActions';
import clientPromise from '@/lib/db';
import { getSessionUser, getUserQuery } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams['project-slug'];

  const currentProjectIndex = projects.findIndex(p => p.slug === slug);
  
  if (currentProjectIndex === -1) {
    notFound();
  }

  const projectData = projects[currentProjectIndex];
  const prevProject = currentProjectIndex > 0 ? projects[currentProjectIndex - 1] : null;
  const nextProject = currentProjectIndex < projects.length - 1 ? projects[currentProjectIndex + 1] : null;

  // Fetch initial progress status for the authenticated user
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const client = await clientPromise;
  const db = client.db('webdev-mentor-ai');
  const progressDoc = await db.collection('user_progress').findOne(getUserQuery(user.id));
  const initialStatus = progressDoc?.modules?.[slug]?.status || 'Not Started';

  return (
    <div className="absolute inset-0 flex bg-background overflow-hidden z-10">
      <div id="lesson-scroll-container" className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 lg:pl-12 scroll-smooth custom-scrollbar overflow-x-hidden">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-32">
        
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center text-xs md:text-sm font-mono text-on-surface-variant mb-4 md:mb-6 gap-y-2">
            <Link href="/projects" className="hover:text-primary transition-colors whitespace-nowrap">Projects</Link>
            <ChevronRight size={14} className="mx-1 md:mx-2 opacity-50 shrink-0" />
            <span className="text-primary truncate">Project {projectData.number}</span>
          </nav>
            
          {/* Header */}
          <div className="space-y-4 pb-4 md:pb-6 border-b border-outline-variant/30">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-lg md:text-xl shrink-0">
                {projectData.number}
              </div>
              <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight leading-tight">
                {projectData.title}
              </h1>
            </div>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-sans mt-2 md:mt-4">
              {projectData.description}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="primary" className="bg-primary/10 text-primary border-primary/20">{projectData.difficulty}</Badge>
              <Badge variant="secondary" className="bg-surface-container-high text-on-surface-variant border-none">{projectData.estimatedScope}</Badge>
            </div>
          </div>

          {/* Project Details Content */}
          <div className="space-y-10 prose-base md:prose-lg max-w-none">
            
            {/* Tech Stack */}
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/30 flex items-center gap-2">
                <Code2 size={24} className="text-primary" /> Tech Stack & Tools
              </h2>
              <div className="flex flex-wrap gap-3">
                {projectData.techStack.map(tech => (
                  <Badge key={tech} className="bg-secondary-container/20 text-secondary-fixed-dim border-secondary-container/50 px-3 py-1 text-sm font-mono">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Overview Section */}
            <section className="grid md:grid-cols-2 gap-6">
              <Card className="bg-surface-dim border-outline-variant/30">
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg text-primary-fixed-dim mb-2">Project Goal</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{projectData.projectGoal}</p>
                </div>
              </Card>
              <Card className="bg-surface-dim border-outline-variant/30">
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg text-primary-fixed-dim mb-2">Prerequisites</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{projectData.prerequisites}</p>
                </div>
              </Card>
            </section>

            {/* Core Features */}
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/30">
                Core Features
              </h2>
              <ul className="grid md:grid-cols-2 gap-3 text-on-surface-variant">
                {projectData.coreFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={18} className="text-primary/70 shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Milestones */}
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/30">
                Step-by-Step Milestones
              </h2>
              <div className="space-y-3">
                {projectData.stepByStepMilestones.map((step, i) => (
                  <div key={i} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex gap-3 items-start">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-container-highest text-xs font-mono text-on-surface shrink-0 mt-0.5">{i+1}</div>
                    <div className="text-on-surface-variant text-sm md:text-base">{step.replace(/^\d+\.\s*/, '')}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Architecture / Flow */}
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/30">
                Architecture Flow
              </h2>
              <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 font-mono text-sm text-secondary-fixed-dim">
                {projectData.architectureFlow}
              </div>
            </section>

            {/* Related Modules */}
            {projectData.relatedModules?.length > 0 && (
              <section>
                <h2 className="font-heading text-xl md:text-2xl font-bold text-on-surface mb-4 pb-2 border-b border-outline-variant/30">
                  Related Modules
                </h2>
                <div className="flex flex-col gap-2">
                  {projectData.relatedModules.map((mod, i) => (
                    <Link key={i} href={`/learning/modules/${mod.number}`} className="flex items-center gap-3 p-3 rounded-lg bg-surface-dim hover:bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-colors group">
                      <ListTree size={18} className="text-primary/50 group-hover:text-primary transition-colors shrink-0" />
                      <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                        Module {mod.number}: {mod.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Testing Checklist & Completion */}
            <section className="bg-surface-container-high/50 rounded-2xl p-6 border border-outline-variant/20">
              <h2 className="font-heading text-lg font-bold text-on-surface mb-4">Completion Criteria</h2>
              <p className="text-sm text-on-surface-variant mb-6">{projectData.completionCriteria}</p>
              
              <h3 className="font-heading font-semibold text-sm text-on-surface mb-3 uppercase tracking-wider">Testing Checklist</h3>
              <ul className="space-y-2 mb-6 text-sm text-on-surface-variant">
                {projectData.testingChecklist.map((check, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded border border-outline-variant/50 shrink-0 mt-0.5"></div>
                    <span>{check}</span>
                  </li>
                ))}
              </ul>

              {projectData.optionalChallenge && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                  <span className="font-bold text-primary mr-2">Optional Challenge:</span>
                  <span className="text-on-surface-variant">{projectData.optionalChallenge}</span>
                </div>
              )}
            </section>

          </div>

          <ModuleProgressActions moduleSlug={slug} initialStatus={initialStatus} />

          {/* Footer Navigation */}
          <div className="pt-6 md:pt-8 mt-8 md:mt-12 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4">
            {prevProject ? (
              <Link href={`/projects/${prevProject.slug}`} className="w-full md:w-auto group">
                <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-outline-variant/30 bg-surface-dim hover:bg-surface-container hover:border-primary/50 transition-all">
                  <ChevronLeft size={20} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">Previous Project</div>
                    <div className="text-sm font-semibold text-on-surface truncate md:max-w-[200px]">{prevProject.title}</div>
                  </div>
                </div>
              </Link>
            ) : <div className="hidden md:block w-full md:w-auto"></div>}

            <Link href="/projects" className="order-first md:order-none w-full md:w-auto text-sm font-mono text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 py-3 md:py-0 border border-outline-variant/30 md:border-none rounded-xl md:rounded-none bg-surface-dim md:bg-transparent">
              <FolderGit2 size={16} />
              Back to Projects
            </Link>

            {nextProject ? (
              <Link href={`/projects/${nextProject.slug}`} className="w-full md:w-auto group md:text-right">
                <div className="flex items-center justify-between md:justify-end gap-3 p-3 md:p-4 rounded-xl border border-outline-variant/30 bg-surface-dim hover:bg-surface-container hover:border-primary/50 transition-all">
                  <div className="min-w-0 text-left md:text-right">
                    <div className="text-xs font-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">Next Project</div>
                    <div className="text-sm font-semibold text-on-surface truncate md:max-w-[200px]">{nextProject.title}</div>
                  </div>
                  <ChevronRight size={20} className="text-primary shrink-0" />
                </div>
              </Link>
            ) : <div className="hidden md:block w-full md:w-auto"></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
