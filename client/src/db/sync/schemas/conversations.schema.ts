import { objectIdSchema } from '@/lib/schemas';
import { type } from 'arktype';

const conversationResponseSchema = type({
  _id: objectIdSchema,
  user_id: 'string',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export const conversationsResponseSchema = type({
  created: conversationResponseSchema.array(),
  updated: conversationResponseSchema.array(),
  deleted: 'string[]',
});
