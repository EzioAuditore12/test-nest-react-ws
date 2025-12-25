import { authenticatedTypedFetch } from '@/lib/auth.api';

import { CreateChatParam } from '../schemas/create-chat/create-chat-param.schema';
import { createChatResponseSchema } from '../schemas/create-chat/create-chat-response.schema';

export const createChatApi = async (data: CreateChatParam) => {
  return await authenticatedTypedFetch({
    url: `chat`,
    method: 'POST',
    body: data,
    schema: createChatResponseSchema,
  });
};
