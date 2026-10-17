import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, ListTree } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { modules } from '@/lib/curriculumData';
import { Card } from '@/components/ui/Card';
import { ModuleTOC } from '@/components/learning/ModuleTOC';
import { ModuleProgressActions } from '@/components/learning/ModuleProgressActions';
import clientPromise from '@/lib/db';
import { getSessionUser, getUserQuery } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';
function extractHeadings(content) {
  const headingRegex = /^(##|###)\s+(.*)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      id: match[2].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    });
  }
  return headings;
}

export default async function ModulePage({ params }) {
  // Await params first (Next.js 15+ requirement or good practice)
  const resolvedParams = await params;
  const slug = resolvedParams['module-slug'];

  // Find module data
  const currentModuleIndex = modules.findIndex(m => m.slug === slug);
  
  if (currentModuleIndex === -1) {
    notFound();
  }

  const moduleData = modules[currentModuleIndex];
  const prevModule = currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null;
  const nextModule = currentModuleIndex < modules.length - 1 ? modules[currentModuleIndex + 1] : null;

  // Read actual markdown file
  const modulesDir = path.join(process.cwd(), 'content/modules/31_modules_FSD');
  
  let content = '';
  try {
    const files = await fs.readdir(modulesDir);
    const targetFile = files.find(f => f.replace('.md', '').toLowerCase() === slug);
    if (!targetFile) {
      notFound();
    }
    const filePath = path.join(modulesDir, targetFile);
    content = await fs.readFile(filePath, 'utf-8');
    
    // Strip the # Module Title heading since we'll render it in the header manually
    content = content.replace(/^# Module \d+:.*$/m, '').trim();
  } catch (error) {
    console.error('Error reading module file:', error);
    notFound();
  }

  const headings = extractHeadings(content);

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
      
      {/* Scrollable Lesson Content */}
      <div id="lesson-scroll-container" className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 lg:pl-12 scroll-smooth custom-scrollbar overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pb-32">
        
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center text-xs md:text-sm font-mono text-on-surface-variant mb-4 md:mb-6 gap-y-2">
            <Link href="/learning" className="hover:text-primary transition-colors whitespace-nowrap">Learning</Link>
            <ChevronRight size={14} className="mx-1 md:mx-2 opacity-50 shrink-0" />
            <span className="whitespace-nowrap">Full-Stack Development</span>
            <ChevronRight size={14} className="mx-1 md:mx-2 opacity-50 shrink-0" />
            <span className="text-primary truncate">Module {moduleData.number}</span>
          </nav>
            
            {/* Header */}
            <div className="space-y-4 pb-4 md:pb-6 border-b border-outline-variant/30">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-lg md:text-xl shrink-0">
                  {moduleData.number}
                </div>
                <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface tracking-tight leading-tight">
                  {moduleData.title}
                </h1>
              </div>
              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-sans mt-2 md:mt-4">
                {moduleData.description}
              </p>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-invert prose-base md:prose-lg max-w-none overflow-wrap-anywhere break-words
              prose-headings:font-heading prose-headings:text-on-surface 
              prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-8 md:prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-outline-variant/30 prose-h2:pb-2
              prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-primary-fixed-dim
              prose-p:text-on-surface-variant prose-p:leading-relaxed
              prose-a:text-primary hover:prose-a:text-primary-fixed-dim prose-a:no-underline prose-a:break-all
              prose-code:text-secondary-fixed-dim prose-code:bg-surface-container prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs md:prose-code:text-sm prose-code:break-words
              prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:overflow-x-auto prose-pre:max-w-[calc(100vw-2rem)] md:prose-pre:max-w-full
              prose-strong:text-on-surface prose-strong:font-semibold
              prose-ul:text-on-surface-variant prose-ol:text-on-surface-variant
              prose-li:marker:text-outline-variant
              prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-table:block prose-table:overflow-x-auto prose-table:max-w-[calc(100vw-2rem)] md:prose-table:max-w-full
              prose-th:border prose-th:border-outline-variant/40 prose-th:bg-surface-container prose-th:p-2 md:prose-th:p-3 prose-th:text-left prose-th:text-on-surface prose-th:font-semibold prose-th:whitespace-nowrap
              prose-td:border prose-td:border-outline-variant/30 prose-td:p-2 md:prose-td:p-3 prose-td:text-on-surface-variant
              prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-surface-container-low prose-blockquote:px-4 md:prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:text-on-surface-variant/90 prose-blockquote:not-italic
              prose-img:max-w-full prose-img:h-auto
            ">
              <MarkdownRenderer content={content} />
            </div>

            <ModuleProgressActions moduleSlug={slug} initialStatus={initialStatus} />

            {/* Footer Navigation */}
            <div className="pt-6 md:pt-8 mt-8 md:mt-12 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-4">
              {prevModule ? (
                <Link href={`/learning/modules/${prevModule.slug}`} className="w-full md:w-auto group">
                  <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl border border-outline-variant/30 bg-surface-dim hover:bg-surface-container hover:border-primary/50 transition-all">
                    <ChevronLeft size={20} className="text-primary shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">Previous Module</div>
                      <div className="text-sm font-semibold text-on-surface truncate md:max-w-[200px]">{prevModule.title}</div>
                    </div>
                  </div>
                </Link>
              ) : <div className="hidden md:block w-full md:w-auto"></div>}

              <Link href="/learning" className="order-first md:order-none w-full md:w-auto text-sm font-mono text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-2 py-3 md:py-0 border border-outline-variant/30 md:border-none rounded-xl md:rounded-none bg-surface-dim md:bg-transparent">
                <BookOpen size={16} />
                Back to Modules
              </Link>

              {nextModule ? (
                <Link href={`/learning/modules/${nextModule.slug}`} className="w-full md:w-auto group md:text-right">
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


      {/* Table of Contents - Right Sidebar */}
      <ModuleTOC headings={headings} />
    </div>
  );
}
