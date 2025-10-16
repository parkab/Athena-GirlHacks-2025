'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AUTH_CACHE_KEY = 'auth_status';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

interface AuthCache {
  isAuthenticated: boolean;
  timestamp: number;
}

function getAuthCache(): AuthCache | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return null;
    const data: AuthCache = JSON.parse(cached);
    // check if cache is still valid
    if (Date.now() - data.timestamp > CACHE_DURATION) {
      localStorage.removeItem(AUTH_CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setAuthCache(isAuthenticated: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const cache: AuthCache = {
      isAuthenticated,
      timestamp: Date.now()
    };
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore localStorage errors
  }
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // check cache first
    const cached = getAuthCache();
    if (cached?.isAuthenticated) {
      setChecking(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/auth/me', { 
          credentials: 'include',
          // add cache headers to potentially speed up repeated requests
          headers: {
            'Cache-Control': 'max-age=60'
          }
        });
        
        if (!mounted) return;
        
        if (res.status === 401) {
          setAuthCache(false);
          router.push('/login');
          return;
        }
        
        if (res.ok) {
          setAuthCache(true);
        } else {
          console.error('Auth check failed:', await res.text());
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    
    return () => { mounted = false; };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-temple flex items-center justify-center">
        <div className="text-xl font-serif text-primary-800">Checking authentication...</div>
      </div>
    );
  }

  return <>{children}</>;
}