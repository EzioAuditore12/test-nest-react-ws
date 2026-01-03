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
        users: changes.users,
        conversations: changes.conversations,
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
