'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AUTH_CACHE_KEY = 'auth_status';
const CACHE_DURATION = 2 * 60 * 1000;

let authPromise: Promise<boolean> | null = null;

interface AuthCache {
  isAuthenticated: boolean;
  timestamp: number;
}

async function checkAuth(): Promise<boolean> {
  if (authPromise) {
    return authPromise;
  }

  authPromise = (async () => {
    try {
      const res = await fetch('/api/auth/me', { 
        credentials: 'include',
        headers: {
          'Cache-Control': 'max-age=30'
        }
      });
      
      const isAuthenticated = res.ok;
      setAuthCache(isAuthenticated);
      return isAuthenticated;
    } catch (err) {
      console.error('Auth check error:', err);
      return false;
    } finally {
      authPromise = null;
    }
  })();

  return authPromise;
}

function getAuthCache(): AuthCache | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return null;
    const data: AuthCache = JSON.parse(cached);
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
  }
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [showOptimistic, setShowOptimistic] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const cached = getAuthCache();
    if (cached?.isAuthenticated) {
      setChecking(false);
      return;
    }

    const optimisticTimer = setTimeout(() => {
      if (mounted && checking) {
        setShowOptimistic(true);
      }
    }, 200);

    (async () => {
      try {
        const isAuthenticated = await checkAuth();
        
        if (!mounted) return;
        
        if (!isAuthenticated) {
          router.push('/login');
          return;
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        if (mounted) {
          clearTimeout(optimisticTimer);
          setChecking(false);
          setShowOptimistic(false);
        }
      }
    })();
    
    return () => { 
      mounted = false;
      clearTimeout(optimisticTimer);
    };
  }, [router]);

  if (!checking || showOptimistic) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-temple flex items-center justify-center">
      <div className="text-xl font-serif text-primary-800 animate-pulse">
        Checking authentication...
      </div>
    </div>
  );
}