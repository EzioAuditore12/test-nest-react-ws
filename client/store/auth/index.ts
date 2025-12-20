import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { AuthStoreType } from './type';
import { zustandStorage } from '../storage';

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      setTokens: (data) => set({ tokens: data }),
      setUserDetail: (data) => set({ user: data }),
      logout: () => set({ user: null, tokens: null }),
    }),
    {
      name: 'client-auth-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
