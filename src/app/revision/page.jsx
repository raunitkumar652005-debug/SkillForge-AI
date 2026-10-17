import { BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import clientPromise from '@/lib/db'
import { getAllRevisionData } from '@/lib/revisionParser'
import { RevisionClient } from './RevisionClient'
import { getSessionUser, getUserQuery } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function RevisionPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const client = await clientPromise;
  const db = client.db('webdev-mentor-ai');
  const progressDoc = await db.collection('user_progress').findOne(getUserQuery(user.id));
  const userProgress = progressDoc?.modules || {};

  const revisionData = await getAllRevisionData();

  return (
    <div className="absolute inset-0 flex bg-background overflow-hidden z-10">
      <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-widest uppercase">
              <BookOpen size={16} />
              <span>Revision Hub</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-on-surface tracking-tight">
              Revision
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-sans">
              Quickly review concepts, questions, code and key takeaways from your completed learning modules.
            </p>
          </div>

          <RevisionClient revisionData={revisionData} userProgress={userProgress} />
        </div>
      </div>
    </div>
  )
}
