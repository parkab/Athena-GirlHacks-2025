import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Health check endpoint called');
  
  try {
    // Test environment variables
    const hasMongoUri = !!process.env.MONGODB_URI;
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const hasJwtSecret = !!process.env.JWT_SECRET;
    
    console.log('Environment check:', { hasMongoUri, hasGeminiKey, hasJwtSecret });
    
    // Test database connection
    let dbStatus = 'failed';
    try {
      await dbConnect();
      dbStatus = 'connected';
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      dbStatus = `failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
    }
    
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        hasMongoUri,
        hasGeminiKey,
        hasJwtSecret,
      },
      database: {
        status: dbStatus,
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform,
      }
    };
    
    console.log('Health check response:', healthData);
    
    return NextResponse.json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}