import { database } from '@/db';
import { synchronize } from '@nozbe/watermelondb/sync';

import { pullChangesApi } from './api/pull-changes.api';

export async function syncDatabase() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      console.log('[Sync] Requesting changes since:', lastPulledAt);

      const { changes, timestamp } = await pullChangesApi({ lastPulledAt });

      const updatedChanges = {
        users: {
          created: changes.users.created.map((user) => ({
            id: user.id,
            username: user.username,
            name: user.name,
            created_at: new Date(user.createdAt).getTime(),
            updated_at: new Date(user.updatedAt).getTime(),
          })),
          updated: [],
          deleted: [],
        },
        conversations: {
          created: changes.conversations.created.map((conversation) => ({
            id: conversation._id,
            contact: conversation.participants[1],
            created_at: new Date(conversation.createdAt).getTime(),
            updated_at: new Date(conversation.updatedAt).getTime(),
            user_id: conversation.participants[1],
          })),
          updated: [],
          deleted: [],
        },
        direct_chats: {
          created: [],
          deleted: [],
          updated: [],
        },
      };

      return { changes: updatedChanges, timestamp };
    },
  });
}
