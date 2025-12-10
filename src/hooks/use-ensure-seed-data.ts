import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { ensureSeedApplications } from '@/lib/seed-data';

export function useEnsureSeedData() {
  const { user, isAdmin } = useAuthStore();

  useEffect(() => {
    if (user) {
      ensureSeedApplications(user.id, isAdmin);
    }
  }, [user, isAdmin]);
}
