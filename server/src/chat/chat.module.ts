import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import Expo from 'expo-server-sdk';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import jwtConfig from 'src/auth/configs/jwt.config';
import { DirectChatGateway } from './direct-chat.gateway';

import { Chat, ChatSchema } from './entities/chat.entity';
import {
  Conversation,
  ConversationSchema,
} from './entities/conversation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [ChatController],
  providers: [DirectChatGateway, ChatService, UserService, Expo],
})
export class ChatModule {}
