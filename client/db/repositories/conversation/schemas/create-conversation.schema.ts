import { type } from 'arktype';

import { objectIdSchema, phoneSchema } from '@/lib/schemas';

export const createConversationParamSchema = type({
  id: objectIdSchema,
  userId: 'string.uuid',
  contact: phoneSchema,
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type CreateConversationParam = typeof createConversationParamSchema.infer;
