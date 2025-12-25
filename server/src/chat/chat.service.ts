import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose'; // Import Types
import { plainToInstance } from 'class-transformer';

import { Chat, ChatDocument } from './entities/chat.entity';

import { ChatDto } from './dto/chat.dto';

import { CreateChatDto } from './dto/create-chat.dto';

import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<ChatDocument>,
    private readonly userService: UserService,
  ) {}

  async create(senderId: string, createChatDto: CreateChatDto) {
    const { receiverId, text } = createChatDto;

    const existingUser = await this.userService.findOne(receiverId);

    if (!existingUser)
      throw new NotFoundException('User with this id does not exist');

    // 1. Try to find an existing conversation ID
    let conversationId = await this.findConversationId(senderId, receiverId);

    // 2. If no conversation exists, generate a new ID
    if (!conversationId) {
      conversationId = new Types.ObjectId();
    }

    // 3. Create the message using the determined conversationId
    const createdMessage = await this.chatModel.create({
      senderId,
      receiverId,
      text,
      conversationId,
    });

    Logger.log(createdMessage);

    return createdMessage;
  }

  async findConversationId(
    senderId: string,
    receiverId: string,
  ): Promise<Types.ObjectId | null> {
    const chat = await this.chatModel
      .findOne({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
        conversationId: { $exists: true, $ne: null },
      })
      .sort({ createdAt: -1 }) // Fix: Always look at the most recent message
      .lean();

    Logger.log(chat?.conversationId);

    return chat ? chat.conversationId : null;
  }

  async findBetween(senderId: string, receiverId: string) {
    const foundChat = await this.chatModel.findOne({
      senderId,
      receiverId,
    });

    if (!foundChat) return null;

    return plainToInstance(ChatDto, foundChat, {
      excludeExtraneousValues: true,
    });
  }
}
