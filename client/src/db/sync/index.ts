import { database } from '@/db';
import { synchronize } from '@nozbe/watermelondb/sync';
import { Q } from '@nozbe/watermelondb';

import { pullChangesApi } from './api/pull-changes.api';

export async function syncDatabase() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      console.log('[Sync] Requesting changes since:', lastPulledAt);

      const { changes, timestamp } = await pullChangesApi({ lastPulledAt });

      // --- FIX: Resolve Optimistic Creation Conflicts ---
      // Helper to check if "created" items already exist locally.
      // If they do, treat them as "updates" to avoid "Record already exists" error.
      const resolveConflicts = async (
        tableName: string,
        createdItems: any[],
        updatedItems: any[]
      ) => {
        // Ensure updatedItems is an array
        const safeUpdatedItems = updatedItems || [];

        if (!createdItems || createdItems.length === 0) {
          return { created: [], updated: safeUpdatedItems };
        }

        const idsToCheck = createdItems.map((i: any) => i.id);
        const existingRecords = await database
          .get(tableName)
          .query(Q.where('id', Q.oneOf(idsToCheck)))
          .fetch();

        const existingIds = new Set(existingRecords.map((r) => r.id));
        const finalCreated = [];

        // Start with the server's updated list
        const finalUpdated = [...safeUpdatedItems];

        // Create a Set of IDs currently in the update list to prevent duplicates
        const updatedIds = new Set(safeUpdatedItems.map((u: any) => u.id));

        for (const item of createdItems) {
          if (existingIds.has(item.id)) {
            // Record exists locally (Optimistic UI).
            // We must treat this 'created' item as an 'update'.

            // CHECK: Only add if it's not ALREADY in the updated list
            if (!updatedIds.has(item.id)) {
              finalUpdated.push(item);
              updatedIds.add(item.id);
            }
          } else {
            // Record is genuinely new to this device
            finalCreated.push(item);
          }
        }

        return { created: finalCreated, updated: finalUpdated };
      };

      // Apply fix to conversations
      const safeConversations = await resolveConflicts(
        'conversations',
        changes.conversations.created,
        changes.conversations.updated
      );

      // Apply fix to users (good practice to handle this too)
      const safeUsers = await resolveConflicts(
        'users',
        changes.users.created,
        changes.users.updated
      );
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
