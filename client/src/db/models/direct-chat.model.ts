import { Model } from '@nozbe/watermelondb';
import { date, field, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

import { DIRECT_CHAT_TABLE_NAME } from '../tables/direct-chat.table';

import { CONVERSATION_TABLE_NAME } from '../tables/conversation.table';
import { Conversation } from './conversation.model';

export class DirectChat extends Model {
  static table = DIRECT_CHAT_TABLE_NAME;

  static associations: Associations = {
    [CONVERSATION_TABLE_NAME]: { type: 'belongs_to', key: 'conversation_id' },
  };

  @relation(CONVERSATION_TABLE_NAME, 'conversation_id')
  conversation!: Promise<Conversation>;

  @text('text')
  text!: string;

  @text('mode')
  mode!: 'SENT' | 'RECEIVED';

  @field('is_delivered')
  isDelivered!: boolean;

  @field('is_seen')
  isSeen!: boolean;

  @date('created_at')
  createdAt!: Date;

  @date('updated_at')
  updatedAt!: Date;
}
