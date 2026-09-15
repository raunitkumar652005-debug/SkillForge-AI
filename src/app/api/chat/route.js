import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';

export async function POST(request) {
  try {
    const { message, session_id } = await request.json();

    if (!message || !session_id) {
      return NextResponse.json(
        { error: 'Missing message or session_id' },
        { status: 400 }
      );
    }

    const LYZR_API_KEY = process.env.LYZR_API_KEY;
    const LYZR_AGENT_ID = process.env.LYZR_AGENT_ID;

    // Temporary local user identity until authentication is implemented
    const TEMPORARY_USER_ID = 'local-dev-user-temp';
    
    // Connect to DB
    const client = await clientPromise;
    const db = client.db('webdev-mentor-ai');

    // Find conversation to attach messages to
    let conversation = await db.collection('conversations').findOne({
      userId: TEMPORARY_USER_ID,
      sessionId: session_id
    });
    
    if (!conversation) {
      // Create it now on first message
      const newConv = {
        userId: TEMPORARY_USER_ID,
        sessionId: session_id,
        title: 'New Conversation',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const result = await db.collection('conversations').insertOne(newConv);
      conversation = { _id: result.insertedId, ...newConv };
    }

    // 1. Save User Message
    await db.collection('messages').insertOne({
      conversationId: conversation._id,
      role: 'user',
      content: message,
      createdAt: new Date()
    });
    
    const updatePayload = { updatedAt: new Date() };
    
    if (!conversation.title || conversation.title === 'New Conversation') {
      const MAX_TITLE_LEN = 40;
      updatePayload.title = message.length > MAX_TITLE_LEN 
        ? message.substring(0, MAX_TITLE_LEN) + '...' 
        : message;
    }

    // Update conversation
    await db.collection('conversations').updateOne(
      { _id: conversation._id },
      { $set: updatePayload }
    );

    // 2. Fetch from Lyzr (or Mock)
    const USE_MOCK = process.env.MOCK_LYZR !== 'false'; // Mock by default to save credits
    let aiContent = "";

    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      aiContent = `This is a **mocked** response to verify database persistence.\n\nYou said: "${message}"\n\nHere is a code snippet:\n\`\`\`js\nconsole.log("Persistence working!");\n\`\`\``;
    } else {
      if (!LYZR_API_KEY || !LYZR_AGENT_ID) {
        return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
      }
      
      const lyzrPayload = {
        user_id: TEMPORARY_USER_ID,
        agent_id: LYZR_AGENT_ID,
        session_id: session_id,
        message: message,
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
        const errorText = await response.text();
        console.error('Lyzr API error:', response.status, errorText);
        return NextResponse.json(
          { error: 'Failed to communicate with AI Agent' },
          { status: response.status }
        );
      }

      const data = await response.json();
      aiContent = data.response;
    }

    if (aiContent) {
      // Remove internal retrieval score lines (e.g., "Score: 0.5423403")
      aiContent = aiContent.replace(/^Score:\s*\d+(\.\d+)?.*$/gim, '').trim();
      // Clean up excess newlines left behind by the removed lines
      aiContent = aiContent.replace(/\n{3,}/g, '\n\n');
    }

    // 3. Save AI Message
    await db.collection('messages').insertOne({
      conversationId: conversation._id,
      role: 'ai',
      content: aiContent,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      response: aiContent,
      conversationId: conversation._id.toString()
    });
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
