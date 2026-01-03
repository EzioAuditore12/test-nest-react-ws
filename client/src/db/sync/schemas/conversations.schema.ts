import { objectIdSchema } from '@/lib/schemas';
import { type } from 'arktype';

const conversationResponseSchema = type({
  id: objectIdSchema,
  contact: 'string',
  user_id: 'string.uuid',
  // _status: "'created' | 'updated' | 'deleted'",
  //_changed: 'string',
  created_at: 'number',
  updated_at: 'number',
});

export const conversationsResponseSchema = type({
  created: conversationResponseSchema.array(),
  updated: conversationResponseSchema.array(),
  deleted: 'string[]',
});
