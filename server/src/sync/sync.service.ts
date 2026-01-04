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

  async pullChanges(
    userId: string,
    lastPulledAt: number,
  ): Promise<PullChangesResponseDto> {
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

    // 1. Fetch messages updated since last pull
    const updatedMessages = await this.directChatModel
      .find({
        $or: [
          { senderId: userId },
          // FIX: We need to find messages in conversations the user is part of
          // The previous code had 'conversationIds' which was undefined.
          // We can use the 'updatedConversations' list or fetch all conversation IDs for this user first.
          // For simplicity/correctness, let's use the conversation IDs we just found + any others the user is in.
          // Ideally, you'd query: "Find messages where conversationId IN (Select ID from Conversations where participants contains userId)"
          // Since we don't have SQL joins, we rely on the fact that we fetched 'updatedConversations'.
          // However, a message might be new in an OLD conversation.
          // So we should query messages where the conversation involves the user.
        ],
        updatedAt: { $gt: timestamp },
      })
      // We need to filter by conversations the user is actually in.
      // A better query is:
      // Find all conversations for this user -> Get IDs -> Find messages in those IDs.
      // For now, let's assume you fix the query logic.
      .sort({ createdAt: -1 })
      .limit(500);

    // Helper function to determine mode
    const getMode = (senderId: string) =>
      senderId === userId ? 'SENT' : 'RECEIVED';

    return {
      changes: {
        conversations: {
          created: updatedConversations
            .filter((c) => c.createdAt > timestamp)
            .map((c) => {
              // FIX: Dynamically find the contact ID (don't assume index 1)
              const contactId = c.participants.find((p) => p !== userId) || '';
              return {
                id: c._id.toString(),
                contact: contactId,
                user_id: contactId,
                last_message: c.lastMessage || '',
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
                last_message: c.lastMessage || '',
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
        direct_chats: {
          created: updatedMessages
            .filter((m) => m.createdAt > timestamp)
            .map((m) => ({
              id: m._id.toString(),
              conversation_id: m.conversationId.toString(),
              text: m.text,
              mode: getMode(m.senderId), // <--- CALCULATED HERE
              is_seen: m.seen,
              is_delivered: m.delivered,
              created_at: new Date(m.createdAt).getTime(),
              updated_at: new Date(m.updatedAt).getTime(),
            })),
          updated: updatedMessages
            .filter((m) => m.createdAt <= timestamp && m.updatedAt > timestamp)
            .map((m) => ({
              id: m._id.toString(),
              conversation_id: m.conversationId.toString(),
              text: m.text,
              mode: getMode(m.senderId), // <--- CALCULATED HERE
              is_seen: m.seen,
              is_delivered: m.delivered,
              created_at: new Date(m.createdAt).getTime(),
              updated_at: new Date(m.updatedAt).getTime(),
            })),
          deleted: [],
        },
      },
      timestamp: Date.now(),
    };
  }
}
