import { Model, Relation } from '@nozbe/watermelondb';
import { children, date, relation, text } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

import { CONVERSATION_TABLE_NAME } from '../tables/conversation.table';

import { DIRECT_CHAT_TABLE_NAME } from '../tables/direct-chat.table';

import { USER_TABLE_NAME } from '../tables/user.table';
import { User } from './user.model';

import { DirectChat } from './direct-chat.model';

export class Conversation extends Model {
  static table = CONVERSATION_TABLE_NAME;

  static associations: Associations = {
    [DIRECT_CHAT_TABLE_NAME]: {
      type: 'has_many',
      foreignKey: 'conversation_id',
    },

    [USER_TABLE_NAME]: {
      type: 'belongs_to',
      key: 'user_id',
    },
  };

  @relation(USER_TABLE_NAME, 'user_id')
  user!: Relation<User>;

  @children(DIRECT_CHAT_TABLE_NAME)
  directChats!: Promise<DirectChat[]>;

  @text('contact')
  contact!: string;

  @date('created_at')
  createdAt!: Date;

  @date('updated_at')
  updatedAt!: Date;
}
