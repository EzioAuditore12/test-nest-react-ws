import { tableSchema } from '@nozbe/watermelondb';

export const CONVERSATION_TABLE_NAME = 'conversations';

export const ConversationTable = tableSchema({
  name: CONVERSATION_TABLE_NAME,
  columns: [
    { name: 'contact', type: 'string' },
    { name: 'user_id', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
