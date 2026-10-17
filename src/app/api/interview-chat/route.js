import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from '@/lib/db';
import { getUserIdForStorage } from '@/lib/auth-utils';
import { requireSubscription } from '@/lib/subscriptions';

export async function POST(request) {
  try {
    const { user, errorResponse } = await requireSubscription();
    if (errorResponse) return errorResponse;

    const { action, slug, userAnswer, sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    let prompt = "";
    const LYZR_API_KEY = process.env.LYZR_API_KEY;
    const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID;

    if (action === 'START') {
      if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
      
      const modulesDir = path.join(process.cwd(), 'content/modules/31_modules_FSD');
      const files = await fs.readdir(modulesDir);
      const targetFile = files.find(f => f.replace('.md', '').toLowerCase() === slug);
      
      if (!targetFile) return NextResponse.json({ error: 'Module not found' }, { status: 404 });

      const content = await fs.readFile(path.join(modulesDir, targetFile), 'utf-8');
      const truncatedContent = content.substring(0, 5000);

      prompt = `You are an expert Full-Stack Developer conducting a realistic mock interview.
The interview is specifically focused on this module content:
"""
${truncatedContent}
"""
Your instructions:
1. Since the user just started the interview, simply introduce yourself briefly and ask exactly ONE first interview question. 
2. The question should be challenging and test their understanding of the module.
3. Do not ask for their background, jump straight to the technical question.
4. Output your response as plain text/markdown.`;
    } else if (action === 'ANSWER') {
      prompt = `The user answered the previous question with:
"${userAnswer}"

Evaluate the answer. You MUST structure your response EXACTLY as follows (use Markdown):

**Score**: [Score out of 10]
**What was good**: [Brief description]
**What was missing/wrong**: [Brief description]
**Better Answer**: [Concise model answer]

**Next Question**: [Ask exactly one new question related to the module, do not repeat previous questions. Mix conceptual, practical, or debugging styles.]`;
    } else if (action === 'END') {
      prompt = `The user wants to end the interview.
Please provide a final summary of their performance based on the questions they answered so far.
Structure your response EXACTLY as follows:

**Total Score**: [Estimated overall score / 10]
**Strengths**: [Key areas they did well]
**Areas to Improve**: [What they should study more]`;
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!LYZR_API_KEY || !LYZR_AGENT_ID) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const lyzrPayload = {
      user_id: user.id,
      agent_id: LYZR_AGENT_ID,
      session_id: sessionId,
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
    const reply = data.response.replace(/^Score:\s*\d+(\.\d+)?.*$/gim, '').trim();

    // Create a notification for the user when an interview ends
    if (action === 'END') {
      try {
        const client = await clientPromise;
        const db = client.db('webdev-mentor-ai');
        
        await db.collection('notifications').insertOne({
          userId: getUserIdForStorage(user.id),
          title: 'Interview Summary Ready',
          message: `Your mock interview for ${slug.replace(/-/g, ' ')} has ended. Review your performance summary!`,
          type: 'interview',
          read: false,
          createdAt: new Date()
        });
      } catch (err) {
        console.error("Failed to create interview notification:", err);
      }
    }

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error('Error in mock interview:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
