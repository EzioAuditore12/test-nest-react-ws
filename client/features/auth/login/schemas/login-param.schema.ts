import { type } from 'arktype';

export const loginParamSchema = type({
  username: '0 < string <= 50',
  password: '0 < string <= 16',
});

export type LoginParam = typeof loginParamSchema.infer;
