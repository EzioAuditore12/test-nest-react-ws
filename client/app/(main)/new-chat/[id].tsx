import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { SendFirstMessage } from '@/features/chat/components/send-message';

import { useCreateChat } from '@/features/chat/hooks/use-create-chat';
import { Text } from '@/components/ui/text';

export default function NewDirectChatScreen() {
  const { id, name } = useLocalSearchParams() as unknown as {
    id: string;
    name: string;
  };

  const { mutate } = useCreateChat(id);

  return (
    <>
      <Stack.Screen options={{ headerTitle: name }} />
      <View className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Text variant={'h2'} className="text-center">
            Start a fresh new chat with ${name}
          </Text>
        </View>
        <SendFirstMessage className="items-center" receiverId={id} handleSubmit={mutate} />
      </View>
    </>
  );
}
