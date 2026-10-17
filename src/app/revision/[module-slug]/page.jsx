import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, ExternalLink, Hash, ListTodo, Code2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { getRevisionData } from '@/lib/revisionParser';
import { modules } from '@/lib/curriculumData';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import clientPromise from '@/lib/db';
import { getSessionUser, getUserQuery } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

function RevisionSection({ title, icon: Icon, content }) {
  if (!content) return null;
  return (
    <section className="mb-12">
      <h2 className="font-heading text-xl md:text-2xl font-bold text-on-surface mb-6 pb-2 border-b border-outline-variant/30 flex items-center gap-3">
        <Icon size={24} className="text-primary" /> {title}
      </h2>
      <div className="prose prose-invert prose-base md:prose-lg max-w-none overflow-wrap-anywhere break-words
        prose-headings:font-heading prose-headings:text-on-surface 
        prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-primary-fixed-dim
        prose-p:text-on-surface-variant prose-p:leading-relaxed
        prose-a:text-primary hover:prose-a:text-primary-fixed-dim prose-a:no-underline prose-a:break-all
        prose-code:text-secondary-fixed-dim prose-code:bg-surface-container prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs md:prose-code:text-sm prose-code:break-words
        prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:overflow-x-auto prose-pre:max-w-[calc(100vw-2rem)] md:prose-pre:max-w-full
        prose-strong:text-on-surface prose-strong:font-semibold
        prose-ul:text-on-surface-variant prose-ol:text-on-surface-variant
        prose-li:marker:text-outline-variant
        prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-surface-container-low prose-blockquote:px-4 md:prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:text-on-surface-variant/90 prose-blockquote:not-italic
      ">
        <MarkdownRenderer content={content} />
      </div>
    </section>
  );
}

export default async function RevisionDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams['module-slug'];

  const revisionData = await getRevisionData(slug);
  if (!revisionData) {
    notFound();
  }

  const currentModuleIndex = modules.findIndex(m => m.slug === slug);
  const prevModule = currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null;
  const nextModule = currentModuleIndex < modules.length - 1 ? modules[currentModuleIndex + 1] : null;

  // Fetch initial progress status for the authenticated user
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const client = await clientPromise;
  const db = client.db('webdev-mentor-ai');
  const progressDoc = await db.collection('user_progress').findOne(getUserQuery(user.id));
  const status = progressDoc?.modules?.[slug]?.status || 'Not Started';

  return (
    <div className="absolute inset-0 flex bg-background overflow-hidden z-10">
      <div id="lesson-scroll-container" className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 lg:pl-12 scroll-smooth custom-scrollbar overflow-x-hidden">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-32">
        
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center text-xs md:text-sm font-mono text-on-surface-variant mb-4 md:mb-6 gap-y-2">
            <Link href="/revision" className="hover:text-primary transition-colors whitespace-nowrap">Revision Hub</Link>
            <ChevronRight size={14} className="mx-1 md:mx-2 opacity-50 shrink-0" />
            <span className="text-primary truncate">Module {revisionData.moduleNumber}</span>
          </nav>
            
          {/* Header */}
          <div className="space-y-4 pb-6 md:pb-8 border-b border-outline-variant/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-lg md:text-xl shrink-0">
                  {revisionData.moduleNumber}
                </div>
                <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight leading-tight">
                  {revisionData.title}
                </h1>
              </div>
              
              <Link href={`/learning/modules/${slug}`} className="shrink-0">
                <Badge variant="primary" className="px-3 py-1.5 text-sm bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2 cursor-pointer">
                  <ExternalLink size={14} /> Open Full Module
                </Badge>
              </Link>
            </div>
            
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-sans mt-2 md:mt-4">
              {revisionData.description}
            </p>
            
            <div className="flex items-center gap-2 pt-2">
              <Badge variant={status === 'Completed' ? 'primary' : status === 'In Progress' ? 'info' : 'secondary'} className={`bg-surface-container/50 border-outline-variant/30 ${status === 'Completed' ? 'text-primary' : 'text-on-surface-variant'}`}>
                Status: {status}
              </Badge>
            </div>
          </div>

          {/* Revision Content */}
          <div className="pt-4">
            <RevisionSection title="Quick Summary" icon={BookOpen} content={revisionData.summary} />
            <RevisionSection title="Overview" icon={BookOpen} content={revisionData.overview} />
            <RevisionSection title="Key Concepts & Keywords" icon={Hash} content={revisionData.keywords} />
            <RevisionSection title="Interview Questions" icon={GraduationCap} content={revisionData.interviewQuestions} />
            <RevisionSection title="Practice Questions" icon={ListTodo} content={revisionData.practiceQuestions} />
            <RevisionSection title="Coding Exercises" icon={Code2} content={revisionData.codingExercises} />
            <RevisionSection title="Related Topics" icon={CheckCircle2} content={revisionData.relatedTopics || revisionData.suggestedNextTopics} />
          </div>

          {/* Footer Navigation */}
          <div className="pt-6 md:pt-8 mt-8 md:mt-12 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4">
            {prevModule ? (
              <Link href={`/revision/${prevModule.slug}`} className="w-full md:w-auto group">
                <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-outline-variant/30 bg-surface-dim hover:bg-surface-container hover:border-primary/50 transition-all">
                  <ChevronLeft size={20} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">Previous Module</div>
                    <div className="text-sm font-semibold text-on-surface truncate md:max-w-[200px]">{prevModule.title}</div>
                  </div>
                </div>
              </Link>
            ) : <div className="hidden md:block w-full md:w-auto"></div>}

            <Link href="/revision" className="order-first md:order-none w-full md:w-auto text-sm font-mono text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 py-3 md:py-0 border border-outline-variant/30 md:border-none rounded-xl md:rounded-none bg-surface-dim md:bg-transparent">
              <BookOpen size={16} />
              Back to Revision
            </Link>

            {nextModule ? (
              <Link href={`/revision/${nextModule.slug}`} className="w-full md:w-auto group md:text-right">
                <div className="flex items-center justify-between md:justify-end gap-3 p-3 md:p-4 rounded-xl border border-outline-variant/30 bg-surface-dim hover:bg-surface-container hover:border-primary/50 transition-all">
                  <div className="min-w-0 text-left md:text-right">
                    <div className="text-xs font-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">Next Module</div>
                    <div className="text-sm font-semibold text-on-surface truncate md:max-w-[200px]">{nextModule.title}</div>
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
