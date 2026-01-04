import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { syncDatabase } from '@/db/sync';
import { EnhancedConversationList } from '@/features/home/components/conversations-list';
import { useAuthStore } from '@/store/auth';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

export default function HomeScreen() {
  const { logout, user } = useAuthStore((state) => state);
  // Use a version number to force re-renders
  const [syncVersion, setSyncVersion] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        await syncDatabase();
      } catch (error) {
        console.error('Sync failed:', error);
      } finally {
        // Increment version to force the list to remount with new data
        setSyncVersion((v) => v + 1);
      }
    })();
  }, []);

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
        {/* The key prop forces re-mounting of the EnhancedConversationList on syncVersion change */}
        <EnhancedConversationList key={syncVersion} />
      </View>
    </>
  );
}
