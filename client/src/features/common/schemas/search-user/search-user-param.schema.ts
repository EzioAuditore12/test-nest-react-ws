import { type } from 'arktype';

export const searchUserParamSchema = type({
  search: '0 < string <= 50',
  page: 'number.integer > 0',
  limit: 'number.integer > 0',
});

export type SearchUserParam = typeof searchUserParamSchema.infer;
