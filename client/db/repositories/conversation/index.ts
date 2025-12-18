import { database } from '@/db';

import { Conversation } from '@/db/models/conversation.model';
import { CONVERSATION_TABLE_NAME } from '@/db/tables/conversation.table';

import type { CreateConversationParam } from './schemas/create-conversation.schema';

export class ConversationRepository {
  async create(data: CreateConversationParam) {
    return await database.write(async () => {
      return await database.get<Conversation>(CONVERSATION_TABLE_NAME).create((conversation) => {
        conversation.contact = data.contact;
        conversation._setRaw('user_id', data.userId);
        conversation.createdAt = new Date(data.createdAt);
        conversation.updatedAt = new Date(data.updatedAt);
      });
    });
  }

  async get() {
    return await database.get<Conversation>(CONVERSATION_TABLE_NAME).query().fetch();
  }

  async getConversationsWithUsers() {
    const conversations = await this.get();
    return Promise.all(
      conversations.map(async (conv) => ({
        ...conv,
        user: await conv.user,
      }))
    );
  }
}
