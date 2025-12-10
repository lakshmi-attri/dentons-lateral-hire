import type { UserCredentials } from '@/types/user';
import type { Application } from '@/types/application';

type StorageKey = 'users' | 'applications' | 'admin-seed' | 'admin-emails';

interface StorageSchema {
  users: UserCredentials[];
  applications: Application[];
  'admin-seed': { seeded: boolean };
  'admin-emails': string[];
}

class TypedStorage {
  get<K extends StorageKey>(key: K): StorageSchema[K] | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }

  set<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  remove(key: StorageKey): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }
}

export const storage = new TypedStorage();
