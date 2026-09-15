"use client";
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Check, Copy } from 'lucide-react';

const CodeBlock = ({ language, children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="relative my-4 group rounded-lg overflow-hidden border border-outline-variant/30 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#1e1e1e] border-b border-white/5">
        <span className="font-mono text-xs text-white/50 lowercase">{language}</span>
        <button 
          className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
          onClick={handleCopy}
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: '#1e1e1e',
          fontSize: '13px',
          lineHeight: '1.5'
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};
const generateId = (children) => {
  let text = '';
  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      text += child;
    } else if (child && child.props && child.props.children) {
      text += generateId(child.props.children);
    }
  });
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export function MarkdownRenderer({ content }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-heading font-bold text-on-surface mt-6 mb-4" {...props} />,
          h2: ({node, children, ...props}) => <h2 id={generateId(children)} className="text-xl font-heading font-bold text-on-surface mt-5 mb-3 border-b border-outline-variant/30 pb-1" {...props}>{children}</h2>,
          h3: ({node, children, ...props}) => <h3 id={generateId(children)} className="text-lg font-heading font-semibold text-on-surface mt-4 mb-2" {...props}>{children}</h3>,
          p: ({node, ...props}) => <p className="font-body text-[15px] leading-relaxed text-on-surface-variant mb-4 last:mb-0" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-4 text-on-surface-variant space-y-1 marker:text-primary" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 mb-4 text-on-surface-variant space-y-1 marker:text-primary" {...props} />,
          li: ({node, ...props}) => <li className="pl-1 leading-relaxed" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-on-surface" {...props} />,
          em: ({node, ...props}) => <em className="italic text-on-surface-variant" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-2 border-primary bg-primary/5 px-4 py-2 my-4 rounded-r-md italic text-on-surface-variant" {...props} />
          ),
          a: ({node, ...props}) => <a className="text-tertiary hover:underline hover:text-tertiary-hover transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
          hr: ({node, ...props}) => <hr className="border-outline-variant/30 my-6" {...props} />,
          table: ({node, ...props}) => (
            <div className="overflow-x-auto mb-4 border border-outline-variant/20 rounded-lg">
              <table className="w-full text-left border-collapse text-sm" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="bg-surface-container border-b border-outline-variant/20" {...props} />,
          th: ({node, ...props}) => <th className="p-3 font-semibold text-on-surface" {...props} />,
          td: ({node, ...props}) => <td className="p-3 border-b border-outline-variant/10 text-on-surface-variant" {...props} />,
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (!inline && match) {
              return (
                <CodeBlock language={language} {...props}>
                  {children}
                </CodeBlock>
              );
            }
            return (
              <code className="px-1.5 py-0.5 rounded-md bg-surface-bright/50 text-primary font-mono text-[13px]" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
