'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!mounted) return;
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (!res.ok) {
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