import { authenticatedTypedFetch } from '@/lib/auth.api';

import { PullChangesQueryParam } from '../schemas/pull-changes/query-params.schema';
import { pullChangesResponseSchema } from '../schemas/pull-changes/response.schema';

export const pullChangesApi = async (data: PullChangesQueryParam) => {
  if (data.lastPulledAt === null) data.lastPulledAt = 0;

  try {
    const response = await authenticatedTypedFetch({
      url: 'sync/pull',
      method: 'GET',
      params: data,
      schema: pullChangesResponseSchema,
    });

    console.log(response.changes.conversations.created);

    console.log(response.changes.conversations.updated);
    return response;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(String(error));
  }
};
