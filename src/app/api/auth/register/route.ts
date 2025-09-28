import dbConnect from '@/lib/db';
import User from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body ?? {};

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'username and password are required' }, { status: 400 });
    }

    await dbConnect(); // see: [`dbConnect`](lib/db.ts)

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const user = new User({ username, password });
    await user.save();
    const token = generateToken(user);

    const res = NextResponse.json({ success: true, token, user: { id: user._id, username: user.username } }, { status: 201 });
    // set HttpOnly cookie
    res.headers.set('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);
    return res;
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}