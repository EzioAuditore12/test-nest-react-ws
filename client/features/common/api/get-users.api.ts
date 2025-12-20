import { typedFetch } from '@/lib/fetch';

import { env } from '@/env';

import { userSearchResponseSchema } from '../schemas/search-user/search-user-response.schema';
import type { SearchUserParam } from '../schemas/search-user/search-user-param.schema';

export const getUsersApi = async (data: SearchUserParam) => {
  return typedFetch({
    url: `${env.API_URL}/user`,
    method: 'GET',
    params: data,
    schema: userSearchResponseSchema,
  });
};
