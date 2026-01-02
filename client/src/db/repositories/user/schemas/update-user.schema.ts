import { createUserParamSchema } from './create-user.schema';

export const updateUserSchema = createUserParamSchema.omit('id').partial();

export type UpdateUser = typeof updateUserSchema.infer;
