import { userSchema } from './user.schema';

export const createUserParamSchema = userSchema;

export type CreateUserParam = typeof createUserParamSchema.infer;
