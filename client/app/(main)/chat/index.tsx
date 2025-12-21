import { View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { connectWebSocket, type Socket } from '@/lib/ws';

import { ChatList } from '@/features/chat/components/chat-list';

import { SendMessage } from '@/features/chat/components/send-message';

import type { Message } from '@/features/chat/schemas/message.schema';
import { useAuthStore } from '@/store/auth';

const CURRENT_USER_ID = '1';

export default function ChatScreen() {
  const user = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState<Message[] | []>([]);
  const insets = useSafeAreaInsets();

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = connectWebSocket();

    socket.current.on('connect', () => {
      socket.current?.emit('joinRoom', user?.name);

      socket.current?.on('roomNotice', (username) => {
        console.log(`${username} joined to group`);
      });

      socket.current?.on('chatMessage', (message) => {
        const receivedMessage: Message = {
          id: String(Math.round(Math.random() * 1000000)),
          sender: 'OTHER',
          createdAt: new Date(),
          text: message,
          user: {
            id: 'ads',
            name: 'asd',
            createdAt: 'dasasd',
            updatedAt: 'asdasd',
            username: 'asd',
          },
        };

        // FIX: Put received message at the START of the array
        setMessages((prev) => [receivedMessage, ...prev]);
      });
    });
  }, [user?.name]);

  const onSend = (data: { text: string }) => {
    const text = data.text.trim();
    if (!text) return;

    const newMessage: Message = {
      id: String(Math.round(Math.random() * 1000000)),
      text: text,
      createdAt: new Date(),
      sender: 'SELF',
      user: {
        id: CURRENT_USER_ID,
        name: 'Me',
        username: 'me',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    socket.current?.emit('chatMessage', newMessage.text);

    setMessages((previousMessages) => [newMessage, ...previousMessages]);
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Group Chat' }} />
      <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
        <ChatList data={messages} />

        <SendMessage handleSubmit={onSend} />
      </View>
    </>
  );
}
