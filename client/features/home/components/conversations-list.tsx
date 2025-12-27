import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { FlashList, type FlashListProps } from '@shopify/flash-list';
import { router } from 'expo-router';

import { database } from '@/db';
import { Conversation } from '@/db/models/conversation.model';
import { CONVERSATION_TABLE_NAME } from '@/db/tables/conversation.table';

import { EnhancedConversationCard } from './conversation-card';

interface ConversationListProps extends Omit<
  FlashListProps<Conversation>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> {
  data: Conversation[];
  isFetchingNextPage?: boolean;
}

const enhance = withObservables([], () => ({
  data: database
    .get<Conversation>(CONVERSATION_TABLE_NAME)
    .query(Q.sortBy('updated_at', Q.desc))
    .observe(),
}));

function ConversationList({
  className,
  isFetchingNextPage,
  data,
  ...props
}: ConversationListProps) {
  return (
    <>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EnhancedConversationCard
            data={item}
            className="mb-3"
            onPress={() =>
              router.push({
                pathname: '/(main)/chat/[id]',
                params: { id: item.id, name: item.contact, receiverId: item.user.id },
              })
            }
          />
        )}
        {...props}
      />
    </>
  );
}

export const EnhancedConversationList = enhance(ConversationList);
