import { tableSchema } from '@nozbe/watermelondb';

import type { BaseChange, ChangesSchema } from '../types';

export const DIRECT_CHAT_TABLE_NAME = 'direct_chats';

export const DirectChatTable = tableSchema({
  name: DIRECT_CHAT_TABLE_NAME,
  columns: [
    { name: 'conversation_id', type: 'string', isIndexed: true },
    { name: 'text', type: 'string' },
    { name: 'mode', type: 'string' },
    { name: 'is_delivered', type: 'boolean' },
    { name: 'is_seen', type: 'boolean' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

type DirectChat = {
  id: string;
  conversation_id: string;
  text: string;
  mode: 'SENT' | 'RECEIVED';
  is_delivered: boolean;
  is_seen: boolean;
  created_at: number;
  updated_at: number;
} & BaseChange;

export type DirectChatChangeSchema = ChangesSchema<'direct_chats', DirectChat>;
