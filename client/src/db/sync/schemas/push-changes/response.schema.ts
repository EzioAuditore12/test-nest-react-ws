import { type } from 'arktype';

export const pushChangesResponseSchema = type({
  status: 'string',
  message: 'string',
});
