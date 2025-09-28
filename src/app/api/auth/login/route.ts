import { generateToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('Login request received');
  
  try {
    const body = await request.json();
    const { username, password } = body ?? {};
    
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      console.log('Missing credentials');
      return NextResponse.json({ error: 'username and password are required' }, { status: 400 });
    }

    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected');

    console.log('Finding user...');
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    console.log('User found');

    console.log('Comparing password...');
    const ok = await user.comparePassword(password);
    if (!ok) {
      console.log('Password invalid');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    console.log('Password valid');

    console.log('Generating token...');
    const token = generateToken(user);
    console.log('Token generated successfully');
    
    const res = NextResponse.json({ success: true, token, user: { id: user._id, username: user.username } });
    res.headers.set('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`);
    
    console.log('Login successful');
    return res;
  } catch (err) {
    console.error('Login error details:', err);
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    console.error('Error message:', err instanceof Error ? err.message : String(err));
    
    // Make sure we always return valid JSON
    return NextResponse.json({ 
      error: 'Server error', 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}