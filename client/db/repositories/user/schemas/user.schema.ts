import { type } from 'arktype';

import { phoneSchema } from '@/lib/schemas';

export const userSchema = type({
  id: 'string.uuid',
  firstName: '0 < string <= 50',
  middleName: 'string <= 50 | null',
  lastName: '0 < string <= 50',
  phoneNumber: phoneSchema,
  email: 'string.email | null',
  avatar: 'string.url | null',
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type User = typeof userSchema.infer;
