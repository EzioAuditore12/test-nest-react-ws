import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useRef } from 'react';

import { EnhancedDirectChatList } from '@/features/chat/components/direct-chats-list';
import { SendDirectMessage } from '@/features/chat/components/send-direct-message';

import type { DirectChatSocket } from '@/features/chat/gateway/direct-chat.gateway';
import { useReceiveMessages } from '@/features/chat/gateway/events/receive-messages.event';
import { sendMessageEvent } from '@/features/chat/gateway/events/send-message.event';

export default function DirectChatScreen() {
  const { id, name, receiverId } = useLocalSearchParams() as unknown as {
    id: string;
    name: string;
    receiverId: string;
  };
  const socket = useRef<DirectChatSocket | null>(null);

  useReceiveMessages({ socket, receiverId, conversationId: id });

  return (
    <>
      <Stack.Screen options={{ headerTitle: name, animation: 'none' }} />
      <View className="flex-1">
        <EnhancedDirectChatList conversationId={id} />
        <SendDirectMessage
          socket={socket}
          conversationId={id}
          className="items-center"
          handleSubmit={sendMessageEvent}
        />
      </View>
    </>
  );
}
