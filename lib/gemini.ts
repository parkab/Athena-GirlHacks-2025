// --- Configuration ---
// Next.js automatically loads environment variables defined in .env* files


// For API routes, you don't need to prefix with NEXT_PUBLIC_ for server-side use.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


const GEMINI_MODEL_ID = 'gemini-2.5-flash'; // Change model as needed

// --- Alternative URLS ---
// Gemini 2.5 Pro: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent'
// Gemini 2.5 Flash: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
// Gemini 2.5 Flash-Lite: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_ID}:generateContent`;


// --- Type Definitions for Gemini API Request ---

// Defines a part in the request
interface PartRequest {
  text: string;
}

// Defines a Content object for requests
interface ContentRequest {
  parts: PartRequest[];
  role?: string;
}

// Defines the overall request body structure for the Gemini API
interface GeminiRequestBody {
  contents: ContentRequest[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

// --- Type Definitions for Gemini API Response ---

// Defines a part in the model's response (often just text)
interface PartResponse {
  text: string;
}

// Defines a Content object in the model's response
interface ContentResponse { // Renamed to avoid confusion with request Content
  parts: PartResponse[];
  role: string; // e.g., "model"
}

// Defines a Content object in the model's response
interface Candidate {
  content: ContentResponse; // Use the renamed interface
  finishReason?: string; // e.g., "STOP"
  index: number;
  safetyRatings?: Array<{
    category: string;
    probability: string;
    blocked: boolean; // Indicates if this category caused blocking
  }>;
}

// Defines the overall response structure from the Gemini API
interface GeminiAPIResponse {
  candidates: Candidate[];
  // If the request was blocked entirely, a promptFeedback field might be present
  promptFeedback?: {
    safetyRatings: Array<{
      category: string;
      probability: string;
      blocked: boolean;
    }>;
  };
  usageMetadata?: { // Added usageMetadata type
    promptTokenCount: number;
    totalTokenCount: number;
    // other fields like promptTokensDetails, thoughtsTokenCount
  };
  modelVersion?: string; // The specific model version that responded
  responseId?: string;
}


// --- User Profile Context Interface ---
interface UserProfileContext {
  purpose: string;
  vision: string;
  values: string;
  selfAssessment: string;
}

/**
 * Sends a personalized message to the Gemini API using the native `fetch` API.
 * @param userMessage The direct message from the user.
 * @param userProfile Optional context about the user's profile.
 * @returns A string containing the personalized advice from Gemini.
 * @throws An error if the API key is missing or the API call fails.
 */
export async function getPersonalizedAdvice(
  userMessage: string,
  userProfile?: UserProfileContext
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }

  // 1. Construct the comprehensive prompt string
  let fullPrompt = `The user is asking: "${userMessage}"`;

  if (userProfile) {
    fullPrompt += `

Here is some context about the user's personal framework:
- Purpose: ${userProfile.purpose}
- Vision: ${userProfile.vision}
- Values: ${userProfile.values}
- Self-assessment: ${userProfile.selfAssessment}

Based on this context and striving for a supportive, empathetic, and actionable tone, please provide personalized advice or a thoughtful response to their query. Your response should directly address their message while integrating insights from their profile. Keep the response concise and to the point.`;
  } else {
    fullPrompt += `

Please provide advice or a response to their query. Keep the response concise and to the point.`;
  }

  // 2. Construct the Gemini API request body
  const requestBody: GeminiRequestBody = {
    contents: [
      {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.8,     // A bit more creative
      maxOutputTokens: 10000, // Limit response length for conciseness
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  console.log("Sending request to Gemini with payload:", JSON.stringify(requestBody, null, 2));

  try {
    // 3. Make the API call using native fetch
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Check if the response was successful (status code 2xx)
    if (!response.ok) {
      const errorData = await response.json(); // Attempt to read error details
      console.error('Gemini API returned an error:', response.status, errorData);
      throw new Error(`Gemini API error (Status ${response.status}): ${JSON.stringify(errorData)}`);
    }

    const responseData: GeminiAPIResponse = await response.json();

    console.log("Received response from Gemini:", JSON.stringify(responseData, null, 2));

    // 4. Process the response
    const candidate = responseData.candidates?.[0];
     if (candidate) {
      if (candidate.content?.parts?.[0]?.text) {
        return candidate.content.parts[0].text;
      } else if (candidate.finishReason === 'SAFETY') {
        // If content was blocked due to safety
        const safetyFeedback = candidate.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ');
        throw new Error(`Response blocked due to safety policy: ${safetyFeedback || 'Unknown reason'}`);
      } else if (candidate.finishReason === 'MAX_TOKENS') {
         // This means it generated up to the limit but the final 'text' might still be here
         // If it hit max_tokens, the text should still be present, just truncated
         throw new Error('Gemini response was truncated due to MAX_TOKENS. Consider increasing maxOutputTokens.');
      }
      // Fallback for other unexpected candidate scenarios
      throw new Error('Gemini API response candidate did not contain expected text or had an unexpected finish reason.');
    } else if (responseData.promptFeedback?.safetyRatings?.some(r => r.blocked)) {
      // If the entire prompt was blocked before any candidates were generated
      const safetyFeedback = responseData.promptFeedback.safetyRatings.map(r => `${r.category}: ${r.probability}`).join(', ');
      throw new Error(`Your prompt was blocked by the safety system: ${safetyFeedback}`);
    } else {
      console.error('Gemini API response did not contain any candidates or clear error information:', responseData);
      throw new Error('No valid candidates or text response received from Gemini API.');
    }
  } catch (error) {
    console.error('Error during Gemini API call:', error);
    throw new Error(`Failed to communicate with Gemini API: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// --- Assessment Analysis Types ---
interface AssessmentCategories {
  Habits: number;
  Mindset: number;
  Relationships: number;
  Health: number;
  Creativity: number;
  Purpose: number;
  Learning: number;
}

interface ProfileData {
  purpose: string;
  vision: string;
  values: string[];
  selfAssessment: {
    currentLevel: number;
    goals: string[];
    challenges: string[];
  };
}

/**
 * Extracts all relevant text from a user's profile assessment
 * @param profileData The complete profile data from the form
 * @returns A concatenated string of all text-based assessment content
 */
export function extractAssessmentText(profileData: ProfileData): string {
  const textParts: string[] = [];

  // Add purpose statement
  if (profileData.purpose.trim()) {
    textParts.push(`Purpose: ${profileData.purpose}`);
  }

  // Add vision statement
  if (profileData.vision.trim()) {
    textParts.push(`Vision: ${profileData.vision}`);
  }

  // Add values (filter out empty values)
  const validValues = profileData.values.filter(value => value.trim());
  if (validValues.length > 0) {
    textParts.push(`Values: ${validValues.join(', ')}`);
  }

  // Add goals (filter out empty goals)
  const validGoals = profileData.selfAssessment.goals.filter(goal => goal.trim());
  if (validGoals.length > 0) {
    textParts.push(`Goals: ${validGoals.join(', ')}`);
  }

  // Add challenges (filter out empty challenges)
  const validChallenges = profileData.selfAssessment.challenges.filter(challenge => challenge.trim());
  if (validChallenges.length > 0) {
    textParts.push(`Challenges: ${validChallenges.join(', ')}`);
  }

  // Add current level context
  textParts.push(`Current self-assessment level: ${profileData.selfAssessment.currentLevel}/10`);

  return textParts.join(' | ');
}

/**
 * Analyzes user assessment text and categorizes it using Gemini AI
 * @param assessmentText The extracted assessment text to analyze
 * @returns A promise that resolves to category scores (0.0-1.0 for each category)
 * @throws An error if the API key is missing or the API call fails
 */
export async function analyzeAssessmentCategories(assessmentText: string): Promise<AssessmentCategories> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }

  if (!assessmentText.trim()) {
    throw new Error('Assessment text is empty or invalid.');
  }

  const analysisPrompt = `You are analyzing user reflections. 
Classify the following text into the categories (what we call "threads") below. 
For each category, assign a score between 0.0 and 1.0 based on how strongly the text relates.
Categories for Athena’s Spiderweb (Threads of Wisdom)
1. Habits & Discipline
This thread reflects the strength of your daily systems and routines — the foundation of consistent growth. Just as Athena valued strategy over brute force, strong habits provide structure and momentum, transforming small actions into lasting change. High scores indicate you’ve built reliable routines that align with your goals; lower scores may reveal inconsistency or environments that undermine your intentions.
2. Mindset & Resilience
This thread measures how you approach challenges, setbacks, and the opinions of others. Inspired by The Courage to Be Disliked, it reflects your ability to live authentically, take responsibility, and reframe adversity as opportunity. A resilient mindset means seeing growth in failure, confidence in uncertainty, and courage in the face of disapproval. Low scores may suggest self-doubt, external dependence, or resistance to change.
3. Relationships & Connection
This thread represents the strength and depth of your bonds with others. Athena valued dialogue and mentorship, reminding us that wisdom is shared. Healthy connections mean nurturing trust, showing empathy, and communicating with clarity. High scores reflect supportive, authentic relationships; lower scores may suggest isolation, strained bonds, or difficulties in trust and vulnerability.
4. Health & Vitality
This thread embodies your physical well-being — energy, rest, and care for your body. The Greeks saw balance of mind and body as the essence of excellence (arete). Strong health supports every other domain: clarity of thought, resilience, and creative spark. High scores mean consistent exercise, sleep, and nutrition; lower scores reveal fatigue, neglect of physical health, or imbalance between work and rest.
5. Creativity & Expression
This thread reflects your ability to generate new ideas, express yourself authentically, and embrace imagination. Athena, goddess of both wisdom and the arts of weaving and craftsmanship, symbolizes creativity as both problem-solving and self-expression. High scores reveal openness to new perspectives and frequent creative practice; lower scores suggest suppression of ideas, fear of originality, or a lack of outlets for expression.
6. Purpose & Vision
This thread measures clarity of direction and alignment with personal values. It is the guiding star that gives meaning to action. Like a hero guided by prophecy, your purpose provides motivation through trials and obstacles. High scores show you have a strong sense of mission and long-term goals; lower scores suggest drifting, uncertainty, or living by others’ expectations rather than your own.
7. Learning & Growth
This thread captures your drive to expand your knowledge, skills, and wisdom. Athena herself embodied curiosity and continuous refinement of understanding. High scores mean you regularly seek out challenges, embrace mistakes as teachers, and evolve with each experience; lower scores reflect complacency, resistance to feedback, or stagnation.

Text:
"${assessmentText}"

Return JSON only in this format:
{
  "Habits": 0.8,
  "Mindset": 0.7,
  "Relationships": 0.0,
  "Health": 0.9,
  "Creativity": 0.1,
  "Purpose": 0.5,
  "Learning": 0.7
}`;

  const requestBody: GeminiRequestBody = {
    contents: [
      {
        parts: [
          {
            text: analysisPrompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,     // Low temperature for consistent JSON output
      maxOutputTokens: 10000,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  console.log("Analyzing assessment with Gemini:", assessmentText);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API returned an error:', response.status, errorData);
      throw new Error(`Gemini API error (Status ${response.status}): ${JSON.stringify(errorData)}`);
    }

    const responseData: GeminiAPIResponse = await response.json();
    console.log("Received analysis response from Gemini:", JSON.stringify(responseData, null, 2));

    const candidate = responseData.candidates?.[0];
    if (candidate?.content?.parts?.[0]?.text) {
      const rawResponse = candidate.content.parts[0].text.trim();
      
      // Extract JSON from response (remove any markdown code blocks)
      let jsonString = rawResponse;
      if (rawResponse.includes('```json')) {
        const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }
      } else if (rawResponse.includes('```')) {
        const jsonMatch = rawResponse.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }
      }

      try {
        const categories: AssessmentCategories = JSON.parse(jsonString);
        
        // Validate that all required categories are present and are numbers between 0 and 1
        const requiredCategories = ['Habits', 'Mindset', 'Relationships', 'Health', 'Creativity', 'Purpose', 'Learning'];
        for (const category of requiredCategories) {
          if (!(category in categories)) {
            throw new Error(`Missing category: ${category}`);
          }
          const score = categories[category as keyof AssessmentCategories];
          if (typeof score !== 'number' || score < 0 || score > 1) {
            throw new Error(`Invalid score for ${category}: ${score}. Must be a number between 0.0 and 1.0`);
          }
        }

        return categories;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', jsonString);
        throw new Error(`Failed to parse category analysis JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    } else {
      throw new Error('No valid response received from Gemini API for assessment analysis.');
    }
  } catch (error) {
    console.error('Error during assessment analysis:', error);
    throw new Error(`Failed to analyze assessment categories: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Complete workflow: Extract assessment text and analyze categories
 * @param profileData The complete profile data from the form
 * @returns A promise that resolves to category scores
 */
export async function analyzeUserProfile(profileData: ProfileData): Promise<AssessmentCategories> {
  const assessmentText = extractAssessmentText(profileData);
  console.log('Extracted assessment text:', assessmentText);
  
  if (!assessmentText.trim()) {
    throw new Error('No assessment text could be extracted from profile data.');
  }
  
  return await analyzeAssessmentCategories(assessmentText);
}

/**
 * Generates personalized "Threads to Weave" using Gemini AI
 * @param assessmentText The extracted assessment text to analyze
 * @returns A promise that resolves to an array of thread suggestions
 * @throws An error if the API key is missing or the API call fails
 */
export async function generateThreadsToWeave(assessmentText: string): Promise<string[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }

  if (!assessmentText.trim()) {
    throw new Error('Assessment text is empty or invalid.');
  }

  const threadsPrompt = `You are Athena, the goddess of wisdom and strategy, acting as a personal mentor for self-improvement.
The user will provide their Purpose, Vision, Values, Personality type, and answers to 12 self-assessment questions.
Your task is to generate exactly 5 "Threads to Weave" — small, actionable steps that reflect the user's unique context.

Instructions:
A Thread to Weave = a specific, actionable practice, reflection, or challenge the user can try in the near future.

Keep the scope broad: threads can address anything from habits (like improving sleep) to fears (like public speaking) to relationships, purpose, mindset, health, or creativity.

Threads may connect to one of the growth categories (Habits, Mindset, Relationships, Health, Creativity, Purpose, Learning), but they don't have to be confined to a single category. Some may overlap multiple areas.

Ground each thread in the user's life context (college student, personal struggles, passions, relationships, etc.). Avoid generic advice.

Make threads practical and achievable in daily life, but also inspiring — they should feel like steps toward weaving a stronger, wiser self.

You must return exactly 5 threads, no more, no less.

Format your answer as a JSON array of exactly 5 strings, where each string contains both the title and description separated by " — ":

Example Format:
[
  "Daily Study Ritual — Block out one hour at the same time each day to create a rhythm and reduce procrastination.",
  "Reframe Setbacks — After a tough exam, write down one thing you learned instead of focusing on mistakes.",
  "Sister Connection — Invite your older sister to join you in baking this weekend as a first step toward rebuilding trust.",
  "Courage Practice — Start one conversation with someone new in class this week to reduce social anxiety.",
  "Sleep Reset — Set a consistent bedtime alarm to build a healthier sleep pattern."
]

User Context:
"${assessmentText}"

Return only the JSON array, no additional text.`;

  const requestBody: GeminiRequestBody = {
    contents: [
      {
        parts: [
          {
            text: threadsPrompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,     // Slightly higher for creative suggestions
      maxOutputTokens: 10000,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  console.log("Generating threads to weave with Gemini:", assessmentText);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API returned an error:', response.status, errorData);
      throw new Error(`Gemini API error (Status ${response.status}): ${JSON.stringify(errorData)}`);
    }

    const responseData: GeminiAPIResponse = await response.json();
    console.log("Received threads response from Gemini:", JSON.stringify(responseData, null, 2));

    const candidate = responseData.candidates?.[0];
    if (candidate?.content?.parts?.[0]?.text) {
      const rawResponse = candidate.content.parts[0].text.trim();
      
      // Extract JSON from response (remove any markdown code blocks)
      let jsonString = rawResponse;
      if (rawResponse.includes('```json')) {
        const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }
      } else if (rawResponse.includes('```')) {
        const jsonMatch = rawResponse.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonString = jsonMatch[1];
        }
      }

      try {
        const threads: string[] = JSON.parse(jsonString);
        
        // Validate that we got an array of strings
        if (!Array.isArray(threads)) {
          throw new Error('Response is not an array');
        }
        
        if (threads.length !== 5) {
          throw new Error(`Expected exactly 5 threads, got ${threads.length}`);
        }

        // Validate that all items are strings
        for (const thread of threads) {
          if (typeof thread !== 'string' || !thread.includes(' — ')) {
            throw new Error(`Invalid thread format: ${thread}`);
          }
        }

        return threads;
      } catch (parseError) {
        console.error('Failed to parse threads response:', parseError);
        console.error('Raw response was:', rawResponse);
        throw new Error(`Failed to parse Gemini response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
      }
    } else {
      throw new Error('No valid response content received from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API for threads:', error);
    throw error;
  }
}

// ATHENA SPEAKS! SHE SPEAKS! YOOOOOOOOOOOOOOOOOOOOOOOOOO