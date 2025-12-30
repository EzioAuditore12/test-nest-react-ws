import { type } from 'arktype';

import { phoneSchema, watermelondbIdSchema } from '@/lib/schemas';

import { userSchema } from '@/db/repositories/user/schemas/user.schema';

export const conversationSchema = type({
  id: watermelondbIdSchema,
  contact: phoneSchema,
  user: userSchema,
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type Conversation = typeof conversationSchema.infer;
