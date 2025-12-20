import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/store/auth';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function HomeScreen() {
  const { logout } = useAuthStore((state) => state);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button onPress={logout} variant={'destructive'}>
              <Text>Logout</Text>
            </Button>
          ),
          headerTitle: 'Home',
        }}
      />
      <View className="flex-1 items-center justify-center">
        <Text>Home Screen</Text>
      </View>
    </>
  );
}
