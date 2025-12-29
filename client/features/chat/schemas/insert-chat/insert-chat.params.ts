import { objectIdSchema } from '@/lib/schemas';
import { type } from 'arktype';

export const insertChatParamSchema = type({
  _id: objectIdSchema,
  text: '0 < string <= 1000',
  conversationId: objectIdSchema,
  createdAt: 'string.date.iso',
});

export type InsertChatParam = typeof insertChatParamSchema.infer;
