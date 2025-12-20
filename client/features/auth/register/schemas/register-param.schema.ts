import { strongPasswordSchema } from '@/lib/schemas';
import { type } from 'arktype';

export const registerParamSchema = type({
  username: '0 < string <= 50',
  name: '0 < string <= 50',
  password: strongPasswordSchema,
});

export type RegisterParam = typeof registerParamSchema.infer;
