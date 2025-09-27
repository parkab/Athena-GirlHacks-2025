import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn(
    'Warning: GEMINI_API_KEY environment variable is not set. AI functionality will be disabled.'
  );
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface UserProfile {
  purpose: string;
  vision: string;
  values: string[];
  selfAssessment: {
    currentLevel: number;
    goals: string[];
    challenges: string[];
  };
}

export async function getPersonalizedAdvice(
  message: string, 
  userProfile?: UserProfile
): Promise<string> {
  if (!genAI) {
    return "I apologize, but my wisdom is currently unavailable. Please ensure the Gemini API is properly configured.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    let contextPrompt = `You are Athena, the Greek goddess of wisdom, warfare, and crafts. You are a wise mentor helping someone on their personal growth journey. 
    
    Your personality traits:
    - Speak with wisdom and authority, but remain encouraging
    - Reference ancient Greek philosophy and wisdom when relevant
    - Provide practical, actionable advice
    - Use metaphors related to Greek mythology and temples when appropriate
    - Be supportive but challenge the user to grow
    
    `;

    if (userProfile) {
      contextPrompt += `Here is information about the person you're helping:
      
      Purpose: ${userProfile.purpose}
      Vision: ${userProfile.vision}
      Values: ${userProfile.values.join(', ')}
      Current Level (1-10): ${userProfile.selfAssessment.currentLevel}
      Goals: ${userProfile.selfAssessment.goals.join(', ')}
      Challenges: ${userProfile.selfAssessment.challenges.join(', ')}
      
      Use this context to provide personalized advice.
      `;
    }

    contextPrompt += `\n\nUser's message: ${message}`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I apologize, but I'm having trouble connecting to my wisdom at the moment. Please try again later.";
  }
}

export default genAI;