'use client';

import { useEffect, useRef, useState } from 'react';
import { PERSONALITIES } from "../lib/personalities";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  senderName?: string; // added: store name used when message was created
}

// determine a safe default personality id
const personalitiesList = Object.values(PERSONALITIES);
const defaultPersonalityId = personalitiesList[0]?.id ?? 'athena';

export default function ChatUI() {
   const [personalityId, setPersonalityId] = useState<string>('');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings, seeker of wisdom. I am Athena, goddess of wisdom and strategic warfare. How may I guide you on your path to excellence today?`,
      timestamp: new Date(),
      senderName: PERSONALITIES[defaultPersonalityId]?.name ?? 'Athena' // store initial display name
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // keep the initial assistant greeting text in sync only if not replaced,
  // but do NOT overwrite senderName so displayed name stays static per message
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{
          ...prev[0],
          content: `Greetings, seeker of wisdom. I am Athena. How may I guide you on your path to excellence today? \n\nI can also connect you with a few of my fellow gods if you'd like!`,
          // keep prev[0].senderName unchanged unless user uses selector inside the bubble
        }];
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalityId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim(), personalityId }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          senderName: PERSONALITIES[personalityId]?.name ?? 'Athena' // store name now so it won't change later
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to my wisdom at the moment. Please try again.',
        timestamp: new Date(),
        senderName: PERSONALITIES[personalityId]?.name ?? 'Athena'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // update personality and also update the first assistant bubble's senderName
  const handlePersonaChange = (newId: string) => {
    setPersonalityId(newId);
    setMessages(prev =>
      prev.map((m, i) =>
        i === 0 && m.role === 'assistant'
          ? { ...m, senderName: "Athena"}
          : m
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b-2 border-gold-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🦉</div>
            <div>
              <h2 className="text-xl font-serif font-bold text-primary-800">
                {"Athena's Wisdom"}
              </h2>
              <p className="text-sm text-primary-600">
                {/* optional description */}
              </p>
            </div>
          </div>

          {/* Removed top-level selector; it's now inside the first message bubble */}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-temple">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            message.role === 'user'
              ? 'bg-primary-600 text-white '
              : 'bg-white border-2 border-gold-200 text-gray-800'
          }`}
        >
          {message.role === 'assistant' && (
            <div className="mb-2">
              <div className="flex items-center">
                <span className="text-gold-600 text-sm font-semibold">
                  {message.senderName ?? PERSONALITIES[personalityId]?.name ?? 'Athena'}
                </span>
              </div>
            </div>
          )}

          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* dropdown moved below the first assistant bubble (outside the bubble div) */}
        {message.role === 'assistant' && index === 0 && (
          <div className="w-full flex justify-center mt-3">
            <div className="max-w-md w-full">
              <label className="sr-only">Select Persona</label>
              <select
                value={personalityId}
                onChange={(e) => handlePersonaChange(e.target.value)}
                className="p-2 border rounded bg-white text-sm w-full"
              >
                <option value="" disabled>I want to talk to...</option>
                {Object.values(PERSONALITIES).map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.fname ?? p.name ?? p.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-gold-200 text-gray-800 max-w-xs lg-max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-gold-600 text-sm font-semibold">{PERSONALITIES[personalityId]?.name ?? 'Athena'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t-2 border-gold-200 p-4">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${PERSONALITIES[personalityId]?.name ?? 'Athena'} for wisdom and guidance...`}
            className="text-gray-900 flex-1 p-3 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Send
          </button>
        </form>
        
        {/* Quick suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "How can I stay motivated?",
            "Help me prioritize my goals",
            "I'm feeling overwhelmed",
            "How to build better habits?"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInput(suggestion)}
              className="text-xs bg-gold-100 hover:bg-gold-200 text-gold-800 px-3 py-1 rounded-full transition-colors"
              disabled={isLoading}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}