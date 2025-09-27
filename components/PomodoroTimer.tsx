'use client';

import { useEffect, useRef, useState } from 'react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work);
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (timeLeft === 0) {
        if (mode === 'work') {
          setCompletedPomodoros(prev => prev + 1);
        }
        
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${mode === 'work' ? 'Work' : 'Break'} session completed!`);
        }
        
        setIsActive(false);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_SETTINGS[newMode]);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((TIMER_SETTINGS[mode] - timeLeft) / TIMER_SETTINGS[mode]) * 100;
  };

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getModeConfig = (timerMode: TimerMode) => {
    switch (timerMode) {
      case 'work':
        return { name: 'Focus', color: 'primary', bgColor: 'bg-primary-600' };
      case 'shortBreak':
        return { name: 'Short Break', color: 'green', bgColor: 'bg-green-600' };
      case 'longBreak':
        return { name: 'Long Break', color: 'gold', bgColor: 'bg-gold-600' };
    }
  };

  const currentConfig = getModeConfig(mode);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-8 border-4 border-gold-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary-800 mb-4">
            Temple of Focus
          </h1>
          <p className="text-lg text-primary-600">
            Channel the discipline of ancient warriors through focused work sessions
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => switchMode('work')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              mode === 'work'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              mode === 'shortBreak'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              mode === 'longBreak'
                ? 'bg-gold-600 text-white'
                : 'bg-gold-100 text-gold-700 hover:bg-gold-200'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-64 h-64 mx-auto mb-4 relative">
              
              <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000"
                style={{
                  borderTopColor: currentConfig.bgColor.includes('primary') ? '#16a34a' : 
                                 currentConfig.bgColor.includes('green') ? '#22c55e' : '#f59e0b',
                  transform: `rotate(${-90 + (getProgress() * 3.6)}deg)`,
                }}
              ></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-mono font-bold text-gray-800 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-lg font-semibold text-gray-600">
                  {currentConfig.name}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className={`${currentConfig.bgColor} hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105`}
            >
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetTimer}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-primary-50 p-4 rounded-lg text-center border-2 border-primary-200">
            <div className="text-3xl font-bold text-primary-700">
              {completedPomodoros}
            </div>
            <div className="text-sm text-primary-600">
              Completed Sessions
            </div>
          </div>
          <div className="bg-gold-50 p-4 rounded-lg text-center border-2 border-gold-200">
            <div className="text-3xl font-bold text-gold-700">
              {Math.round(getProgress())}%
            </div>
            <div className="text-sm text-gold-600">
              Current Progress
            </div>
          </div>
        </div>

        <div className="bg-temple p-6 rounded-lg border-2 border-primary-200">
          <h3 className="text-lg font-serif font-semibold text-primary-800 mb-3">
            🏛️ Ancient Wisdom for Modern Focus
          </h3>
          {mode === 'work' ? (
            <ul className="space-y-2 text-sm text-primary-700">
              <li>• Eliminate distractions - close unnecessary tabs and apps</li>
              <li>• Focus on one task with the intensity of a Spartan warrior</li>
              <li>• If distracted, acknowledge the thought and return to your task</li>
            </ul>
          ) : (
            <ul className="space-y-2 text-sm text-primary-700">
              <li>• Stand up and stretch your body</li>
              <li>• Take deep breaths or practice mindfulness</li>
              <li>• Hydrate and nourish yourself</li>
            </ul>
          )}
        </div>

        <div className="text-center mt-6 p-4 bg-gold-50 rounded-lg border border-gold-200">
          <blockquote className="text-gold-800 italic text-sm">
            &ldquo;Excellence is never an accident. It is always the result of high intention, 
            sincere effort, and intelligent execution; it represents the wise choice of many alternatives.&rdquo;
          </blockquote>
          <div className="text-gold-600 text-xs mt-2">— Aristotle</div>
        </div>
      </div>
    </div>
  );
}