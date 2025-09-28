import dbConnect from '@/lib/db';
import UserProfile from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function getTokenFromReq(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { purpose, vision, values, selfAssessment } = body;

    const token = getTokenFromReq(request);
    const payload = token ? verifyToken(token) : null;
    if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

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

    // Upsert profile for the authenticated user (one profile per user)
    const userId = payload.id;
    const update = {
      purpose,
      vision,
      values,
      selfAssessment,
      userId
    };

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

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

// changed: allow GET(request) to return the profile for auth'd user
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromReq(request);
    const payload = token ? verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const connection = await dbConnect();
    if (!connection) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 });
    }

    const profile = await UserProfile.findOne({ userId: payload.id });
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