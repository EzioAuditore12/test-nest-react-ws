import { type } from 'arktype';
import { conversationsResponseSchema } from '../conversations.schema';
import { usersResponseSchema } from '../users.schema';
import { directChatsResponseSchema } from '../direct_chat.schema';

export const pullChangesResponseSchema = type({
  changes: {
    conversations: conversationsResponseSchema,
    users: usersResponseSchema,
    direct_chats: directChatsResponseSchema,
  },
  timestamp: 'number',
});

export type PullChangesResponse = typeof pullChangesResponseSchema.infer;
