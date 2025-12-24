import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { ConfigModule } from '@nestjs/config';

import { Chat, ChatSchema } from './entities/chat.entity';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import jwtConfig from 'src/auth/configs/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
    // Fix: Register JwtModule here so JwtService is injected with config
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [ChatController],
  // Fix: Remove JwtService from providers (it comes from JwtModule now)
  providers: [ChatGateway, ChatService, UserService],
})
export class ChatModule {}
