'use client';

import RadarChart from '@/components/RadarChart';
import { useState } from 'react';

interface AssessmentCategories {
  Habits: number;
  Mindset: number;
  Relationships: number;
  Health: number;
  Creativity: number;
  Purpose: number;
  Learning: number;
}

export default function TestAssessmentAnalysis() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample profile data for testing
  const sampleProfileData = {
    purpose: "To become the best version of myself and help others grow",
    vision: "I see myself as a confident, healthy person who makes a positive impact",
    values: ["Growth", "Health", "Creativity", "Connection"],
    selfAssessment: {
      currentLevel: 6,
      goals: [
        "Exercise daily and build consistent habits",
        "Learn new skills in web development",
        "Improve my relationships with family and friends",
        "Start a creative writing project"
      ],
      challenges: [
        "Procrastination and lack of discipline",
        "Social anxiety when meeting new people",
        "Balancing work and personal life",
        "Staying motivated when progress is slow"
      ]
    }
  };

  // Sample assessment text for direct testing
  const sampleAssessmentText = "Over the past two weeks, I've been focusing on exercising daily and trying to stick to a consistent morning routine. I've also felt motivated to improve my study habits and learn new skills. I want to build better relationships with my family and express myself more creatively through art.";

  const testWithProfileData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileData: sampleProfileData
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error + (data.details ? ': ' + data.details : ''));
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const testWithRawText = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentText: sampleAssessmentText
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error + (data.details ? ': ' + data.details : ''));
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const CategoryBar = ({ category, score }: { category: string, score: number }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{category}</span>
        <span className="text-sm text-gray-500">{(score * 100).toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
          style={{ width: `${score * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Assessment Analysis Test
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Test Buttons */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Options</h2>
            
            <button
              onClick={testWithProfileData}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-3"
            >
              {loading ? 'Analyzing...' : 'Test with Sample Profile Data'}
            </button>

            <button
              onClick={testWithRawText}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Test with Raw Assessment Text'}
            </button>
          </div>

          {/* Sample Data Preview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Sample Assessment Text:</h3>
            <p className="text-sm text-gray-600 mb-4 italic">
              "{sampleAssessmentText}"
            </p>
            
            <h4 className="font-medium mb-2">Sample Profile Goals:</h4>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {sampleProfileData.selfAssessment.goals.slice(0, 2).map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

                {/* Results Display */}
        {result && (
          <div className="space-y-8">
            {/* Radar Chart Visualization */}
            {result.categories && (
              <div className="flex justify-center">
                <RadarChart 
                  scores={result.categories}
                  title="Personal Growth Assessment"
                  width={500}
                  height={500}
                  primaryColor="rgb(59, 130, 246)" // Blue-500
                  backgroundColor="rgba(59, 130, 246, 0.1)"
                />
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Detailed Analysis Results</h2>
              
              {/* Show extracted text if available */}
              {result.extractedText && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Extracted Text:</h3>
                  <p className="text-sm text-gray-600 italic">"{result.extractedText}"</p>
                </div>
              )}

              {/* Category bar visualization */}
              {result.categories && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Category Breakdown</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(result.categories).map(([category, score]) => (
                      <CategoryBar 
                        key={category} 
                        category={category} 
                        score={score as number} 
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON for debugging */}
              <details className="mt-6">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  Show Raw JSON Response
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}