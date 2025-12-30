import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { DeviceConfigStoreType } from './type';
import { zustandStorage } from '../storage';

export const useDeviceConfigStore = create<DeviceConfigStoreType>()(
  persist(
    (set) => ({
      expoPushToken: null,
      setExpoPushToken: (token: string) => {
        set({ expoPushToken: token });
      },
      clearExpoPushToken: () => {
        set({ expoPushToken: null });
      },
    }),
    {
      name: 'client-device-settings',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
