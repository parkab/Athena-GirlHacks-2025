import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// force dynamic rendering
export const dynamic = 'force-dynamic';

function getTokenFromReq(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  // fallback to cookie
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const response = NextResponse.json({ 
      user: { 
        id: payload.id, 
        username: payload.username,
        lastVerified: new Date().toISOString()
      } 
    });

    response.headers.set('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    response.headers.set('Vary', 'Authorization, Cookie');
    
    return response;
  } catch (err) {
    console.error('Me error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}