import { type } from 'arktype';

import { phoneSchema } from '@/lib/schemas';

export const createConversationParamSchema = type({
  userId: 'string.uuid',
  contact: phoneSchema,
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type CreateConversationParam = typeof createConversationParamSchema.infer;
