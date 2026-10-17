"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ModuleProgressActions({ moduleSlug, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const router = useRouter();

  useEffect(() => {
    if (status === 'Not Started' || !status) {
      // Mark as In Progress automatically when visiting
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleSlug, status: 'In Progress' })
      }).then(() => {
        setStatus('In Progress');
        router.refresh(); // Refresh to update server components (like the Learning index page) in the background
      }).catch(err => console.error('Failed to update progress', err));
    }
  }, [moduleSlug, status, router]);

  const handleMarkComplete = async () => {
    setStatus('Completed');
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleSlug, status: 'Completed' })
      });
      router.refresh();
    } catch (err) {
      console.error('Failed to mark complete', err);
      // Revert if failed
      setStatus(initialStatus);
    }
  };

  return (
    <div className="flex justify-center w-full pb-8">
      <Button 
        onClick={handleMarkComplete} 
        disabled={status === 'Completed'}
        variant={status === 'Completed' ? 'primary' : 'secondary'}
        className="w-full sm:w-auto min-w-[200px]"
      >
        <CheckCircle size={18} className="mr-2" />
        {status === 'Completed' ? 'Completed' : 'Mark as Complete'}
      </Button>
    </div>
  );
}
