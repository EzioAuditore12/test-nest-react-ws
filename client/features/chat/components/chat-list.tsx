import { View, type ViewProps, FlatList, type FlatListProps } from 'react-native';

import { cn } from '@/lib/utils';

import type { Message } from '../schemas/message.schema';
import { Text } from '@/components/ui/text';

interface ChatListProps extends Omit<FlatListProps<Message>, 'data' | 'inverted' | 'renderItem'> {
  data: Message[];
}

interface MessageProps extends ViewProps {
  data: Message;
}

function MessageItem({ data, className, ...props }: MessageProps) {
  const { sender, text, createdAt } = data;

  return (
    <View
      className="my-1 max-w-[80%] rounded-lg bg-gray-200 p-3"
      style={{
        alignSelf: sender === 'SELF' ? 'flex-end' : 'flex-start',
        backgroundColor: sender === 'SELF' ? 'blue' : '#e5e7eb',
      }}
      {...props}>
      <Text style={{ color: sender === 'SELF' ? 'white' : 'black' }}>{text}</Text>
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
      className={cn('p-2',className)}
      inverted
      onStartReachedThreshold={0.5}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageItem data={item} />}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
