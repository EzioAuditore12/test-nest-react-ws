import { database } from '@/db';

import { DirectChat } from '@/db/models/direct-chat.model';
import { DIRECT_CHAT_TABLE_NAME } from '@/db/tables/direct-chat.table';

import { CreateDirectChatParam } from './schemas/create-direct-chat.schema';

export class DirectChatRepository {
  async create(data: CreateDirectChatParam) {
    return await database.write(async () => {
      return await database.get<DirectChat>(DIRECT_CHAT_TABLE_NAME).create((directChat) => {
        directChat._raw.id = data._id;
        directChat._setRaw('conversation_id', data.conversationId);
        directChat.text = data.text;
        directChat.mode = data.mode;
        directChat.isDelivered = data.isDelivered;
        directChat.isSeen = data.isSeen;
        directChat.createdAt = data.createdAt;
        directChat.updatedAt = data.updatedAt;
      });
    });
  }

  async get() {
    return await database.get<DirectChat>(DIRECT_CHAT_TABLE_NAME).query().fetch();
  }
}
