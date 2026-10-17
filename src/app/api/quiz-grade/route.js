import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { getUserIdForStorage } from '@/lib/auth-utils';
import { requireSubscription } from '@/lib/subscriptions';

export async function POST(request) {
  try {
    const { user, errorResponse } = await requireSubscription();
    if (errorResponse) return errorResponse;

    const { question, answer } = await request.json();
    
    if (!question || !answer) {
      return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });
    }

    const LYZR_API_KEY = process.env.LYZR_API_KEY;
    const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID;

    const prompt = `You are a strict but encouraging Web Development interviewer. 
The user was asked the following question:
"${question}"

The user provided the following answer:
"${answer}"

Please evaluate their answer. 
1. Grade it out of 10.
2. Provide a brief explanation of what they got right, and what they missed or could improve. 
Keep your feedback under 4 sentences.`;

    const USE_MOCK = process.env.MOCK_LYZR !== 'false';
    let feedback = "";

    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      feedback = "Grade: 8/10.\n\nGood answer! You correctly identified the main concept, but missed some nuance about how it behaves in edge cases. Overall, a solid response.";
    } else {
      if (!LYZR_API_KEY || !LYZR_AGENT_ID) {
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
      }

      const lyzrPayload = {
        user_id: user.id,
        agent_id: LYZR_AGENT_ID,
        session_id: `quiz-${Date.now()}`,
        message: prompt,
      };

      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': LYZR_API_KEY,
        },
        body: JSON.stringify(lyzrPayload),
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to communicate with AI' }, { status: 500 });
      }

      const data = await response.json();
      feedback = data.response;
      feedback = feedback.replace(/^Score:\s*\d+(\.\d+)?.*$/gim, '').trim();
    }

    // Create a notification for the authenticated user
    try {
      const client = await clientPromise;
      const db = client.db('webdev-mentor-ai');
      
      let scoreMatch = feedback.match(/(\d+)\/10/);
      let scoreStr = scoreMatch ? `You scored ${scoreMatch[1]}/10.` : "Your quiz has been graded.";
      
      await db.collection('notifications').insertOne({
        userId: getUserIdForStorage(user.id),
        title: 'Quiz Graded',
        message: `${scoreStr} Check your recent activity for detailed feedback.`,
        type: 'quiz',
        read: false,
        createdAt: new Date()
      });
    } catch (err) {
      console.error("Failed to create quiz notification:", err);
    }

    return NextResponse.json({ feedback });

  } catch (error) {
    console.error('Error grading quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
