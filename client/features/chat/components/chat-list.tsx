import { View, type ViewProps } from 'react-native';

import { FlashList, FlashListProps } from '@shopify/flash-list';

import { cn } from '@/lib/utils';

import type { Message } from '../schemas/message.schema';
import { Text } from '@/components/ui/text';
import { useMemo } from 'react';

interface ChatListProps extends Omit<FlashListProps<Message>, 'data' | 'renderItem'> {
  data: Message[] | [];
}

interface MessageProps extends ViewProps {
  data: Message;
}

function MessageItem({ data, className, ...props }: MessageProps) {
  const { sender, text, createdAt, user } = data;

  return (
    <View
      className={cn(
        'my-1 max-w-xs rounded-xl p-3',
        sender === 'SELF' ? 'self-end' : 'self-start',
        sender === 'SELF' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}>
      <Text className={sender === 'SELF' ? 'text-white' : 'text-black dark:text-white'}>
        {text}
      </Text>
      {sender === 'OTHER' && <Text className="mt-2 font-bold">{user.name}</Text>}
      <Text
        variant={'small'}
        style={{
          color: sender === 'SELF' ? '#dbeafe' : '#6b7280',
        }}>
        {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

export function ChatList({ className, data }: ChatListProps) {
  const reversedMessages = useMemo(() => [...data].reverse(), [data]);

  return (
    <FlashList
      data={reversedMessages}
      className={cn('p-2', className)}
      maintainVisibleContentPosition={{
        autoscrollToBottomThreshold: 0.2,
        startRenderingFromBottom: true,
      }}
      onStartReachedThreshold={0.5}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageItem data={item} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
