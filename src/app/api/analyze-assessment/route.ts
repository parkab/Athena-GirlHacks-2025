import { analyzeAssessmentCategories, analyzeUserProfile, extractAssessmentText } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if we received profile data or raw text
    if (body.profileData) {
      // Analyze complete profile data
      const categories = await analyzeUserProfile(body.profileData);
      return NextResponse.json({ 
        success: true, 
        categories,
        extractedText: extractAssessmentText(body.profileData)
      });
    } else if (body.assessmentText) {
      // Analyze raw assessment text
      const categories = await analyzeAssessmentCategories(body.assessmentText);
      return NextResponse.json({ 
        success: true, 
        categories 
      });
    } else {
      return NextResponse.json(
        { error: 'Missing profileData or assessmentText in request body' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Assessment analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze assessment', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}