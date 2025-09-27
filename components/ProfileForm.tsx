'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProfileFormData {
  purpose: string;
  vision: string;
  values: string[];
  selfAssessment: {
    currentLevel: number;
    goals: string[];
    challenges: string[];
  };
}

export default function ProfileForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>({
    purpose: '',
    vision: '',
    values: [''],
    selfAssessment: {
      currentLevel: 5,
      goals: [''],
      challenges: ['']
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addValue = () => {
    setFormData(prev => ({
      ...prev,
      values: [...prev.values, '']
    }));
  };

  const removeValue = (index: number) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }));
  };

  const updateValue = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.map((v, i) => i === index ? value : v)
    }));
  };

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      selfAssessment: {
        ...prev.selfAssessment,
        goals: [...prev.selfAssessment.goals, '']
      }
    }));
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      selfAssessment: {
        ...prev.selfAssessment,
        goals: prev.selfAssessment.goals.filter((_, i) => i !== index)
      }
    }));
  };

  const updateGoal = (index: number, goal: string) => {
    setFormData(prev => ({
      ...prev,
      selfAssessment: {
        ...prev.selfAssessment,
        goals: prev.selfAssessment.goals.map((g, i) => i === index ? goal : g)
      }
    }));
  };

  const addChallenge = () => {
    setFormData(prev => ({
      ...prev,
      selfAssessment: {
        ...prev.selfAssessment,
        challenges: [...prev.selfAssessment.challenges, '']
      }
    }));
  };

  const removeChallenge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      selfAssessment: {
        ...prev.selfAssessment,
        challenges: prev.selfAssessment.challenges.filter((_, i) => i !== index)
      }
    }));
  };

  const updateChallenge = (index: number, challenge: string) => {
    setFormData(prev => ({
      ...prev,
      selfAssessment: {
        ...prev.selfAssessment,
        challenges: prev.selfAssessment.challenges.map((c, i) => i === index ? challenge : c)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const filteredData = {
        ...formData,
        values: formData.values.filter(v => v.trim()),
        selfAssessment: {
          ...formData.selfAssessment,
          goals: formData.selfAssessment.goals.filter(g => g.trim()),
          challenges: formData.selfAssessment.challenges.filter(c => c.trim())
        }
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8 border-4 border-gold-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary-800 mb-4">
            Build Your Foundation
          </h1>
          <p className="text-lg text-primary-600">
            Like the pillars of a great temple, your personal foundation supports all growth
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Purpose Section */}
          <div className="bg-primary-50 p-6 rounded-lg">
            <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-4 flex items-center">
              🎯 Your Purpose
            </h2>
            <p className="text-primary-600 mb-4">
              What drives you? What is your deeper reason for being?
            </p>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full h-32 p-4 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              placeholder="My purpose is to..."
              required
            />
          </div>

          {/* Vision Section */}
          <div className="bg-gold-50 p-6 rounded-lg">
            <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-4 flex items-center">
              👁️ Your Vision
            </h2>
            <p className="text-primary-600 mb-4">
              Where do you see yourself in 5-10 years? What does success look like?
            </p>
            <textarea
              value={formData.vision}
              onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
              className="w-full h-32 p-4 border-2 border-gold-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
              placeholder="My vision is..."
              required
            />
          </div>

          {/* Values Section */}
          <div className="bg-primary-50 p-6 rounded-lg">
            <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-4 flex items-center">
              ⚖️ Your Core Values
            </h2>
            <p className="text-primary-600 mb-4">
              What principles guide your decisions and behavior?
            </p>
            {formData.values.map((value, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateValue(index, e.target.value)}
                  className="flex-1 p-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  placeholder="Enter a core value..."
                />
                {formData.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addValue}
              className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add Value
            </button>
          </div>

          {/* Self Assessment */}
          <div className="bg-gold-50 p-6 rounded-lg">
            <h2 className="text-2xl font-serif font-semibold text-primary-800 mb-6 flex items-center">
              📊 Self Assessment
            </h2>

            {/* Current Level */}
            <div className="mb-6">
              <label className="block text-primary-700 font-semibold mb-2">
                Current Level (1-10): {formData.selfAssessment.currentLevel}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.selfAssessment.currentLevel}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  selfAssessment: {
                    ...prev.selfAssessment,
                    currentLevel: parseInt(e.target.value)
                  }
                }))}
                className="w-full h-2 bg-gold-200 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-sm text-primary-600 mt-1">
                Rate your current level of personal development and life satisfaction
              </p>
            </div>

            {/* Goals */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-primary-700 mb-3">Goals</h3>
              {formData.selfAssessment.goals.map((goal, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                    className="flex-1 p-3 border-2 border-gold-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                    placeholder="Enter a goal..."
                  />
                  {formData.selfAssessment.goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addGoal}
                className="mt-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700"
              >
                Add Goal
              </button>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="text-lg font-semibold text-primary-700 mb-3">Challenges</h3>
              {formData.selfAssessment.challenges.map((challenge, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={challenge}
                    onChange={(e) => updateChallenge(index, e.target.value)}
                    className="flex-1 p-3 border-2 border-gold-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                    placeholder="Enter a challenge..."
                  />
                  {formData.selfAssessment.challenges.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChallenge(index)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addChallenge}
                className="mt-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700"
              >
                Add Challenge
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              {isSubmitting ? 'Saving Your Foundation...' : 'Build My Foundation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}