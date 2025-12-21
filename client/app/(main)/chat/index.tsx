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

      socket.current?.on('chatMessage', (data) => {
        const receivedMessage: Message = {
          id: String(Math.round(Math.random() * 1000000)),
          sender: 'OTHER',
          createdAt: new Date(),
          text: data.text, // Use text from data
          user: {
            id: 'ads',
            name: data.sender, // Use sender name from data
            createdAt: 'dasasd',
            updatedAt: 'asdasd',
            username: data.sender,
          },
        };

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
        name: user?.name || 'Me',
        username: user?.username || 'me',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    // Send object with text AND sender name
    socket.current?.emit('chatMessage', { text: newMessage.text, sender: newMessage.user.name });

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
