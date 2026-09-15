import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { title } = await req.json();
    const userId = 'local-dev-user-temp';

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const result = await db.collection('conversations').updateOne(
      { _id: new ObjectId(id), userId },
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
    const { id } = await params;
    const userId = 'local-dev-user-temp';
    console.log(`DELETE request received for conversation ID: ${id}`);

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const conversation = await db.collection('conversations').findOne({
      _id: new ObjectId(id),
      userId
    });

    if (!conversation) {
      console.error(`DELETE failed: Conversation ${id} not found for user ${userId}`);
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messagesResult = await db.collection('messages').deleteMany({
      conversationId: new ObjectId(id)
    });
    console.log(`Deleted ${messagesResult.deletedCount} messages for conversation ${id}`);

    const convResult = await db.collection('conversations').deleteOne({
      _id: new ObjectId(id)
    });
    console.log(`Deleted conversation result: ${convResult.deletedCount}`);

    return NextResponse.json({ success: true, deletedCount: convResult.deletedCount });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete conversation', details: error.message }, { status: 500 });
  }
}
