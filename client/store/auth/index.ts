import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { AuthStoreType } from './type';
import { zustandStorage } from '../storage';

import { database } from '@/db';

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      setTokens: (data) => set({ tokens: data }),
      setUserDetail: (data) => set({ user: data }),
      logout: async () => {
        await database.write(async () => {
          await database.unsafeResetDatabase();
        });

        set({ user: null, tokens: null });
      },
    }),
    {
      name: 'client-auth-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
