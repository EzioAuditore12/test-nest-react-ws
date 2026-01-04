import { objectIdSchema } from '@/lib/schemas';
import { type } from 'arktype';

export const directChatResponseSchema = type({
  id: objectIdSchema,
  conversation_id: objectIdSchema,
  text: '0 < string <= 1000',
  mode: " 'SENT' | 'RECEIVED' ",
  is_delivered: 'boolean',
  is_seen: 'boolean',
  created_at: 'number',
  updated_at: 'number',
});

export const directChatsResponseSchema = type({
  created: directChatResponseSchema.array(),
  updated: directChatResponseSchema.array(),
  deleted: 'string[]',
});
