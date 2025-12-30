import { type } from 'arktype';

import { userSchema } from '../../common/schemas/user.schema';
import { tokensSchema } from '../../common/schemas/tokens.schema';

export const registerResponseSchema = type({
  success: 'boolean',
  user: userSchema,
  tokens: tokensSchema,
});

export type RegisterResponse = typeof registerResponseSchema.infer;
