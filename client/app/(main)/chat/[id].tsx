import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useEffect, useRef } from 'react';

import { EnhancedDirectChatList } from '@/features/chat/components/direct-chats-list';
import { SendDirectMessage } from '@/features/chat/components/send-direct-message';

import {
  connectDirectChatWebSocket,
  type DirectChatSocket,
} from '@/features/chat/gateway/direct-chat.gateway';
import { DirectChatRepository } from '@/db/repositories/direct-chat';

export default function DirectChatScreen() {
  const { id, name, receiverId } = useLocalSearchParams() as unknown as {
    id: string;
    name: string;
    receiverId: string;
  };
  const socket = useRef<DirectChatSocket | null>(null);

  useEffect(() => {
    // 1. Connect
    socket.current = connectDirectChatWebSocket({ conversationId: id, receiverId });

    // 2. Listen
    socket.current.on('chatMessage', async (data) => {
      const directChatRepository = new DirectChatRepository();
      await directChatRepository.create({
        _id: data._id,
        conversationId: id,
        isDelivered: false,
        isSeen: false,
        mode: 'RECEIVED',
        text: data.text,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.createdAt),
      });
    });

    // 3. CLEANUP: Disconnect the socket when leaving the screen
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, [id, receiverId]);

  const onSend = (text: string) => {
    if (!socket.current) return;

    // Emit with an Acknowledgement Callback
    socket.current.emit('chatMessage', text, async (response) => {
      const directChatRepository = new DirectChatRepository();

      // Save your OWN message to local DB
      await directChatRepository.create({
        _id: response._id, // Use the real ID from server
        conversationId: id,
        isDelivered: false, // It's sent, but maybe not delivered to user yet
        isSeen: false,
        mode: 'SENT', // Important: Mark as SENT
        text: response.text,
        createdAt: new Date(response.createdAt),
        updatedAt: new Date(response.createdAt),
      });
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: name, animation: 'none' }} />
      <View className="flex-1">
        <EnhancedDirectChatList conversationId={id} />
        <SendDirectMessage className="items-center" handleSubmit={onSend} />
      </View>
    </>
  );
}
