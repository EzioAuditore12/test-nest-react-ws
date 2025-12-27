import { router, useLocalSearchParams } from 'expo-router';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfile } from '@/features/common/components/user-profiler';

import { Text } from '@/components/ui/text';

import { useGetUser } from '@/features/common/hooks/use-get-user';

import { Button } from '@/components/ui/button';

import { ConversationRepository } from '@/db/repositories/conversation';

export default function UserDetails() {
  const safeAreaInsets = useSafeAreaInsets();

  const { id } = useLocalSearchParams() as unknown as { id: string };

  const { data } = useGetUser(id);

  if (!data)
    return (
      <View className="flex-1 items-center justify-center">
        <Text variant={'h1'}>Not Found</Text>
      </View>
    );

  return (
    <ScrollView
      className="flex-1"
      style={{ marginTop: safeAreaInsets.top }}
      contentContainerClassName="items-center justify-center gap-y-2 p-2">
      <UserProfile className="w-full max-w-md" data={data} />

      <Button
        onPress={async () => {
          const conversationRepository = new ConversationRepository();

          const existingConversation = await conversationRepository.getConversationWithUserId(id);

          console.log(existingConversation);

          if (existingConversation) {
            router.push({
              pathname: '/(main)/chat/[id]',
              params: {
                id: existingConversation.id,
                name: existingConversation.contact,
                receiverId: existingConversation.user.id,
              },
            });
            return;
          }

          router.push({
            pathname: '/(main)/new-chat/[id]',
            params: { id: data.id, name: data.name },
          });
        }}>
        <Text>Start Chat</Text>
      </Button>
    </ScrollView>
  );
}
