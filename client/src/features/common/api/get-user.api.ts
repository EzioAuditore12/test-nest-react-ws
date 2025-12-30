import { env } from '@/env';

import { typedFetch } from '@/lib/fetch';

import { userSchema } from '@/features/auth/common/schemas/user.schema';

export const getUserApi = async (id: string) => {
  return typedFetch({
    url: `${env.API_URL}/user/${id}`,
    method: 'GET',
    schema: userSchema,
  });
};
