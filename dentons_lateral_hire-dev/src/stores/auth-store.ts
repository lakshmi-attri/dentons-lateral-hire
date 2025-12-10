import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import CryptoJS from 'crypto-js';
import { storage } from '@/lib/storage';
import { generateId } from '@/lib/uuid';
import { ensureSeedApplications } from '@/lib/seed-data';
import type { User, UserCredentials } from '@/types/user';

// Browser-compatible password hashing using PBKDF2
const hashPassword = (password: string): string => {
  return CryptoJS.PBKDF2(password, 'dentons-salt-2025', {
    keySize: 256 / 32,
    iterations: 1000
  }).toString();
};

const verifyPassword = (password: string, hash: string): boolean => {
  const computedHash = hashPassword(password);
  return computedHash === hash;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  sessionExpiry: number | null;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  checkSession: () => boolean;
  seedAdminUser: () => Promise<void>;
}

const SESSION_DURATION = 24 * 60 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      sessionExpiry: null,

      seedAdminUser: async () => {
        const seeded = storage.get('admin-seed');
        if (seeded?.seeded) return;

        const users = storage.get('users') || [];
        const adminExists = users.some(u => u.email === 'admin@dentons.com');

        if (!adminExists) {
          const passwordHash = hashPassword('admin');

          const adminUser: UserCredentials = {
            id: generateId(),
            email: 'admin@dentons.com',
            name: 'Admin User',
            passwordHash,
            role: 'admin',
            createdAt: new Date().toISOString(),
          };

          users.push(adminUser);
          storage.set('users', users);
          storage.set('admin-seed', { seeded: true });
        }
      },

      login: async (email, password) => {
        const users = storage.get('users') || [];
        const user = users.find(u => u.email === email);

        if (!user) {
          return { success: false, error: 'Invalid email or password' };
        }

        const isValid = verifyPassword(password, user.passwordHash);
        if (!isValid) {
          return { success: false, error: 'Invalid email or password' };
        }

        // Check if email is in admin emails list
        const adminEmails = storage.get('admin-emails') || ['admin@dentons.com'];
        const normalizedEmail = email.toLowerCase().trim();
        const isAdminUser = adminEmails.includes(normalizedEmail);

        const sessionExpiry = Date.now() + SESSION_DURATION;

        set({
          user: { id: user.id, email: user.email, name: user.name, role: isAdminUser ? 'admin' : user.role, createdAt: user.createdAt },
          isAuthenticated: true,
          isAdmin: isAdminUser,
          sessionExpiry,
        });

        ensureSeedApplications(user.id, isAdminUser);

        return { success: true };
      },

      signup: async (email, name, password) => {
        const users = storage.get('users') || [];

        if (users.some(u => u.email === email)) {
          return { success: false, error: 'Email already registered' };
        }

        const passwordHash = hashPassword(password);

        const newUser: UserCredentials = {
          id: generateId(),
          email,
          name,
          passwordHash,
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        storage.set('users', users);

        const sessionExpiry = Date.now() + SESSION_DURATION;

        set({
          user: { id: newUser.id, email, name, role: 'user', createdAt: newUser.createdAt },
          isAuthenticated: true,
          isAdmin: false,
          sessionExpiry,
        });

        ensureSeedApplications(newUser.id, false);

        return { success: true };
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          sessionExpiry: null,
        });
      },

      checkSession: () => {
        const { sessionExpiry } = get();
        if (!sessionExpiry || Date.now() > sessionExpiry) {
          get().logout();
          return false;
        }
        return true;
      },
    }),
    {
      name: 'auth-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        sessionExpiry: state.sessionExpiry,
      }),
    }
  )
);
