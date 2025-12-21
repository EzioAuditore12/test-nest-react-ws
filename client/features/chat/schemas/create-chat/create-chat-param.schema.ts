import { type } from 'arktype';

export const createChatParamSchema = type({
  senderId: 'string.uuid',
  receiverId: 'string.uuid',
  text: '0 < string <= 1000',
});

export type CreateChatParam = typeof createChatParamSchema.infer;
