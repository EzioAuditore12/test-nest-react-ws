import { tableSchema } from '@nozbe/watermelondb';

import type { BaseChange, ChangesSchema } from '../types';

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

type Conversation = {
  id: string;
  contact: string;
  user_id: string;
  created_at: number;
  updated_at: number;
} & BaseChange;

export type ConversationChangeSchema = ChangesSchema<'conversations', Conversation>;
