import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { ChatList } from '@/features/chat/components/chat-list';
import { SendFirstMessage } from '@/features/chat/components/send-message';

import { useCreateChat } from '@/features/chat/hooks/use-create-chat';

import { EnhancedDirectChatList } from '@/features/chat/components/direct-chats-list';

export default function DirectChatScreen() {
  const { id, name, type } = useLocalSearchParams() as unknown as {
    id: string;
    name: string;
    type: 'NEW' | 'OLD';
  };

  const { mutate } = useCreateChat();

  if (type === 'NEW')
    return (
      <>
        <Stack.Screen options={{ headerTitle: name }} />
        <View className="flex-1">
          <ChatList data={[]} />
          <SendFirstMessage receiverId={id} handleSubmit={mutate} />
        </View>
      </>
    );

  return (
    <>
      <Stack.Screen options={{ headerTitle: name, animation: 'none' }} />
      <View className="flex-1">
        <EnhancedDirectChatList conversationId={id} />
        <SendFirstMessage receiverId={id} handleSubmit={mutate} />
      </View>
    </>
  );
}
