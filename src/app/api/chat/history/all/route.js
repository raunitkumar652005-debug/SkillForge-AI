import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    const userId = 'local-dev-user-temp';
    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');
    
    let filter = { userId };
    
    if (query) {
      // Find messages that match the query
      const matchedMessages = await db.collection('messages')
        .find({ content: { $regex: query, $options: 'i' } })
        .project({ conversationId: 1 })
        .toArray();
        
      const matchedConvIds = matchedMessages.map(m => m.conversationId);
      
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { _id: { $in: matchedConvIds } }
      ];
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
