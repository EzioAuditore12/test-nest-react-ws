import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from 'src/chat/entities/conversation.entity';
import {
  DirectChat,
  DirectChatDocument,
} from 'src/chat/entities/direct-chat.entity';

import { UserService } from 'src/user/user.service';
import { PullChangesResponseDto } from './dto/pull-changes/pull-changes-response.dto';

@Injectable()
export class SyncService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(DirectChat.name)
    private readonly directChatModel: Model<DirectChatDocument>,
    private readonly userService: UserService,
  ) {}

  async pullChanges(userId: string, lastPulledAt: number) {
    const timestamp = new Date(lastPulledAt);

    const updatedConversations = await this.conversationModel.find({
      participants: userId, // MongoDB will match if userId is in the array
      updatedAt: { $gt: timestamp },
    });

    // Efficiently get all unique participants from conversations involving the user
    const allParticipants = await this.conversationModel.distinct(
      'participants',
      {
        participants: userId,
      },
    );

    // Filter out the current user's ID to get only contacts
    const contactIds = allParticipants
      .map((p) => p.toString())
      .filter((pId) => pId !== userId);

    // 4. Fetch Users who have changed
    const updatedUsers = await this.userService.findUsersWithChanges(
      Array.from(contactIds),
      timestamp,
    );

    return {
      changes: {
        conversations: {
          created: updatedConversations
            .filter((c) => c.createdAt > timestamp)
            .map((c) => {
              return {
                id: c._id.toString(),
                contact: c.participants[1],
                user_id: c.participants[1],
                updated_at: new Date(c.updatedAt).getTime(),
                created_at: new Date(c.createdAt).getTime(),
              };
            }),
          updated: updatedConversations
            .filter((c) => c.createdAt <= timestamp && c.updatedAt > timestamp)
            .map((c) => {
              const contactId = c.participants.find((p) => p !== userId) || '';
              return {
                id: c._id.toString(),
                contact: contactId,
                user_id: contactId,
                updated_at: new Date(c.updatedAt).getTime(),
                created_at: new Date(c.createdAt).getTime(),
              };
            }),
          deleted: [],
        },
        users: {
          created: updatedUsers
            .filter((u) => u.createdAt > timestamp)
            .map((u) => {
              return {
                id: u.id,
                name: u.name,
                username: u.username,
                created_at: new Date(u.createdAt).getTime(),
                updated_at: new Date(u.updatedAt).getTime(),
              };
            }),
          updated: updatedUsers
            .filter((u) => u.createdAt <= timestamp && u.updatedAt > timestamp)
            .map((u) => {
              return {
                id: u.id,
                name: u.name,
                username: u.username,
                created_at: new Date(u.createdAt).getTime(),
                updated_at: new Date(u.updatedAt).getTime(),
              };
            }),
          deleted: [],
        },
      },
      timestamp: Date.now(),
    };
  }
}
