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
    questions: string[];
  };
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', { credentials: 'include' });
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        console.error('Failed to load profile:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
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

  // Sample radar chart data - scores should be between 0.0 and 1.0
  const radarScores = {
    Mindset: 0.8,
    Health: 0.6,
    Relationships: 0.7,
    Purpose: 0.9,
    Learning: 0.5,
    Creativity: 0.6
  };

  // Sample threads to weave data
  const threadsToWeave = [
    "Develop a consistent morning routine",
    "Strengthen relationships with family",
    "Learn a new skill each month",
    "Practice mindfulness meditation",
    "Create a vision board"
  ];

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
                      <RadarChart scores={radarScores} />
                    </div>
                  </div>

                  {/* Section 4: Threads to Weave Box */}
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-4 flex items-center">
                      🧵 Threads to Weave
                    </h2>
                    <p className="text-primary-600 mb-4">
                      Your upcoming goals and areas for focused growth
                    </p>
                    <div className="bg-white p-4 rounded border border-green-200">
                      <div className="space-y-3">
                        {threadsToWeave.map((thread, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                            <p className="text-gray-700 font-medium">{thread}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Ask Athena Button */}
                  <div className="text-center pt-4">
                    <Link
                      href="/chat"
                      className="bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 rounded-lg font-bold text-xl transition-colors shadow-lg inline-block"
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