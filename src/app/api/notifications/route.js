import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';
import { requireAuth, getUserQuery, toObjectId } from '@/lib/auth-utils';

export async function GET() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const notifications = await db.collection('notifications')
      .find(getUserQuery(user.id))
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');
    const userFilter = getUserQuery(user.id);

    const { action, notificationId } = await request.json();

    if (action === 'markRead' && notificationId) {
      let notifObjectId;
      try {
        notifObjectId = new ObjectId(notificationId);
      } catch {
        return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 });
      }

      await db.collection('notifications').updateOne(
        { _id: notifObjectId, ...userFilter },
        { $set: { read: true } }
      );
    } else if (action === 'markAllRead') {
      await db.collection('notifications').updateMany(
        { ...userFilter, read: false },
        { $set: { read: true } }
      );
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    await db.collection('notifications').deleteMany(getUserQuery(user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
