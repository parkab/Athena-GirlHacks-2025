'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      console.log('Attempting login for:', username);
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ensure cookie is accepted
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Login response status:', res.status);
      console.log('Login response headers:', Object.fromEntries(res.headers.entries()));
      
      // Check if response has content
      const contentType = res.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      let data;
      try {
        const responseText = await res.text();
        console.log('Raw response:', responseText);
        
        if (!responseText) {
          throw new Error('Empty response from server');
        }
        
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error(`Invalid server response: ${jsonError instanceof Error ? jsonError.message : 'Unknown error'}`);
      }
      
      if (!res.ok) {
        console.error('Login failed:', data);
        setError(data?.error || `Login failed (${res.status})`);
        return;
      }
      
      console.log('Login successful:', data);
      if (data?.token) localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError((err instanceof Error) ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-temple flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border-2 border-gold-200">
        <h1 className="text-2xl font-serif font-bold text-primary-800 mb-4">Sign in</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              className="mt-1 w-full p-3 border-2 border-primary-200 rounded-lg text-gray-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border-2 border-primary-200 rounded-lg text-gray-700" //text-black turns it gray?????
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-semibold" //text-black turns it gray?????
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <a href="/register" className="text-primary-600 hover:underline">New here? Create account</a>
        </div>
      </div>
    </div>
  );
}