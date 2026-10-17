import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { getUserQuery } from '@/lib/auth-utils';
import { requireSubscription } from '@/lib/subscriptions';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { user, errorResponse } = await requireSubscription();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');
    
    let filter = { ...getUserQuery(user.id) };
    
    if (query) {
      // Find user's conversation IDs first to strictly isolate search
      const userConvs = await db.collection('conversations')
        .find(getUserQuery(user.id))
        .project({ _id: 1 })
        .toArray();
      const userConvIds = userConvs.map(c => c._id);

      // Find matching messages strictly within this user's conversations
      const matchedMessages = await db.collection('messages')
        .find({ conversationId: { $in: userConvIds }, content: { $regex: query, $options: 'i' } })
        .project({ conversationId: 1 })
        .toArray();
        
      const matchedConvIds = matchedMessages.map(m => m.conversationId);
      
      filter = {
        ...getUserQuery(user.id),
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { _id: { $in: matchedConvIds } }
        ]
      };
    }
    
    const conversations = await db.collection('conversations')
      .find(filter)
      .sort({ updatedAt: -1 })
      .project({ _id: 1, title: 1, updatedAt: 1, sessionId: 1 })
      .toArray();
      
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('All history fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations list' }, { status: 500 });
  }
}
