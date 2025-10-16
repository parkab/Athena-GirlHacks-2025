import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { analyzeAssessmentCategories, generateThreadsToWeave } from '@/lib/gemini';
import UserProfile from '@/lib/models';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getTokenFromReq(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

interface ProfileData {
  purpose?: string;
  vision?: string;
  values?: string[];
  selfAssessment?: {
    questions?: string[];
  };
}

function generateProfileHash(profileData: ProfileData): string {
  const normalizedData = {
    purpose: profileData.purpose?.trim() || '',
    vision: profileData.vision?.trim() || '',
    values: (profileData.values || [])
      .filter((v: string) => v && v.trim())
      .map((v: string) => v.trim())
      .sort(),
    selfAssessment: (profileData.selfAssessment?.questions || [])
      .map((q: string) => q?.trim() || '')
  };
  
  const dataString = JSON.stringify(normalizedData);
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromReq(request);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const profile = await UserProfile.findOne({ userId: payload.id });
    const rawProfile = await UserProfile.collection.findOne({ userId: new mongoose.Types.ObjectId(payload.id) });
    
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const existingCache = profile.analysisCache || rawProfile?.analysisCache;
    const currentHash = generateProfileHash(profile);

    const hasCache = existingCache && 
                     existingCache.dataHash && 
                     existingCache.radarScores &&
                     existingCache.threadsToWeave;
    
    const hashMatches = hasCache && existingCache.dataHash === currentHash;
    
    if (hashMatches) {
      return NextResponse.json({
        radarScores: existingCache.radarScores,
        threadsToWeave: existingCache.threadsToWeave,
        fromCache: true,
        lastAnalyzed: existingCache.lastAnalyzed
      });
    }

    const textParts = [];
    
    if (profile.purpose?.trim()) {
      textParts.push(`Purpose: ${profile.purpose}`);
    }
    
    if (profile.vision?.trim()) {
      textParts.push(`Vision: ${profile.vision}`);
    }
    
    if (profile.values?.length > 0) {
      const validValues = profile.values.filter((v: string) => v.trim());
      if (validValues.length > 0) {
        textParts.push(`Values: ${validValues.join(', ')}`);
      }
    }
    
    if (profile.selfAssessment?.questions?.length > 0) {
      const assessmentQuestions = [
        "What motivates you to wake up each morning?",
        "What are your biggest challenges or obstacles right now?", 
        "What accomplishment are you most proud of?",
        "What would you like to improve about yourself?",
        "How do you handle stress or difficult emotions?",
        "What does success mean to you personally?",
        "What relationships are most important to you?",
        "What activities make you lose track of time?",
        "What would you do if you knew you couldn't fail?",
        "What legacy do you want to leave behind?"
      ];
      
      const assessmentResponses = [];
      for (let i = 0; i < assessmentQuestions.length && i < profile.selfAssessment.questions.length; i++) {
        const response = profile.selfAssessment.questions[i]?.trim();
        if (response) {
          assessmentResponses.push(`Q${i+1}: ${assessmentQuestions[i]} A: ${response}`);
        }
      }
      
      if (assessmentResponses.length > 0) {
        textParts.push(`Self-Assessment: ${assessmentResponses.join(' | ')}`);
      }
    }
    
    const assessmentText = textParts.join(' | ');

    if (!assessmentText.trim()) {
      return NextResponse.json({ error: 'No profile data to analyze' }, { status: 400 });
    }

    const [radarScores, threadsToWeave] = await Promise.all([
      analyzeAssessmentCategories(assessmentText),
      generateThreadsToWeave(assessmentText)
    ]);

    const cacheData = {
      dataHash: currentHash,
      radarScores,
      threadsToWeave,
      lastAnalyzed: new Date()
    };

    await UserProfile.collection.updateOne(
      { _id: profile._id },
      { 
        $set: { 
          analysisCache: cacheData
        }
      }
    );

    return NextResponse.json({
      radarScores,
      threadsToWeave,
      fromCache: false,
      lastAnalyzed: new Date()
    });

  } catch (error) {
    console.error('Smart analysis error:', error);
    return NextResponse.json({ 
      error: 'Analysis failed', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}