import { type } from 'arktype';

import { userSchema } from '@/features/auth/common/schemas/user.schema';

export const messageSchema = type({
  id: 'string',
  sender: " 'SELF' | 'OTHER' ",
  text: 'string',
  createdAt: 'Date',
  user: userSchema,
});

export type Message = typeof messageSchema.infer;
