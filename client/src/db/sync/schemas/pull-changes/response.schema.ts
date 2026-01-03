import { type } from 'arktype';
import { conversationsResponseSchema } from '../conversations.schema';
import { usersResponseSchema } from '../users.schema';

export const pullChangesResponseSchema = type({
  changes: {
    conversations: conversationsResponseSchema,
    users: usersResponseSchema,
  },
  timestamp: 'number',
});

export type PullChangesResponse = typeof pullChangesResponseSchema.infer;
