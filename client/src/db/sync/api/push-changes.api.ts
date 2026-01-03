import type { UserChangeSchema } from '@/db/tables/user.table';
import type { ConversationChangeSchema } from '@/db/tables/conversation.table';

import { authenticatedTypedFetch } from '@/lib/auth.api';

import { pushChangesResponseSchema } from '../schemas/push-changes/response.schema';

type PushChangeBodyParams = {
  users: UserChangeSchema['users'];
  conversations: ConversationChangeSchema['conversations'];
};

export const pushChangesApi = async ({ users, conversations }: PushChangeBodyParams) => {
  try {
    const pushChangeBody = { users, conversations };

    console.log(pushChangeBody);

    const test = await authenticatedTypedFetch({
      url: 'sync/push',
      method: 'POST',
      body: { changes: pushChangeBody },
      schema: pushChangesResponseSchema,
    });

    console.log(test);

    return test;
  } catch (error) {
    alert(error);
  }
};
