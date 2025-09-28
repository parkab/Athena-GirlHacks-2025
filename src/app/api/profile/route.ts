import dbConnect from '@/lib/db';
import UserProfile from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { purpose, vision, values, selfAssessment } = body;

    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      );
    }

    // Basic validation: ensure questions array is present
    if (!selfAssessment || !Array.isArray(selfAssessment.questions)) {
      return NextResponse.json({ error: 'Invalid selfAssessment.questions' }, { status: 400 });
    }

    // For now, we'll create a new profile each time
    // In a real app, you'd want user authentication and update existing profiles
    const profile = new UserProfile({
      purpose,
      vision,
      values,
      selfAssessment
    });

    await profile.save();

    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error saving profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to save profile', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 503 }
      );
    }
    
    // For simplicity, get the most recent profile
    // In a real app, you'd get the profile for the authenticated user
    const profile = await UserProfile.findOne().sort({ createdAt: -1 });
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: unknown) {
    console.error('Error fetching profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: errorMessage },
      { status: 500 }
    );
  }
}