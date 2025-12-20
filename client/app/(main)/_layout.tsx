import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth';

export default function MainScreensLayout() {
  const tokens = useAuthStore((state) => state.tokens);

  if (!tokens) return <Redirect href={'/(auth)/login'} />;

  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="chat/index" options={{ headerShown: false }} />
    </Stack>
  );
}
