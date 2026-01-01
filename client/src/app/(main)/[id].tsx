import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile, UserProfileLoading } from '@/features/common/components/user-profiler';

import { Text } from '@/components/ui/text';

import { useGetUser } from '@/features/common/hooks/use-get-user';

import { Button } from '@/components/ui/button';

import { navigateToChat } from '@/features/chat/sevices/chat-natvigate.service';

export default function UserDetails() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { data, isLoading } = useGetUser(id);

  if (isLoading) return <UserProfileLoading />;

  return (
    <ScrollView
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="flex-1 items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full max-w-md" data={data} />

      <Button onPress={async () => await navigateToChat(data!.id, data!.name)}>
        <Text>Start Chat</Text>
      </Button>
    </ScrollView>
  );
}
