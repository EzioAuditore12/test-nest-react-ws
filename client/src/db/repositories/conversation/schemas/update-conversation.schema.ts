import { createConversationParamSchema } from './create-conversation.schema';

export const updateConversationParamSchema = createConversationParamSchema.omit('id').partial();

export type UpdateConversationParam = typeof updateConversationParamSchema.infer;
