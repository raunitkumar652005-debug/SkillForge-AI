"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2 } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

export function InterviewRunner({ availableModules }) {
  const [selectedModuleSlug, setSelectedModuleSlug] = useState(availableModules[0]?.slug || '');
  
  const [interviewSessionId, setInterviewSessionId] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]); // Array of { role: 'ai'|'user', content: string }
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [interviewInput, setInterviewInput] = useState('');
  const [isInterviewLoading, setIsInterviewLoading] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);

  const handleModuleChange = (e) => {
    setSelectedModuleSlug(e.target.value);
    setInterviewSessionId(null);
    setInterviewHistory([]);
    setIsInterviewActive(false);
    setInterviewInput('');
    setInterviewFinished(false);
  };

  const startInterview = async () => {
    setIsInterviewLoading(true);
    const sid = `interview-${Date.now()}`;
    setInterviewSessionId(sid);
    try {
      const res = await fetch('/api/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START', slug: selectedModuleSlug, sessionId: sid })
      });
      if (res.status === 403) {
        window.location.href = '/pricing?feature=interview';
        return;
      }
      const data = await res.json();
      setInterviewHistory([{ role: 'ai', content: data.response }]);
      setIsInterviewActive(true);
      setInterviewFinished(false);
    } catch (err) {
      console.error(err);
      alert("Failed to start interview.");
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const submitInterviewAnswer = async () => {
    if (!interviewInput.trim()) return;
    setIsInterviewLoading(true);
    const answer = interviewInput;
    setInterviewInput('');
    setInterviewHistory(prev => [...prev, { role: 'user', content: answer }]);
    
    try {
      const res = await fetch('/api/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ANSWER', userAnswer: answer, sessionId: interviewSessionId })
      });
      if (res.status === 403) {
        window.location.href = '/pricing?feature=interview';
        return;
      }
      const data = await res.json();
      setInterviewHistory(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (err) {
      console.error(err);
      setInterviewHistory(prev => [...prev, { role: 'ai', content: "Error communicating with AI. Please try answering again." }]);
    } finally {
      setIsInterviewLoading(false);
    }
  };

  const endInterview = async () => {
    setIsInterviewLoading(true);
    try {
      const res = await fetch('/api/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'END', sessionId: interviewSessionId })
      });
      if (res.status === 403) {
        window.location.href = '/pricing?feature=interview';
        return;
      }
      const data = await res.json();
      setInterviewHistory(prev => [...prev, { role: 'ai', content: data.response }]);
      setIsInterviewActive(false);
      setInterviewFinished(true);
    } catch (err) {
      console.error(err);
      alert("Failed to end interview properly.");
    } finally {
      setIsInterviewLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-surface-dim p-4 rounded-xl border border-outline-variant/30">
        <div className="flex flex-col w-full sm:w-auto">
          <label className="text-sm font-medium text-on-surface-variant mb-1">Select Module:</label>
          <select 
            className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            value={selectedModuleSlug}
            onChange={handleModuleChange}
            disabled={isInterviewActive}
          >
            {availableModules.map(m => (
              <option key={m.slug} value={m.slug}>Module {m.number}: {m.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {!isInterviewActive && !interviewFinished ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-surface-dim rounded-xl border border-outline-variant/30">
            <h2 className="text-2xl font-heading font-bold text-on-surface mb-2">Mock Interview Studio</h2>
            <p className="text-on-surface-variant mb-6 max-w-lg">Engage in a realistic 1-on-1 interview session. The AI will ask you module-specific questions, evaluate your text responses, and dynamically adjust based on your answers.</p>
            <Button variant="primary" onClick={startInterview} disabled={isInterviewLoading}>
              {isInterviewLoading ? <><Loader2 size={16} className="animate-spin mr-2"/> Starting Interview...</> : 'Start Interview'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              {interviewHistory.map((msg, idx) => (
                <Card key={idx} className={`border-outline-variant/30 ${msg.role === 'ai' ? 'bg-surface shadow-md' : 'bg-surface-container-low border-none opacity-80'}`}>
                  <CardContent className="p-6">
                    <div className="text-xs font-mono mb-2 uppercase tracking-widest text-on-surface-variant">
                      {msg.role === 'ai' ? (idx === interviewHistory.length - 1 && interviewFinished ? 'Interview Summary' : 'Interviewer (AI)') : 'Your Answer'}
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed text-on-surface">
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {isInterviewActive && (
              <Card className="border-primary/20 shadow-lg shadow-primary/5">
                <CardContent className="p-6">
                  <textarea 
                    className="w-full h-32 bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none mb-4"
                    placeholder="Type your answer to the interviewer's question..."
                    value={interviewInput}
                    onChange={(e) => setInterviewInput(e.target.value)}
                    disabled={isInterviewLoading}
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button onClick={endInterview} disabled={isInterviewLoading} variant="ghost" className="text-error hover:text-error hover:bg-error/10 w-full sm:w-auto">
                      End Interview
                    </Button>
                    <Button onClick={submitInterviewAnswer} disabled={isInterviewLoading || !interviewInput.trim()} variant="primary" className="w-full sm:w-auto">
                      {isInterviewLoading ? <><Loader2 size={16} className="animate-spin mr-2"/> Evaluating...</> : 'Submit Answer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {interviewFinished && (
              <div className="flex justify-center mt-6">
                <Button variant="primary" onClick={() => { setInterviewHistory([]); setInterviewFinished(false); }}>
                  Start New Interview
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
