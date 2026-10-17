import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { getUserQuery } from '@/lib/auth-utils';
import { requireSubscription } from '@/lib/subscriptions';

export async function GET(req) {
  try {
    const { user, errorResponse } = await requireSubscription();
    if (errorResponse) return errorResponse;

    const { searchParams } = new URL(req.url);
    const conversationIdParam = searchParams.get('conversationId');
    const isNew = searchParams.get('new') === 'true';

    if (isNew) {
      // Return new empty state without creating DB entry, no need to connect to DB yet
      return NextResponse.json({
        conversationId: null,
        sessionId: crypto.randomUUID(),
        title: 'New Conversation',
        messages: []
      });
    }

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');
    
    let conversation = null;
    let messages = [];
    
    if (conversationIdParam) {
      // Find specific conversation belonging to this user
      try {
        conversation = await db.collection('conversations').findOne({
          _id: new ObjectId(conversationIdParam),
          ...getUserQuery(user.id)
        });
      } catch (e) {
        return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
      }
      
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }
    } else {
      // Find the latest active conversation for the user
      conversation = await db.collection('conversations').findOne(
        getUserQuery(user.id),
        { sort: { updatedAt: -1 } }
      );
    }
    
    if (!conversation && !isNew) {
      // Return new empty state without creating DB entry
      return NextResponse.json({
        conversationId: null,
        sessionId: crypto.randomUUID(),
        title: 'New Conversation',
        messages: []
      });
    }

    if (!isNew && conversation) {
      // Fetch messages for this conversation
      messages = await db.collection('messages').find(
        { conversationId: conversation._id }
      ).sort({ createdAt: 1 }).toArray();
    }
    
    // Format messages for the frontend
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    return NextResponse.json({
      conversationId: conversation._id.toString(),
      sessionId: conversation.sessionId,
      title: conversation.title || 'New Conversation',
      messages: formattedMessages
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch history', details: error.message, stack: error.stack }, { status: 500 });
  }
}
