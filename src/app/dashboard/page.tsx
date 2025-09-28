'use client';

import AuthGuard from '@/components/AuthGuard';
import RadarChart from '@/components/RadarChart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Profile {
  purpose: string;
  vision: string;
  values: string[];
  selfAssessment: {
    questions: string[]; // User responses to the assessment questions
  };
  createdAt: string;
}

interface AssessmentCategories {
  Habits: number;
  Mindset: number;
  Relationships: number;
  Health: number;
  Creativity: number;
  Purpose: number;
  Learning: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [radarScores, setRadarScores] = useState<AssessmentCategories | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [threadsToWeave, setThreadsToWeave] = useState<string[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // include credentials so the token cookie is sent
      const response = await fetch('/api/profile', { headers: { authorization: 'Bearer ' + localStorage.getItem('token') } });

      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        
        // After getting profile, analyze it with Gemini
        if (data.profile) {
          await Promise.all([
            analyzeProfile(data.profile),
            generateThreads(data.profile)
          ]);
        }
      } else {
        console.error('Failed to load profile:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeProfile = async (profileData: Profile) => {
    try {
      setAnalysisLoading(true);
      console.log('Starting profile analysis with Gemini...');
      
      // Create assessment text from profile data
      const textParts = [];
      
      if (profileData.purpose.trim()) {
        textParts.push(`Purpose: ${profileData.purpose}`);
      }
      
      if (profileData.vision.trim()) {
        textParts.push(`Vision: ${profileData.vision}`);
      }
      
      if (profileData.values.length > 0) {
        const validValues = profileData.values.filter(v => v.trim());
        if (validValues.length > 0) {
          textParts.push(`Values: ${validValues.join(', ')}`);
        }
      }
      
      // Add user responses to assessment questions
      if (profileData.selfAssessment.questions.length > 0) {
        const validResponses = profileData.selfAssessment.questions.filter(q => q.trim());
        if (validResponses.length > 0) {
          textParts.push(`Assessment Responses: ${validResponses.join(' | ')}`);
        }
      }
      
      const assessmentText = textParts.join(' | ');
      
      const response = await fetch('/api/analyze-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ assessmentText }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Analysis completed:', data.categories);
        setRadarScores(data.categories);
      } else {
        const errorData = await response.json();
        console.error('Failed to analyze profile:', errorData);
        
        // Fall back to sample data if analysis fails
        setRadarScores({
          Mindset: 0.7,
          Health: 0.6,
          Relationships: 0.5,
          Purpose: 0.8,
          Learning: 0.6,
          Creativity: 0.5,
          Habits: 0.6
        });
      }
    } catch (error) {
      console.error('Error analyzing profile:', error);
      
      // Fall back to sample data if analysis fails
      setRadarScores({
        Mindset: 0.7,
        Health: 0.6,
        Relationships: 0.5,
        Purpose: 0.8,
        Learning: 0.6,
        Creativity: 0.5,
        Habits: 0.6
      });
    } finally {
      setAnalysisLoading(false);
    }
  };

  const generateThreads = async (profileData: Profile) => {
    try {
      setThreadsLoading(true);
      console.log('Starting threads generation with Gemini...');
      
      // Create assessment text from profile data (same as analysis)
      const textParts = [];
      
      if (profileData.purpose.trim()) {
        textParts.push(`Purpose: ${profileData.purpose}`);
      }
      
      if (profileData.vision.trim()) {
        textParts.push(`Vision: ${profileData.vision}`);
      }
      
      if (profileData.values.length > 0) {
        const validValues = profileData.values.filter(v => v.trim());
        if (validValues.length > 0) {
          textParts.push(`Values: ${validValues.join(', ')}`);
        }
      }
      
      // Add user responses to assessment questions
      if (profileData.selfAssessment.questions.length > 0) {
        const validResponses = profileData.selfAssessment.questions.filter(q => q.trim());
        if (validResponses.length > 0) {
          textParts.push(`Assessment Responses: ${validResponses.join(' | ')}`);
        }
      }
      
      const assessmentText = textParts.join(' | ');
      
      const response = await fetch('/api/generate-threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ assessmentText }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Threads generation completed:', data.threads);
        setThreadsToWeave(data.threads);
      } else {
        const errorData = await response.json();
        console.error('Failed to generate threads:', errorData);
        
        // Fall back to sample data if generation fails
        setThreadsToWeave([
          "Daily Reflection — Set aside 10 minutes each evening to journal about your growth journey.",
          "Purpose Practice — Align one daily action with your stated purpose this week.",
          "Value Check — Notice when your decisions contradict your values and course-correct mindfully.",
          "Growth Challenge — Try one new skill or habit that stretches your comfort zone.",
          "Connection Ritual — Reach out to someone important in your life with genuine appreciation."
        ]);
      }
    } catch (error) {
      console.error('Error generating threads:', error);
      
      // Fall back to sample data if generation fails
      setThreadsToWeave([
        "Daily Reflection — Set aside 10 minutes each evening to journal about your growth journey.",
        "Purpose Practice — Align one daily action with your stated purpose this week.",
        "Value Check — Notice when your decisions contradict your values and course-correct mindfully.",
        "Growth Challenge — Try one new skill or habit that stretches your comfort zone.",
        "Connection Ritual — Reach out to someone important in your life with genuine appreciation."
      ]);
    } finally {
      setThreadsLoading(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-temple flex items-center justify-center">
          <div className="text-2xl font-serif text-primary-800">Loading your wisdom...</div>
        </div>
      </AuthGuard>
    );
  }

  if (!profile) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-temple flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-3xl font-serif font-bold text-primary-800 mb-4">
              Welcome, Seeker of Wisdom
            </h1>
            <p className="text-primary-600 mb-6">
              Begin your journey by creating your personal foundation
            </p>
            <Link
              href="/profile"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Create Your Profile
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }
  
  return (
    <AuthGuard>
      <div className="min-h-screen bg-temple py-12">
        <div className="relative">
          {/* Greek columns decoration */}
          <div className="absolute inset-0 flex justify-around items-end opacity-5">
            <div className="greek-column w-4 h-full"></div>
            <div className="greek-column w-4 h-full"></div>
            <div className="greek-column w-4 h-full"></div>
            <div className="greek-column w-4 h-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white rounded-lg shadow-xl p-8 border-4 border-gold-200">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-serif font-bold text-primary-800 mb-4">
                    Your Temple of Growth
                  </h1>
                  <p className="text-lg text-primary-600">
                    Welcome to your sacred space of personal development and wisdom
                  </p>
                </div>

                <div className="space-y-8">
                  
                  {/* Section 1: Purpose, Vision, Values Box */}
                  <div className="bg-primary-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-4 flex items-center">
                      🏛️ Purpose, Vision, Values
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-serif font-semibold text-primary-700 mb-2">Purpose</h3>
                        <p className="text-gray-700 italic leading-relaxed bg-white p-3 rounded border border-primary-200">"{profile.purpose}"</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-semibold text-primary-700 mb-2">Vision</h3>
                        <p className="text-gray-700 italic leading-relaxed bg-white p-3 rounded border border-primary-200">"{profile.vision}"</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-semibold text-primary-700 mb-2">Values</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.values.map((value, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Update Goals Button */}
                  <div className="text-center">
                    <Link
                      href="/profile"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg inline-block"
                    >
                      Update Your Goals
                    </Link>
                  </div>

                  {/* Section 3: Threads of Athena Box */}
                  <div className="bg-gold-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-4 flex items-center">
                      🕸️ Threads of Athena
                    </h2>
                    <p className="text-primary-600 mb-4">
                      Your personal growth visualization across key life areas
                    </p>
                    <div className="bg-white p-6 rounded border border-gold-200">
                      {analysisLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
                            <p className="text-gray-600 font-medium">Athena is analyzing your wisdom...</p>
                          </div>
                        </div>
                      ) : radarScores ? (
                        <RadarChart scores={radarScores as unknown as { [key: string]: number }} />
                      ) : (
                        <div className="flex items-center justify-center py-12">
                          <p className="text-gray-500">Analysis data not available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 4: Threads to Weave Box */}
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-4 flex items-center">
                      🧵 Threads to Weave
                    </h2>
                    <p className="text-primary-600 mb-4">
                      Personalized actionable steps for your unique growth journey, crafted by Athena's wisdom
                    </p>
                    <div className="bg-white p-4 rounded border border-green-200">
                      {threadsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
                            <p className="text-gray-600 font-medium">Athena is weaving your personal threads...</p>
                          </div>
                        </div>
                      ) : threadsToWeave.length > 0 ? (
                        <div className="space-y-3">
                          {threadsToWeave.map((thread, index) => {
                            // Split thread into title and description
                            const parts = thread.split(' — ');
                            const title = parts[0];
                            const description = parts[1] || '';
                            
                            return (
                              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-4">
                                  <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-primary-700 mb-1">{title}</h4>
                                    {description && (
                                      <p className="text-gray-600 text-sm">{description}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <p className="text-gray-500">No threads available yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 5: Ask Athena Button */}
                  <div className="text-center pt-4">
                    <Link
                      href="/chat"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg inline-block"
                    >
                      Ask Athena
                    </Link>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}