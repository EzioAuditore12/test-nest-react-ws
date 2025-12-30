import { type } from 'arktype';

import { jwtTokenSchema } from '@/lib/schemas';

export const tokensSchema = type({
  accessToken: jwtTokenSchema,
  refreshToken: jwtTokenSchema,
});

export type Tokens = typeof tokensSchema.infer;
