"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ChevronRight, Loader2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

export function QuizRunner({ availableModules }) {
  const [mode, setMode] = useState('descriptive'); // 'descriptive' | 'objective'
  const [selectedModuleSlug, setSelectedModuleSlug] = useState(availableModules[0]?.slug || '');
  
  // Descriptive Quiz State
  const [descQuestions, setDescQuestions] = useState([]);
  const [currentDescIndex, setCurrentDescIndex] = useState(0);
  const [isLoadingDesc, setIsLoadingDesc] = useState(mode === 'descriptive');
  const [descAnswer, setDescAnswer] = useState('');
  const [descFeedback, setDescFeedback] = useState(null);
  const [isGradingDesc, setIsGradingDesc] = useState(false);

  // Objective Quiz State
  const [mcqQuizId, setMcqQuizId] = useState(null);
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [isGeneratingMcq, setIsGeneratingMcq] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [mcqFeedback, setMcqFeedback] = useState(null);
  const [isCheckingMcq, setIsCheckingMcq] = useState(false);
  const [mcqStats, setMcqStats] = useState({ correct: 0, incorrect: 0 });
  const [mcqFinished, setMcqFinished] = useState(false);

  const resetAllState = () => {
    setMcqQuizId(null);
    setMcqQuestions([]);
    setCurrentMcqIndex(0);
    setSelectedOption(null);
    setMcqFeedback(null);
    setMcqStats({ correct: 0, incorrect: 0 });
    setMcqFinished(false);
    
    setDescQuestions([]);
    setCurrentDescIndex(0);
    setDescFeedback(null);
    setDescAnswer('');
  };

  const handleModuleChange = (e) => {
    setSelectedModuleSlug(e.target.value);
    resetAllState();
    if (mode === 'descriptive') {
      setIsLoadingDesc(true);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetAllState();
    if (newMode === 'descriptive') {
      setIsLoadingDesc(true);
    }
  };

  useEffect(() => {
    if (selectedModuleSlug && mode === 'descriptive') {
      let active = true;
      fetch(`/api/quiz-questions?slug=${selectedModuleSlug}`)
        .then(res => {
          if (res.status === 403) {
            window.location.href = '/pricing?feature=quiz';
            return null;
          }
          return res.json();
        })
        .then(data => {
          if (active && data && data.questions) {
            setDescQuestions(data.questions);
          }
        })
        .catch(err => console.error("Error fetching desc questions:", err))
        .finally(() => {
          if (active) setIsLoadingDesc(false);
        });
      
      return () => {
        active = false;
      };
    }
  }, [selectedModuleSlug, mode]);

  const handleDescSubmit = async () => {
    if (!descAnswer.trim()) return;
    setIsGradingDesc(true);
    setDescFeedback(null);
    try {
      const res = await fetch('/api/quiz-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: descQuestions[currentDescIndex],
          answer: descAnswer
        })
      });
      if (res.status === 403) {
        window.location.href = '/pricing?feature=quiz';
        return;
      }
      const data = await res.json();
      setDescFeedback(data.feedback);
    } catch (err) {
      console.error(err);
      setDescFeedback("Sorry, an error occurred while grading. Please try again.");
    } finally {
      setIsGradingDesc(false);
    }
  };

  const handleDescNext = () => {
    setDescAnswer('');
    setDescFeedback(null);
    setCurrentDescIndex(prev => prev + 1);
  };

  const generateMcqQuiz = async () => {
    setIsGeneratingMcq(true);
    setMcqQuestions([]);
    try {
      const res = await fetch('/api/quiz-mcq-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: selectedModuleSlug })
      });
      if (res.status === 403) {
        window.location.href = '/pricing?feature=quiz';
        return;
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMcqQuizId(data.quizId);
      setMcqQuestions(data.questions);
      setCurrentMcqIndex(0);
      setMcqStats({ correct: 0, incorrect: 0 });
      setMcqFinished(false);
    } catch (err) {
      console.error(err);
      alert("Failed to generate objective quiz. Please try again.");
    } finally {
      setIsGeneratingMcq(false);
    }
  };

  const checkMcqAnswer = async () => {
    if (selectedOption === null) return;
    setIsCheckingMcq(true);
    try {
      const currentQ = mcqQuestions[currentMcqIndex];
      const res = await fetch('/api/quiz-mcq-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: mcqQuizId,
          questionId: currentQ.id,
          selectedOptionIndex: selectedOption
        })
      });
      if (res.status === 403) {
        window.location.href = '/pricing?feature=quiz';
        return;
      }
      const data = await res.json();
      setMcqFeedback(data);
      if (data.isCorrect) {
        setMcqStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setMcqStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to check answer.");
    } finally {
      setIsCheckingMcq(false);
    }
  };

  const handleMcqNext = () => {
    if (currentMcqIndex < mcqQuestions.length - 1) {
      setSelectedOption(null);
      setMcqFeedback(null);
      setCurrentMcqIndex(prev => prev + 1);
    } else {
      setMcqFinished(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-surface-dim p-4 rounded-xl border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-on-surface-variant mb-1">Select Module:</label>
            <select 
              className="w-full bg-surface border border-outline-variant/50 rounded-lg px-4 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              value={selectedModuleSlug}
              onChange={handleModuleChange}
            >
              {availableModules.map(m => (
                <option key={m.slug} value={m.slug}>Module {m.number}: {m.title}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-on-surface-variant mb-1">Mode:</label>
            <div className="flex bg-surface-container rounded-lg p-1 border border-outline-variant/30">
              <button 
                onClick={() => handleModeChange('descriptive')}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${mode === 'descriptive' ? 'bg-primary text-on-primary font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Descriptive
              </button>
              <button 
                onClick={() => handleModeChange('objective')}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors ${mode === 'objective' ? 'bg-primary text-on-primary font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Objective (MCQ)
              </button>
            </div>
          </div>
        </div>
      </div>

      {mode === 'descriptive' ? (
        // --- DESCRIPTIVE QUIZ MODE ---
        isLoadingDesc ? (
          <div className="py-20 flex justify-center">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : descQuestions.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-outline-variant/30 rounded-xl">
            <p className="text-on-surface-variant">No descriptive questions found for this module.</p>
          </div>
        ) : (
          currentDescIndex < descQuestions.length ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-sm font-mono text-on-surface-variant">
                <span>Question {currentDescIndex + 1} of {descQuestions.length}</span>
                <span className="text-primary">{Math.round(((currentDescIndex) / descQuestions.length) * 100)}% Complete</span>
              </div>
              
              <Card className="border-primary/20 shadow-lg shadow-primary/5">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-on-surface mb-6">
                    {descQuestions[currentDescIndex]}
                  </h2>
                  
                  <div className="space-y-4">
                    <textarea 
                      className="w-full h-32 md:h-40 bg-surface-container-low border border-outline-variant/50 rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                      placeholder="Type your answer here..."
                      value={descAnswer}
                      onChange={(e) => setDescAnswer(e.target.value)}
                      disabled={isGradingDesc || descFeedback}
                    />
                    
                    {!descFeedback ? (
                      <div className="flex justify-end">
                        <Button onClick={handleDescSubmit} disabled={isGradingDesc || !descAnswer.trim()} variant="primary">
                          {isGradingDesc ? <><Loader2 size={16} className="animate-spin mr-2"/> Grading...</> : 'Submit Answer'}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 prose prose-invert prose-sm max-w-none prose-p:leading-relaxed">
                          <div className="text-xs font-mono text-primary mb-2 uppercase tracking-widest">AI Feedback</div>
                          <MarkdownRenderer content={descFeedback} />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button onClick={handleDescNext} variant="primary">
                            Next Question <ChevronRight size={16} className="ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-surface-dim rounded-xl border border-outline-variant/30">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <RefreshCw size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-on-surface mb-2">Quiz Completed!</h2>
              <p className="text-on-surface-variant mb-6">You&apos;ve answered all descriptive questions.</p>
              <Button variant="secondary" onClick={() => setCurrentDescIndex(0)}>
                Retry Quiz
              </Button>
            </div>
          )
        )
      ) : (
        // --- OBJECTIVE QUIZ MODE ---
        mcqFinished ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-surface-dim rounded-xl border border-outline-variant/30">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-on-surface mb-2">Quiz Completed!</h2>
            <p className="text-on-surface-variant mb-6">You scored {mcqStats.correct} out of 12.</p>
            <div className="flex gap-4 mb-8">
              <div className="bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 px-6 py-3 rounded-lg text-lg font-bold">
                {mcqStats.correct} Correct
              </div>
              <div className="bg-error/10 border border-error/30 text-error px-6 py-3 rounded-lg text-lg font-bold">
                {mcqStats.incorrect} Incorrect
              </div>
              <div className="bg-primary/10 border border-primary/30 text-primary px-6 py-3 rounded-lg text-lg font-bold">
                {Math.round((mcqStats.correct / 12) * 100)}%
              </div>
            </div>
            <Button variant="primary" onClick={() => { setMcqFinished(false); generateMcqQuiz(); }}>
              Generate New Objective Quiz
            </Button>
          </div>
        ) : mcqQuestions.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-surface-dim rounded-xl border border-outline-variant/30">
            <h2 className="text-2xl font-heading font-bold text-on-surface mb-2">Objective Quiz Mode</h2>
            <p className="text-on-surface-variant mb-6 max-w-md">Generate 12 dynamic multiple-choice questions based strictly on the module content using Lyzr AI.</p>
            <Button variant="primary" onClick={generateMcqQuiz} disabled={isGeneratingMcq}>
              {isGeneratingMcq ? <><Loader2 size={16} className="animate-spin mr-2"/> Generating 12 MCQs...</> : 'Start Objective Quiz'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm font-mono text-on-surface-variant">
              <span>Question {currentMcqIndex + 1} of {mcqQuestions.length}</span>
              <span className="text-primary">{Math.round(((currentMcqIndex) / mcqQuestions.length) * 100)}% Complete</span>
            </div>
            
            <Card className="border-primary/20 shadow-lg shadow-primary/5">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-on-surface mb-6">
                  {mcqQuestions[currentMcqIndex].question}
                </h2>
                
                <div className="space-y-4">
                  {mcqQuestions[currentMcqIndex].options.map((opt, idx) => {
                    let optionStateClass = "bg-surface-container-low border-outline-variant/50 hover:border-primary text-on-surface";
                    if (mcqFeedback) {
                      if (idx === mcqFeedback.correctOptionIndex) {
                        optionStateClass = "bg-emerald-400/10 border-emerald-400 text-emerald-400";
                      } else if (idx === selectedOption && !mcqFeedback.isCorrect) {
                        optionStateClass = "bg-error/10 border-error text-error";
                      } else {
                        optionStateClass = "bg-surface-container-low border-outline-variant/20 opacity-50";
                      }
                    } else if (selectedOption === idx) {
                      optionStateClass = "bg-primary/20 border-primary text-primary font-medium";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={mcqFeedback !== null}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${optionStateClass}`}
                      >
                        <div className="flex items-start">
                          <span className="font-mono mr-3 opacity-70">{['A', 'B', 'C', 'D'][idx]}.</span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}

                  {!mcqFeedback ? (
                    <div className="flex justify-end pt-4">
                      <Button onClick={checkMcqAnswer} disabled={selectedOption === null || isCheckingMcq} variant="primary">
                        {isCheckingMcq ? <><Loader2 size={16} className="animate-spin mr-2"/> Checking...</> : 'Submit Answer'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className={`p-4 rounded-xl border ${mcqFeedback.isCorrect ? 'bg-emerald-400/10 border-emerald-400/30' : 'bg-error/10 border-error/30'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {mcqFeedback.isCorrect ? (
                            <><CheckCircle size={18} className="text-emerald-400"/> <span className="text-emerald-400 font-bold">Correct!</span></>
                          ) : (
                            <><XCircle size={18} className="text-error"/> <span className="text-error font-bold">Incorrect</span></>
                          )}
                        </div>
                        <p className="text-on-surface text-sm leading-relaxed">{mcqFeedback.explanation}</p>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button onClick={handleMcqNext} variant="primary">
                          {currentMcqIndex < mcqQuestions.length - 1 ? (
                            <>Next Question <ChevronRight size={16} className="ml-2" /></>
                          ) : (
                            'View Results'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  );
}
