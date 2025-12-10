import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '@/lib/storage';

interface AdminSettingsState {
  adminEmails: string[];
  
  addAdminEmail: (email: string) => void;
  removeAdminEmail: (email: string) => void;
  isAdminEmail: (email: string) => boolean;
  loadAdminEmails: () => void;
}

// Initialize with default admin email
const DEFAULT_ADMIN_EMAIL = 'admin@dentons.com';

export const useAdminSettingsStore = create<AdminSettingsState>()(
  persist(
    (set, get) => ({
      adminEmails: [DEFAULT_ADMIN_EMAIL],

      loadAdminEmails: () => {
        const saved = storage.get('admin-emails');
        if (saved && Array.isArray(saved) && saved.length > 0) {
          set({ adminEmails: saved as string[] });
        } else {
          // Initialize with default if not exists
          storage.set('admin-emails', [DEFAULT_ADMIN_EMAIL]);
          set({ adminEmails: [DEFAULT_ADMIN_EMAIL] });
        }
      },

      addAdminEmail: (email: string) => {
        const { adminEmails } = get();
        const normalizedEmail = email.toLowerCase().trim();
        
        if (!normalizedEmail || !normalizedEmail.includes('@')) {
          throw new Error('Invalid email address');
        }

        if (adminEmails.includes(normalizedEmail)) {
          throw new Error('Email already has admin access');
        }

        const updated = [...adminEmails, normalizedEmail];
        storage.set('admin-emails', updated);
        set({ adminEmails: updated });
      },

      removeAdminEmail: (email: string) => {
        const { adminEmails } = get();
        const normalizedEmail = email.toLowerCase().trim();
        
        if (normalizedEmail === DEFAULT_ADMIN_EMAIL) {
          throw new Error('Cannot remove default admin email');
        }

        const updated = adminEmails.filter(e => e !== normalizedEmail);
        storage.set('admin-emails', updated);
        set({ adminEmails: updated });
      },

      isAdminEmail: (email: string) => {
        const { adminEmails } = get();
        return adminEmails.includes(email.toLowerCase().trim());
      },
    }),
    {
      name: 'admin-settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

