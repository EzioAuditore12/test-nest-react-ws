import { env } from '@/env';

import { typedFetch } from '@/lib/fetch';

import { CreateChatParam } from '../schemas/create-chat/create-chat-param.schema';
import { createChatResponseSchema } from '../schemas/create-chat/create-chat-response.schema';

export const createChatApi = async (data: CreateChatParam) => {
  return await typedFetch({
    url: `${env.API_URL}/chat`,
    method: 'POST',
    body: data,
    schema: createChatResponseSchema,
  });
};
