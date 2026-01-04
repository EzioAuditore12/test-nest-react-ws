import '../../global.css';

import { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from 'uniwind';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import 'react-native-reanimated';

import { registerForPushNotificationsAsync } from '@/lib/notification';

import { useDeviceConfigStore } from '@/store/device';

import { NAV_THEME } from '@/lib/theme';
import { TanstackReactQueryClientProvider } from '@/providers/tanstak-query-client.provider';
import { database } from '@/db';

export default function RootLayout() {
  const { theme } = useUniwind();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token && token.length !== 0) {
        useDeviceConfigStore.getState().setExpoPushToken(token);
      }
    });
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[theme ?? 'light']}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <KeyboardProvider>
        <DatabaseProvider database={database}>
          <TanstackReactQueryClientProvider>
            <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }} />
          </TanstackReactQueryClientProvider>
        </DatabaseProvider>
      </KeyboardProvider>
      <PortalHost />
    </ThemeProvider>
  );
}
