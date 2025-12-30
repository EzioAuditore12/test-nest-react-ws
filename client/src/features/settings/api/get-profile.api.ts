import { authenticatedTypedFetch } from '@/lib/auth.api';

import { userProfileResponseSchema } from '../schemas/user-profile-response.schema';

export const userProfileApi = async () => {
  return await authenticatedTypedFetch({
    url: 'user/profile',
    method: 'GET',
    schema: userProfileResponseSchema,
  });
};
