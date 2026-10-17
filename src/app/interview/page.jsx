import clientPromise from '@/lib/db';
import { modules } from '@/lib/curriculumData';
import { InterviewRunner } from '@/components/learning/InterviewRunner';
import { getSessionUser, getUserQuery } from '@/lib/auth-utils';
import { getUserSubscription } from '@/lib/subscriptions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function InterviewPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { hasActiveSubscription } = await getUserSubscription(user.id);
  if (!hasActiveSubscription) {
    redirect('/pricing?feature=interview');
  }

  const client = await clientPromise;
  const db = client.db('webdev-mentor-ai');
  
  const progressDoc = await db.collection('user_progress').findOne(getUserQuery(user.id));
  const userProgress = progressDoc?.modules || {};

  // Find all modules that are 'Completed' or 'In Progress'
  const availableModules = modules.filter(
    (m) => userProgress[m.slug]?.status === 'Completed' || userProgress[m.slug]?.status === 'In Progress'
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-on-surface mb-2">Mock Interview Mode</h1>
        <p className="text-on-surface-variant font-medium text-lg">Test your knowledge with realistic 1-on-1 AI interviews.</p>
      </div>
      
      {availableModules.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface-dim border border-outline-variant/30 rounded-xl">
          <p className="text-lg font-medium text-on-surface mb-2">No Modules Available Yet</p>
          <p className="text-on-surface-variant">You need to start or complete a module in the Learning path before you can take an interview on it.</p>
        </div>
      ) : (
        <InterviewRunner availableModules={availableModules} />
      )}
    </div>
  );
}
