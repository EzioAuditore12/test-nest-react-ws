import { tokensSchema } from '../tokens.schema';

export const refreshTokensResponseSchema = tokensSchema;

export type RefreshTokensResponse = typeof tokensSchema.infer;
