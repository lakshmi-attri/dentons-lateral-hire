'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLCQStore } from '@/stores/lcq-store';

export default function NewApplicationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const initializeApplication = useLCQStore((s) => s.initializeApplication);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    const applicationId = initializeApplication(user.id, 'individual');
    router.replace(`/application/${applicationId}`);
  }, [user, initializeApplication, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">Creating your application...</p>
    </div>
  );
}
