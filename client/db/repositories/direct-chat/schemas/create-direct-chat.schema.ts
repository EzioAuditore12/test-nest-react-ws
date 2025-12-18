import { type } from 'arktype';

import { objectIdSchema } from '@/lib/schemas';

export const createDirectChatParamSchema = type({
  _id: objectIdSchema,
  conversationId: 'string',
  text: '0 < string <= 1000',
  mode: " 'SENT' | 'RECEIVED' ",
  isDelivered: 'boolean',
  isSeen: 'boolean',
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type CreateDirectChatParam = typeof createDirectChatParamSchema.infer;
