'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function AdminPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    // Redirect directly to applications page - no dashboard for admin
    router.replace('/admin/applications');
  }, [isAdmin, router]);

  return null;
}
