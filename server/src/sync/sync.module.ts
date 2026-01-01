import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';

import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';

import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import {
  DirectChat,
  DirectChatSchema,
} from 'src/chat/entities/direct-chat.entity';
import {
  Conversation,
  ConversationSchema,
} from 'src/chat/entities/conversation.entity';
import { ChatService } from 'src/chat/chat.service';

import { SEND_NOTIFICATION_QUEUE_NAME } from 'src/chat/workers/send-notification.worker';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([
      { name: DirectChat.name, schema: DirectChatSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    BullModule.registerQueue({ name: SEND_NOTIFICATION_QUEUE_NAME }),
  ],
  controllers: [SyncController],
  providers: [SyncService, UserService, ChatService],
})
export class SyncModule {}
