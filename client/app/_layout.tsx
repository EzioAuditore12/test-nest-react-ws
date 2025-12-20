import '@/global.css';

import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

import { NAV_THEME } from '@/lib/theme';
import { TanstackReactQueryClientProvider } from '@/providers/tanstak-query-client.provider';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <KeyboardProvider>
        <TanstackReactQueryClientProvider>
          <Stack initialRouteName="(main)" screenOptions={{ headerShown: false }} />
        </TanstackReactQueryClientProvider>
      </KeyboardProvider>
      <PortalHost />
    </ThemeProvider>
  );
}
