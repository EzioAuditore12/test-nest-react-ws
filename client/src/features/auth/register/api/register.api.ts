import { env } from '@/env';

import { typedFetch } from '@/lib/fetch';

import { RegisterParam } from '../schemas/register-param.schema';
import { registerResponseSchema } from '../schemas/register-response.schema';

export const registerApi = async (data: RegisterParam) => {
  return await typedFetch({
    url: `${env.API_URL}/auth/register`,
    method: 'POST',
    body: data,
    schema: registerResponseSchema,
  });
};
