import { type } from 'arktype';

const userSchema = type({
  id: 'string.uuid',
  name: '0 < string <= 50',
  username: '0 < string <= 50',
  //_status: "'created' | 'updated' | 'deleted'",
  //_changed: 'string',
  created_at: 'number',
  updated_at: 'number',
});

export const usersResponseSchema = type({
  created: userSchema.array(),
  updated: 'Array',
  deleted: 'Array',
});
