import { objectIdSchema } from '@/lib/schemas';
import { type } from 'arktype';

const conversationResponseSchema = type({
  _id: objectIdSchema,
  participants: 'string[]',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
  __v: 'number',
  lastMessage: 'string',
});

export const conversationsResponseSchema = type({
  created: conversationResponseSchema.array(),
  updated: 'Array',
  deleted: 'string[]',
});
