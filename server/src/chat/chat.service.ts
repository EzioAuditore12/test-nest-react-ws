import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
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

  async create(createChatDto: CreateChatDto): Promise<ChatDto> {
    const { receiverId, text, senderId } = createChatDto;

    const existingUser = await this.userService.findOne(receiverId);

    if (!existingUser)
      throw new NotFoundException('User with this id does not exist');

    const foundChat = await this.findBetween(senderId, receiverId);

    if (foundChat) return foundChat;

    const createdMessage = await this.chatModel.create({
      senderId,
      receiverId,
      text,
    });

    return plainToInstance(ChatDto, createdMessage, {
      excludeExtraneousValues: true,
    });
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
