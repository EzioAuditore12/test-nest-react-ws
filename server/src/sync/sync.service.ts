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
import { PushChangesDto } from './dto/push-changes/push-changes.dto';
import { SyncConversationDto } from './dto/sync-conversations.dto';

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

    // Update this query to select participants as well
    const allUserConversations = await this.conversationModel
      .find({ participants: userId })
      .select('_id participants');

    // Collect all unique contact IDs from all conversations
    const contactIds = new Set<string>();
    allUserConversations.forEach((c) => {
      c.participants.forEach((p) => {
        const participantId = p.toString();
        // Only add if it's not the current user
        if (participantId !== userId) {
          contactIds.add(participantId);
        }
      });
    });

    // 4. Fetch Users who have changed
    const updatedUsers = await this.userService.findUsersWithChanges(
      Array.from(contactIds),
      timestamp,
    );

    return {
      changes: {
        conversations: {
          created: updatedConversations.filter((c) => c.createdAt > timestamp),
          updated: updatedConversations.filter(
            (c) => c.createdAt <= timestamp && c.updatedAt > timestamp,
          ),
          deleted: [], // Handle deletions if necessary
        },
        users: {
          created: updatedUsers.filter((u) => u.createdAt > timestamp),
          updated: updatedUsers.filter(
            (u) => u.createdAt <= timestamp && u.updatedAt > timestamp,
          ),
          deleted: [],
        },
      },
      timestamp: Date.now(),
    };
  }

  async pushChanges(userId: string, pushChangesDto: PushChangesDto) {
    const { changes } = pushChangesDto;

    if (changes.conversations.created)
      await this.upsertConversations(userId, changes.conversations.created);

    if (changes.conversations.deleted)
      await this.deleteConversations(changes.conversations.deleted);

    await this.upsertConversations(userId, changes.conversations.created);
  }

  private async upsertConversations(
    currentUserId: string,
    conversations: SyncConversationDto[],
  ) {
    for (const conv of conversations) {
      // Map Client DTO (snake_case) to Server Entity (camelCase/Schema)
      // Client: id, user_id (the contact), created_at, updated_at
      // Server: _id, participants: [me, contact], createdAt, updatedAt

      await this.conversationModel.updateOne(
        { _id: conv.id },
        {
          $set: {
            // Ensure both participants are in the array
            participants: [currentUserId, conv.user_id],
            createdAt: new Date(conv.created_at),
            updatedAt: new Date(conv.updated_at),
          },
        },
        { upsert: true },
      );
    }
  }

  private async deleteConversations(ids: string[]) {
    if (ids.length === 0) return;
    await this.conversationModel.deleteMany({ id: { $in: ids } });
  }
}
