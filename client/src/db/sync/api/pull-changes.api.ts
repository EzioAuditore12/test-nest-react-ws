import { authenticatedTypedFetch } from '@/lib/auth.api';

import { PullChangesQueryParam } from '../schemas/pull-changes/query-params.schema';
import { pullChangesResponseSchema } from '../schemas/pull-changes/response.schema';

export const pullChangesApi = async (data: PullChangesQueryParam) => {
  if (data.lastPulledAt === null) data.lastPulledAt = 0;

  try {
    return await authenticatedTypedFetch({
      url: 'sync/pull',
      method: 'GET',
      params: data,
      schema: pullChangesResponseSchema,
    });
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(String(error));
  }
};
