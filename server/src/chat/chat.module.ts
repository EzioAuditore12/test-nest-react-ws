import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import jwtConfig from 'src/auth/configs/jwt.config';
import { DirectChatGateway } from './direct-chat.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [ChatController],
  providers: [DirectChatGateway, ChatService, UserService],
})
export class ChatModule {}
