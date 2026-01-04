import { database } from '@/db';
import { synchronize } from '@nozbe/watermelondb/sync';

import { pullChangesApi } from './api/pull-changes.api';

import { resolveConflicts } from './resolve-conflict';

export async function syncDatabase() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      console.log('[Sync] Requesting changes since:', lastPulledAt);

      const { changes, timestamp } = await pullChangesApi({ lastPulledAt });

      // Apply fix to conversations
      const safeConversations = await resolveConflicts({
        database,
        tableName: 'conversations',
        createdItems: changes.conversations.created,
        updatedItems: changes.conversations.updated,
      });

      // Apply fix to users (good practice to handle this too)
      const safeUsers = await resolveConflicts({
        database,
        tableName: 'users',
        createdItems: changes.users.created,
        updatedItems: changes.users.updated,
      });
      // --------------------------------------------------

      const updatedChanges = {
        users: {
          created: safeUsers.created,
          updated: safeUsers.updated,
          deleted: changes.users.deleted,
        },
        conversations: {
          created: safeConversations.created,
          updated: safeConversations.updated,
          deleted: changes.conversations.deleted,
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
