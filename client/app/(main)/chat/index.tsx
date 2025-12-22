import { View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Stack } from 'expo-router';

import { Text } from '@/components/ui/text';

import { connectWebSocket, type Socket } from '@/lib/ws';

import { ChatList } from '@/features/chat/components/chat-list';

import { SendMessage } from '@/features/chat/components/send-message';

import type { Message } from '@/features/chat/schemas/message.schema';

import { useAuthStore } from '@/store/auth';

export default function ChatScreen() {
  const user = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState<Message[] | []>([]);
  const [typers, setTypers] = useState<(string | undefined)[]>([]);

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
          text: data.text,
          user: {
            id: String(Math.round(Math.random() * 1000000)),
            name: data.sender,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            username: data.sender,
          },
        };

        setMessages((prev) => [receivedMessage, ...prev]);
      });

      socket.current?.on('typing', (username) => {
        if (!username) return;

        setTypers((prev) => {
          if (prev.includes(username)) return prev;
          return [...prev, username];
        });

        // Remove typer after 3 seconds
        setTimeout(() => {
          setTypers((prev) => prev.filter((u) => u !== username));
        }, 3000);
      });
    });

    return () => {
      socket.current?.off('connect');
      socket.current?.off('roomNotice');
      socket.current?.off('chatMessage');
      socket.current?.off('typing');
    };
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
        id: String(Math.round(Math.random() * 1000000)),
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
      <Stack.Screen
        options={{
          headerTitle: 'Group Chat',
          headerRight: () => (
            <Text className="text-xs text-gray-500">
              {typers.length > 0 && `${typers.join(', ')} is typing...`}
            </Text>
          ),
        }}
      />
      <View className="flex-1">
        <ChatList data={messages} />

        <SendMessage handleSubmit={onSend} />
      </View>
    </>
  );
}
