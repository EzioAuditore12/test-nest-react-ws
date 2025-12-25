import { type } from 'arktype';

import { objectIdSchema } from '@/lib/schemas';

export const createChatResponseSchema = type({
  conversationId: objectIdSchema,
  _id: objectIdSchema,
  senderId: 'string.uuid',
  receiverId: 'string.uuid',
  text: '0 < string <= 1000',
  delivered: 'boolean',
  seen: 'boolean',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  __v: 'number',
});

export type CreateChatResponse = typeof createChatResponseSchema.infer;
