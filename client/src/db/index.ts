import { Database, type TableSchema } from '@nozbe/watermelondb';

import { createAdapter } from './adapter';
import { migrations } from './migrations';
import { createSchema } from './schemas';

import { ConversationTable } from './tables/conversation.table';
import { UserTable } from './tables/user.table';
import { DirectChatTable } from './tables/direct-chat.table';

import { User } from './models/user.model';
import { Conversation } from './models/conversation.model';
import { DirectChat } from './models/direct-chat.model';

const tables: TableSchema[] = [UserTable, ConversationTable, DirectChatTable];

const models = [User, Conversation, DirectChat];

const schema = createSchema(tables);

export const database = new Database({
  adapter: createAdapter(schema, migrations),
  modelClasses: models,
});
