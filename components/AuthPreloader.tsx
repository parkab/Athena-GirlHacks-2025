'use client';

import { useEffect } from 'react';

export default function AuthPreloader() {
  useEffect(() => {
    const preloadAuth = async () => {
      try {
        await fetch('/api/auth/me', { 
          credentials: 'include',
          headers: {
            'Cache-Control': 'max-age=60',
            'Priority': 'low'
          }
        });
      } catch (error) {
        console.debug('Auth preload failed (this is normal):', error);
      }
    };

    const timeoutId = setTimeout(preloadAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}