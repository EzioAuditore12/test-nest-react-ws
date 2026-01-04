import { Q, Database } from '@nozbe/watermelondb';

interface ResolveConflictsProps {
  database: Database;
  tableName: string;
  createdItems: any[];
  updatedItems: any[];
}

export const resolveConflicts = async ({
  database,
  createdItems,
  tableName,
  updatedItems,
}: ResolveConflictsProps) => {
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
