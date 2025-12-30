import { type } from 'arktype';

export const insertChatResponseSchema = type({
  status: "'ok'",
});

export type InsertChatResponse = typeof insertChatResponseSchema.infer;
