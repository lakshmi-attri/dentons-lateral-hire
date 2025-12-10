'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function useRequireAuth(requiredRole?: 'admin') {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user, checkSession } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to allow Zustand hydration from localStorage
    const timeoutId = setTimeout(() => {
      try {
        const isValid = checkSession();

        if (!isValid || !isAuthenticated) {
          router.push('/sign-in');
          return;
        }

        if (requiredRole === 'admin' && !isAdmin) {
          router.push('/dashboard');
        }

        setIsChecking(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/sign-in');
      }
    }, 50); // 50ms delay for hydration

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isAdmin, requiredRole, router, checkSession]);

  return { user, isAdmin, isAuthenticated, isChecking };
}
