import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { requireAuth, getUserQuery, getUserIdForStorage } from '@/lib/auth-utils';

export async function GET() {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const progressDoc = await db.collection('user_progress').findOne(
      getUserQuery(user.id)
    );

    if (!progressDoc) {
      return NextResponse.json({ modules: {} });
    }

    return NextResponse.json({ modules: progressDoc.modules || {} });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { user, errorResponse } = await requireAuth();
    if (errorResponse) return errorResponse;

    const { moduleSlug, status } = await request.json();

    if (!moduleSlug || !status) {
      return NextResponse.json(
        { error: 'Missing moduleSlug or status' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');
    const storageUserId = getUserIdForStorage(user.id);

    // Update the specific module's status in the user's progress document
    await db.collection('user_progress').updateOne(
      getUserQuery(user.id),
      { 
        $set: { 
          userId: storageUserId,
          [`modules.${moduleSlug}.status`]: status,
          [`modules.${moduleSlug}.updatedAt`]: new Date()
        } 
      },
      { upsert: true }
    );

    // Create a notification for real users when a module is completed
    if (status === 'completed' || status === 'Completed') {
      await db.collection('notifications').insertOne({
        userId: storageUserId,
        title: 'Module Completed!',
        message: `You successfully completed the ${moduleSlug.replace(/-/g, ' ')} module. Keep up the great work!`,
        type: 'progress',
        read: false,
        createdAt: new Date()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
