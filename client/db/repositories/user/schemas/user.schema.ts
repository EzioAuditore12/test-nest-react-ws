import { type } from 'arktype';

export const userSchema = type({
  id: 'string.uuid',
  name: '0 < string <= 50',
  username: '0 < string <= 50',
  createdAt: 'Date',
  updatedAt: 'Date',
});

export type User = typeof userSchema.infer;
