import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { EnhancedConversationList } from '@/features/home/components/conversations-list';
import { useAuthStore } from '@/store/auth';
import { router, Stack } from 'expo-router';
import { Pressable, View } from 'react-native';

export default function HomeScreen() {
  const { logout, user } = useAuthStore((state) => state);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <>
              <Pressable onPress={() => router.push('/(main)/profile')}>
                <Avatar className="mr-3 size-14" alt={user?.name ?? ''}>
                  <AvatarImage />
                  <AvatarFallback>
                    <Text>{user?.name ? user.name[0] : ''}</Text>
                  </AvatarFallback>
                </Avatar>
              </Pressable>
              <Button
                className="mr-2"
                variant={'ghost'}
                onPress={() => router.push('/(main)/search')}>
                <Text>Search</Text>
              </Button>
              <Button onPress={logout} variant={'destructive'}>
                <Text>Logout</Text>
              </Button>
            </>
          ),
          headerTitle: 'Home',
        }}
      />
      <View className="flex-1 p-2">
        <EnhancedConversationList />
      </View>
    </>
  );
}
