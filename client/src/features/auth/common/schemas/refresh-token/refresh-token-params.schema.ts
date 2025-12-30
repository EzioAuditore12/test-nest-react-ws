import { type } from 'arktype';

import { jwtTokenSchema } from '@/lib/schemas';

export const refreshTokenParamsSchema = type({
  refreshToken: jwtTokenSchema,
});

export type RefreshTokenParams = typeof refreshTokenParamsSchema.infer;
