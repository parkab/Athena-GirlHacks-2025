'use client';

import DashboardCard from '@/components/DashboardCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

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
  const [habits, setHabits] = useState([
    { name: 'Morning Meditation', completed: false, streak: 3 },
    { name: 'Daily Reading', completed: true, streak: 7 },
    { name: 'Exercise', completed: false, streak: 2 },
    { name: 'Journaling', completed: true, streak: 5 },
  ]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // include credentials so the token cookie is sent
      const response = await fetch('/api/profile', { headers: { authorization: 'Bearer ' + localStorage.getItem('token') } });
      if (response.status === 401) {
        // not authenticated — send user to login
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

  const toggleHabit = (index: number) => {
    setHabits(prev => 
      prev.map((habit, i) => 
        i === index 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const completedHabits = habits.filter(h => h.completed).length;
  const averageStreak = Math.round(habits.reduce((acc, h) => acc + h.streak, 0) / habits.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-temple flex items-center justify-center">
        <div className="text-2xl font-serif text-primary-800">Loading your wisdom...</div>
      </div>
    );
  }

  if (!profile) {
    return (
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
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-temple py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-primary-800 mb-4">
            Your Temple of Growth
          </h1>
          <p className="text-lg text-primary-600">
            Track your progress on the path to excellence
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <DashboardCard
            icon="�"
            title="Reflections Answered"
            value={profile.selfAssessment.questions.filter(Boolean).length}
            description="Number of self-reflection responses"
            color="primary"
          />
          <DashboardCard
            icon="✅"
            title="Today's Habits"
            value={`${completedHabits}/${habits.length}`}
            description="Habits completed today"
            color="green"
          />
          <DashboardCard
            icon="🔥"
            title="Average Streak"
            value={averageStreak}
            description="Average habit streak days"
            color="gold"
          />
          <DashboardCard
            icon="🎯"
            title="Answered Prompts"
            value={profile.selfAssessment.questions.filter(Boolean).length}
            description="Prompts you've responded to"
            color="primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8 border-2 border-gold-200">
            <h2 className="text-2xl font-serif font-bold text-primary-800 mb-6">
              Your Foundation
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-primary-700 mb-2">Purpose</h3>
                <p className="text-gray-700 bg-primary-50 p-4 rounded-lg">{profile.purpose}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gold-700 mb-2">Vision</h3>
                <p className="text-gray-700 bg-gold-50 p-4 rounded-lg">{profile.vision}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary-700 mb-2">Core Values</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.values.map((value, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-2">Self Reflections</h3>
                <ul className="space-y-4">
                  {profile.selfAssessment.questions.map((answer, index) => (
                    <li key={index} className="text-gray-700">
                      <div className="text-sm text-primary-600 font-semibold mb-1">Question {index + 1}</div>
                      <div className="bg-primary-50 p-4 rounded-lg">{answer || <span className="text-gray-400">No response</span>}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Habit Tracker */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-primary-200">
            <h2 className="text-xl font-serif font-bold text-primary-800 mb-6">
              Today&apos;s Habits
            </h2>
            
            <div className="space-y-4">
              {habits.map((habit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleHabit(index)}
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        habit.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {habit.completed && '✓'}
                    </button>
                    <div>
                      <div className={`font-medium ${habit.completed ? 'line-through text-gray-500' : ''}`}>
                        {habit.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        🔥 {habit.streak} day streak
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 text-center">
                Progress: {completedHabits}/{habits.length} habits completed
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${(completedHabits / habits.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Exercises */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 border-2 border-gold-200">
          <h2 className="text-2xl font-serif font-bold text-primary-800 mb-6">
            Wisdom Exercises
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-700 mb-3">
                🧘 Morning Reflection
              </h3>
              <p className="text-gray-700 mb-4">
                Start your day with 10 minutes of mindful reflection on your purpose and goals.
              </p>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors">
                Begin Exercise
              </button>
            </div>
            
            <div className="bg-gold-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gold-700 mb-3">
                📝 Values Assessment
              </h3>
              <p className="text-gray-700 mb-4">
                Evaluate how well your recent actions align with your core values.
              </p>
              <button className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded transition-colors">
                Begin Exercise
              </button>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                🎯 Goal Review
              </h3>
              <p className="text-gray-700 mb-4">
                Review your progress and adjust your goals for maximum effectiveness.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
                Begin Exercise
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="inline-flex space-x-4">
            <Link
              href="/chat"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ask Athena for Guidance
            </Link>
            <Link
              href="/pomodoro"
              className="bg-gold-600 hover:bg-gold-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Focus Session
            </Link>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}