import { type } from 'arktype';

export const userSchema = type({
  id: 'string.uuid',
  username: '0 < string <= 50',
  name: '0 < string <= 50',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export type User = typeof userSchema.infer;
