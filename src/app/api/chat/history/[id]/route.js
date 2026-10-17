import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { getUserQuery } from '@/lib/auth-utils';
import { requireSubscription } from '@/lib/subscriptions';

export async function PATCH(req, { params }) {
  try {
    const { user, errorResponse } = await requireSubscription();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    const { title } = await req.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const result = await db.collection('conversations').updateOne(
      { _id: objectId, ...getUserQuery(user.id) },
      { $set: { title, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rename error:', error);
    return NextResponse.json({ error: 'Failed to rename conversation' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { user, errorResponse } = await requireSubscription();
    if (errorResponse) return errorResponse;

    const { id } = await params;
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const conversation = await db.collection('conversations').findOne({
      _id: objectId,
      ...getUserQuery(user.id)
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messagesResult = await db.collection('messages').deleteMany({
      conversationId: objectId
    });

    const convResult = await db.collection('conversations').deleteOne({
      _id: objectId,
      ...getUserQuery(user.id)
    });

    return NextResponse.json({ success: true, deletedCount: convResult.deletedCount });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete conversation', details: error.message }, { status: 500 });
  }
}
