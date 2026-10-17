import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { requireSubscription } from '@/lib/subscriptions';

export async function GET(request) {
  const { user, errorResponse } = await requireSubscription();
  if (errorResponse) {
    return errorResponse;
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  try {
    const modulesDir = path.join(process.cwd(), 'content/modules/31_modules_FSD');
    const files = await fs.readdir(modulesDir);
    const targetFile = files.find(f => f.replace('.md', '').toLowerCase() === slug);
    
    if (!targetFile) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    const filePath = path.join(modulesDir, targetFile);
    const content = await fs.readFile(filePath, 'utf-8');

    // Extract Interview Questions block
    const interviewMatch = content.match(/## 13\. Interview Questions\n([\s\S]*?)(?=## \d+\.)/);
    
    let questions = [];
    if (interviewMatch && interviewMatch[1]) {
      const text = interviewMatch[1];
      // Match lines starting with a number and a dot
      const lines = text.split('\n').map(l => l.trim()).filter(l => /^\d+\./.test(l));
      // Remove the leading number and dot
      questions = lines.map(l => l.replace(/^\d+\.\s*/, '').trim());
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
