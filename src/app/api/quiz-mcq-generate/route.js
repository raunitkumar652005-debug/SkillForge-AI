import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from '@/lib/db';
import crypto from 'crypto';
import { getUserIdForStorage } from '@/lib/auth-utils';
import { requireSubscription } from '@/lib/subscriptions';

export async function POST(request) {
  try {
    const { user, errorResponse } = await requireSubscription();
    if (errorResponse) return errorResponse;

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const modulesDir = path.join(process.cwd(), 'content/modules/31_modules_FSD');
    const files = await fs.readdir(modulesDir);
    const targetFile = files.find(f => f.replace('.md', '').toLowerCase() === slug);
    
    if (!targetFile) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const filePath = path.join(modulesDir, targetFile);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // We only need a portion of the content to generate questions so we don't exceed token limits.
    const truncatedContent = content.substring(0, 8000);

    const LYZR_API_KEY = process.env.LYZR_API_KEY;
    const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID;

    const prompt = `You are a strict technical quiz generator. 
Based on the following learning module content, generate exactly 12 multiple choice questions.
You MUST output ONLY a valid JSON array of objects. Do not wrap in markdown code blocks. Do not add any text before or after the JSON.
Each object in the array MUST have exactly these keys:
- "id": a unique string identifier (e.g. "q1")
- "question": the question text
- "options": an array of exactly 4 strings
- "correctOptionIndex": an integer from 0 to 3 representing the correct option
- "explanation": a brief explanation of why the correct option is correct

Module Content:
"""
${truncatedContent}
"""
`;

    if (!LYZR_API_KEY || !LYZR_AGENT_ID) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const lyzrPayload = {
      user_id: user.id,
      agent_id: LYZR_AGENT_ID,
      session_id: `quiz-gen-${Date.now()}`,
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
    let rawJsonResponse = data.response;

    // Clean the response just in case the AI added markdown blocks
    rawJsonResponse = rawJsonResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let questions;
    try {
      questions = JSON.parse(rawJsonResponse);
      
      // Validate schema
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Parsed data is not a valid array");
      }
      
      for (const q of questions) {
        if (!q.id || !q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctOptionIndex !== 'number' || !q.explanation) {
          throw new Error("Parsed data does not match required schema");
        }
      }
    } catch (parseError) {
      console.error("Failed to parse or validate AI response:", rawJsonResponse);
      return NextResponse.json({ error: 'Failed to generate a valid quiz. Please try again.' }, { status: 500 });
    }

    // Store the full questions (with answer keys) in MongoDB
    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');
    const quizId = crypto.randomUUID();
    
    await db.collection('quiz_sessions').insertOne({
      quizId,
      userId: getUserIdForStorage(user.id),
      slug,
      questions,
      createdAt: new Date()
    });

    // Strip out correctOptionIndex and explanation before sending to client
    const clientQuestions = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    return NextResponse.json({ quizId, questions: clientQuestions });

  } catch (error) {
    console.error('Error generating MCQ quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
