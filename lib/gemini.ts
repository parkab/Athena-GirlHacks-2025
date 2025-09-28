// --- Configuration ---
// Next.js automatically loads environment variables defined in .env* files

import { EnhancedGenerateContentResponse } from "@google/generative-ai";

// For API routes, you don't need to prefix with NEXT_PUBLIC_ for server-side use.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


const GEMINI_MODEL_ID = 'gemini-2.5-flash'; // Change model as needed

// --- Alternative URLS ---
// Gemini 2.5 Pro: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent'
// Gemini 2.5 Flash: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
// Gemini 2.5 Flash-Lite: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_ID}:generateContent`;


// --- Type Definitions for Gemini API Request ---

// Defines a part in the model's response (often just text)
interface PartResponse {
  text: string;
}

// Defines a Content object, which is a turn in the conversation
interface ContentResponse { // 
  parts: PartResponse[];
  role: string; // e.g., "model"
}
// Defines the overall request body structure for the Gemini API
interface GeminiRequestBody {
  contents: EnhancedGenerateContentResponse[];
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
      maxOutputTokens: 2000, // Limit response length for conciseness
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

// ATHENA SPEAKS! SHE SPEAKS! YOOOOOOOOOOOOOOOOOOOOOOOOOO