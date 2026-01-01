import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import Expo from 'expo-server-sdk';
import { BullModule } from '@nestjs/bullmq';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import jwtConfig from 'src/auth/configs/jwt.config';
import { DirectChatGateway } from './direct-chat.gateway';

import { DirectChat, DirectChatSchema } from './entities/direct-chat.entity';
import {
  Conversation,
  ConversationSchema,
} from './entities/conversation.entity';
import {
  SEND_NOTIFICATION_QUEUE_NAME,
  SendNotificationQueue,
} from './workers/send-notification.worker';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DirectChat.name, schema: DirectChatSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    BullModule.registerQueue({ name: SEND_NOTIFICATION_QUEUE_NAME }),
  ],
  controllers: [ChatController],
  providers: [
    DirectChatGateway,
    ChatService,
    UserService,
    Expo,
    SendNotificationQueue,
  ],
})
export class ChatModule {}
