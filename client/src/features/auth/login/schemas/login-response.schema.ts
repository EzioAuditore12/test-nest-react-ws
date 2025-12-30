import { type } from 'arktype';

import { userSchema } from '../../common/schemas/user.schema';
import { tokensSchema } from '../../common/schemas/tokens.schema';

export const loginResponseSchema = type({
  success: 'boolean',
  user: userSchema,
  tokens: tokensSchema,
});

export type LoginResponse = typeof loginResponseSchema.infer;
