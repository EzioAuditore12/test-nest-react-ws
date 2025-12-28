import { type } from 'arktype';

export const loginParamSchema = type({
  username: '0 < string <= 50',
  password: '0 < string <= 16',
  expoPushToken: 'string?'
});

export type LoginParam = typeof loginParamSchema.infer;
