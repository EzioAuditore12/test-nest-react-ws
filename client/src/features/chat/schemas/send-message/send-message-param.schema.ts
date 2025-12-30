import { type } from 'arktype';

export const sendMessageParamSchema = type({
  text: '0 < string <= 1000',
});

export type SendMessageParam = typeof sendMessageParamSchema.infer;
