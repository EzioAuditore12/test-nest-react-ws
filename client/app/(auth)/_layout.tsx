import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth';

export default function AuthScreensLayout() {
  const tokens = useAuthStore((state) => state.tokens);

  if (tokens) return <Redirect href={'/(main)'} />;

  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="test" />
    </Stack>
  );
}
