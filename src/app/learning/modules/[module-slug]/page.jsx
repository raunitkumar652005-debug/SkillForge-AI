import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, ListTree } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { modules } from '@/lib/curriculumData';
import { Card } from '@/components/ui/Card';

export async function generateStaticParams() {
  return modules.map((mod) => ({
    'module-slug': mod.slug,
  }));
}

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

  return (
    <div className="flex-1 overflow-auto bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm font-mono text-on-surface-variant mb-6">
          <Link href="/learning" className="hover:text-primary transition-colors">Learning</Link>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <span>Full-Stack Development</span>
          <ChevronRight size={14} className="mx-2 opacity-50" />
          <span className="text-primary truncate">Module {moduleData.number}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Header */}
            <div className="space-y-4 pb-6 border-b border-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-xl">
                  {moduleData.number}
                </div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-on-surface tracking-tight leading-tight">
                  {moduleData.title}
                </h1>
              </div>
              <p className="text-on-surface-variant text-lg leading-relaxed font-sans mt-4">
                {moduleData.description}
              </p>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-invert prose-lg max-w-none 
              prose-headings:font-heading prose-headings:text-on-surface 
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-outline-variant/30 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-primary-fixed-dim
              prose-p:text-on-surface-variant prose-p:leading-relaxed
              prose-a:text-primary hover:prose-a:text-primary-fixed-dim prose-a:no-underline
              prose-code:text-secondary-fixed-dim prose-code:bg-surface-container prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
              prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
              prose-strong:text-on-surface prose-strong:font-semibold
              prose-ul:text-on-surface-variant prose-ol:text-on-surface-variant
              prose-li:marker:text-outline-variant
              prose-table:border-collapse prose-table:w-full prose-table:my-6
              prose-th:border prose-th:border-outline-variant/40 prose-th:bg-surface-container prose-th:p-3 prose-th:text-left prose-th:text-on-surface prose-th:font-semibold
              prose-td:border prose-td:border-outline-variant/30 prose-td:p-3 prose-td:text-on-surface-variant
              prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-surface-container-low prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:text-on-surface-variant/90 prose-blockquote:not-italic
            ">
              <MarkdownRenderer content={content} />
            </div>

            {/* Footer Navigation */}
            <div className="pt-8 mt-12 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              {prevModule ? (
                <Link href={`/learning/modules/${prevModule.slug}`} className="w-full sm:w-auto group">
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-outline-variant/30 bg-surface-dim hover:bg-surface-container hover:border-primary/50 transition-all">
                    <ChevronLeft size={20} className="text-primary" />
                    <div>
                      <div className="text-xs font-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">Previous Module</div>
                      <div className="text-sm font-semibold text-on-surface truncate max-w-[200px]">{prevModule.title}</div>
                    </div>
                  </div>
                </Link>
              ) : <div className="w-full sm:w-auto"></div>}

              <Link href="/learning" className="text-sm font-mono text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                <BookOpen size={16} />
                Back to Modules
              </Link>

              {nextModule ? (
                <Link href={`/learning/modules/${nextModule.slug}`} className="w-full sm:w-auto group text-right">
                  <div className="flex items-center justify-end gap-3 p-4 rounded-xl border border-outline-variant/30 bg-surface-dim hover:bg-surface-container hover:border-primary/50 transition-all">
                    <div>
                      <div className="text-xs font-mono text-on-surface-variant mb-1 group-hover:text-primary transition-colors">Next Module</div>
                      <div className="text-sm font-semibold text-on-surface truncate max-w-[200px]">{nextModule.title}</div>
                    </div>
                    <ChevronRight size={20} className="text-primary" />
                  </div>
                </Link>
              ) : <div className="w-full sm:w-auto"></div>}
            </div>
          </div>

          {/* Table of Contents - Sticky Sidebar */}
          <div className="hidden lg:block relative">
            <div className="sticky top-8">
              <Card className="bg-surface-dim border border-outline-variant/40 p-5">
                <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase mb-4 border-b border-outline-variant/30 pb-3">
                  <ListTree size={16} />
                  <span>On this page</span>
                </div>
                {headings.length > 0 ? (
                  <ul className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {headings.map((heading, i) => (
                      <li key={i} className={`text-sm ${heading.level === 3 ? 'ml-4' : ''}`}>
                        <a 
                          href={`#${heading.id}`}
                          className="text-on-surface-variant/80 hover:text-primary transition-colors line-clamp-2 leading-tight"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-on-surface-variant italic">No sections found.</p>
                )}
              </Card>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
