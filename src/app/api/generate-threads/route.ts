import { generateThreadsToWeave } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.assessmentText) {
      return NextResponse.json(
        { error: 'Missing assessmentText in request body' },
        { status: 400 }
      );
    }

    const threads = await generateThreadsToWeave(body.assessmentText);
    
    return NextResponse.json({ 
      success: true, 
      threads 
    });
  } catch (error) {
    console.error('Threads generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate threads to weave', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}