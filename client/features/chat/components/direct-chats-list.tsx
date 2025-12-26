import { DirectChat } from '@/db/models/direct-chat.model';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import { useMemo } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';

import { cn } from '@/lib/utils';

import { ChatText } from './chat-text';

import { DIRECT_CHAT_TABLE_NAME } from '@/db/tables/direct-chat.table';
import { database } from '@/db';

interface DirectChatListProps extends Omit<FlashListProps<DirectChat>, 'data' | 'renderItem'> {
  data: DirectChat[];
}

function DirectChatList({ className, data, ...props }: DirectChatListProps) {
  const reversedChats = useMemo(() => [...data].reverse(), [data]);

  return (
    <FlashList
      data={reversedChats}
      className={cn('p-2', className)}
      maintainVisibleContentPosition={{
        autoscrollToBottomThreshold: 0.2,
        startRenderingFromBottom: true,
      }}
      onStartReachedThreshold={0.5}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatText data={item} />}
      contentContainerStyle={{ paddingBottom: 20 }}
      {...props}
    />
  );
}

const enhance = withObservables(
  ['conversationId'],
  ({ conversationId }: { conversationId: string }) => ({
    data: database
      .get<DirectChat>(DIRECT_CHAT_TABLE_NAME)
      .query(Q.where('conversation_id', conversationId))
      .observe(),
  }),
);


export const EnhancedDirectChatList = enhance(DirectChatList);