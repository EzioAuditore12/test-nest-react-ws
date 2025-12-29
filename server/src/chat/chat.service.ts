import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import Expo from 'expo-server-sdk';

import { Chat, ChatDocument } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserService } from 'src/user/user.service';
import { InsertChatDto } from './dto/insert-chat.dto';
import {
  Conversation,
  ConversationDocument,
} from './entities/conversation.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(Chat.name)
    private readonly chatModel: Model<ChatDocument>,
    private readonly userService: UserService,
    private readonly expo: Expo,
  ) {}

  async create(senderId: string, createChatDto: CreateChatDto) {
    const { receiverId, text } = createChatDto;

    const existingUser = await this.userService.findOne(receiverId);
    if (!existingUser)
      throw new NotFoundException('User with this id does not exist');

    let conversation = await this.conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await this.conversationModel.create({
        participants: [senderId, receiverId],
      });
    }

    // 2. Create Message linked to Conversation
    const createdMessage = await this.chatModel.create({
      senderId,
      text,
      conversationId: conversation._id,
    });

    // Optional: Update last message in conversation for "Inbox" preview
    await this.conversationModel.findByIdAndUpdate(conversation._id, {
      lastMessage: text,
    });

    Logger.log(createdMessage);
    return createdMessage;
  }

  async insertChat(senderId: string, insertChatDto: InsertChatDto) {
    const { conversationId, text } = insertChatDto;

    // 1. Verify Conversation exists
    const conversation = await this.conversationModel.findById(conversationId);

    if (!conversation)
      throw new NotFoundException('No such conversation found');

    // 2. Create Message
    const insertedMessage = await this.chatModel.create({
      senderId,
      text,
      conversationId: conversation._id,
    });

    // Optional: Update last message
    await this.conversationModel.findByIdAndUpdate(conversation._id, {
      lastMessage: text,
    });

    Logger.log(insertedMessage);
    return insertedMessage;
  }

  async findConversationId(
    senderId: string,
    receiverId: string,
  ): Promise<Types.ObjectId | null> {
    // Much faster: Query the Conversation collection directly
    const conversation = await this.conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    return conversation ? conversation._id : null;
  }
}
