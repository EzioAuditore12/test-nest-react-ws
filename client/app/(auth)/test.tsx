import { View } from 'react-native';
import { useState, useCallback, useEffect } from 'react';

import { ChatList } from '@/features/chat/components/chat-list';

import { SendMessage } from '@/features/chat/components/send-message';

import type { Message } from '@/features/chat/schemas/message.schema';

const CURRENT_USER_ID = '1'; // Mock current user ID

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'OTHER',
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          id: '2',
          name: 'John Doe',
          createdAt: 'dasdas',
          updatedAt: 'asd',
          username: 'johnKaBap',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((data: { text: string }) => {
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

    setMessages((previousMessages) => [newMessage, ...previousMessages]);
  }, []);

  return (
    <View className="flex-1">
      <ChatList data={messages} />

      <SendMessage handleSubmit={onSend} />
    </View>
  );
}