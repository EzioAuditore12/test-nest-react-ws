import { type } from 'arktype';

const userSchema = type({
  id: 'string.uuid',
  username: '0 < string <= 50',
  name: '0 < string <= 50',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export const usersResponseSchema = type({
    created: userSchema.array(),
    updated: 'Array',
    deleted: 'Array',
})