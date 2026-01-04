import { Q } from '@nozbe/watermelondb';

import { database } from '@/db';

import { Conversation } from '@/db/models/conversation.model';
import { CONVERSATION_TABLE_NAME } from '@/db/tables/conversation.table';

import type { CreateConversationParam } from './schemas/create-conversation.schema';
import { UpdateConversationParam } from './schemas/update-conversation.schema';

export class ConversationRepository {
  async create(data: CreateConversationParam) {
    return await database.write(async () => {
      return await database.get<Conversation>(CONVERSATION_TABLE_NAME).create((conversation) => {
        conversation._raw.id = data.id;
        conversation.contact = data.contact;
        conversation.lastMessage = data.lastMessage;
        conversation._setRaw('user_id', data.userId);
        conversation.createdAt = data.createdAt;
        conversation.updatedAt = data.updatedAt;
      });
    });
  }

  async update(id: string, data: UpdateConversationParam) {
    return await database.write(async () => {
      const record = await database.get<Conversation>(CONVERSATION_TABLE_NAME).find(id);

      await record.update(() => {
        if (data.contact !== undefined) record.contact = data.contact;
        if (data.updatedAt !== undefined) record.updatedAt = data.updatedAt;
        if (data.lastMessage !== undefined) record.lastMessage = data.lastMessage;
        if (data.createdAt !== undefined) record.createdAt = data.createdAt;
        if (data.userId !== undefined) record._setRaw('user_id', id);
      });
    });
  }

  async get() {
    return await database.get<Conversation>(CONVERSATION_TABLE_NAME).query().fetch();
  }

  async getConversationWithUserId(userId: string) {
    const conversation = await database
      .get<Conversation>(CONVERSATION_TABLE_NAME)
      .query(Q.where('user_id', userId))
      .fetch();

    return conversation[0] ?? null;
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
