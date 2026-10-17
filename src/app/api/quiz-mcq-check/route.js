import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { getUserQuery } from '@/lib/auth-utils';
import { requireSubscription } from '@/lib/subscriptions';

export async function POST(request) {
  try {
    const { user, errorResponse } = await requireSubscription();
    if (errorResponse) return errorResponse;

    const { quizId, questionId, selectedOptionIndex } = await request.json();

    if (!quizId || !questionId || typeof selectedOptionIndex !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    const quizSession = await db.collection('quiz_sessions').findOne({
      quizId,
      ...getUserQuery(user.id)
    });
    
    if (!quizSession) {
      return NextResponse.json({ error: 'Quiz session not found' }, { status: 404 });
    }

    const question = quizSession.questions.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = question.correctOptionIndex === selectedOptionIndex;

    return NextResponse.json({
      isCorrect,
      correctOptionIndex: question.correctOptionIndex,
      explanation: question.explanation
    });

  } catch (error) {
    console.error('Error checking MCQ answer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
