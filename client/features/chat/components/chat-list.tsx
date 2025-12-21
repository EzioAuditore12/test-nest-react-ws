import { View, type ViewProps, FlatList, type FlatListProps } from 'react-native';

import { cn } from '@/lib/utils';

import type { Message } from '../schemas/message.schema';
import { Text } from '@/components/ui/text';

interface ChatListProps extends Omit<FlatListProps<Message>, 'data' | 'inverted' | 'renderItem'> {
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
  return (
    <FlatList
      className={cn('p-2', className)}
      inverted
      onStartReachedThreshold={0.5}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageItem data={item} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
