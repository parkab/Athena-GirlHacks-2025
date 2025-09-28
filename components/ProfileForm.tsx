'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProfileFormData {
  purpose: string;
  vision: string;
  values: string[];
  selfAssessment: {
    questions: string[]; // fixed 12 questions
  };
}

export default function ProfileForm() {
  const router = useRouter();
  const PROMPTS = [
    'What are some habits you wish to build or change right now, and why?',
    'What beliefs or fears have held you back from pursuing personal growth in the past?',
    'How do you typically respond to setbacks – do you learn from them or dwell on them?',
    'What is an area in your life where you wish you were more consistent (health, study, relationships, etc.)?',
    'Which daily routines or rituals help you feel most grounded and effective?',
    'Are there social pressures or outside expectations that influence your choices more than you want?',
    'What specific skills or knowledge do you want to develop over the next year?',
    'Who inspires you, and what qualities do they possess that you’d like to cultivate yourself?',
    'How do you measure progress toward your goals—what does success look like for you?',
    'What is one small change you could make this week that might lead to bigger improvements over time?',
    'When do you feel most fulfilled or “in flow”—what activities are you doing?',
    'How often do you intentionally reflect on your personal growth journey?'
  ];
  const [formData, setFormData] = useState<ProfileFormData>({
    purpose: '',
    vision: '',
    values: [''],
    selfAssessment: {
      // store user responses here; prompts are kept in PROMPTS
      questions: Array(PROMPTS.length).fill('')
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

  const updateQuestion = (index: number, text: string) => {
    setFormData(prev => ({
      ...prev,
      selfAssessment: {
        ...prev.selfAssessment,
        questions: prev.selfAssessment.questions.map((q, i) => i === index ? text : q)
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
          questions: formData.selfAssessment.questions.map(q => q.trim()).filter(Boolean)
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
              className="text-gray-900 w-full h-32 p-4 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
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
              className="text-gray-900 w-full h-32 p-4 border-2 border-gold-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
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
                  className="text-gray-900 flex-1 p-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
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

            <div className="grid gap-6">
              {PROMPTS.map((prompt, index) => (
                <div key={index}>
                  <label className="block text-primary-700 font-semibold mb-2">Question {index + 1}</label>
                  <p className="text-sm text-primary-600 mb-2">{prompt}</p>
                  <textarea
                    value={formData.selfAssessment.questions[index]}
                    onChange={(e) => updateQuestion(index, e.target.value)}
                    rows={3}
                    className="text-gray-900 w-full p-3 border-2 border-gold-200 rounded-lg focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                    placeholder="Write your response..."
                  />
                </div>
              ))}
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