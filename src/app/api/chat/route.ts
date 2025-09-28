import dbConnect from '@/lib/db';
import { getPersonalizedAdvice } from '@/lib/gemini';
import UserProfile from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json(); // <-- parse body directly
    const { message, personalityId } = body ?? {};

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get user profile for context (simplified - in real app would use authentication)
    let userProfile;
    try {
      const connection = await dbConnect();
      if (connection) {
        const profile = await UserProfile.findOne().sort({ createdAt: -1 });
        if (profile) {
          userProfile = {
            purpose: profile.purpose,
            vision: profile.vision,
            values: profile.values,
            selfAssessment: profile.selfAssessment
          };
        }
      }
    } catch (error) {
      console.error('Error fetching profile for context:', error);
      // Continue without profile context
    }

    const response = await getPersonalizedAdvice(message, userProfile, personalityId);

    return NextResponse.json({ success: true, response });
  } catch (error: unknown) {
    console.error('Error in chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to get response from Athena', details: errorMessage },
      { status: 500 }
    );
  }
}