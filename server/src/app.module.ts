import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import Expo from 'expo-server-sdk';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { typeOrmConfig } from './configs/db/typeorm.config';
import { mongooseConfig } from './configs/db/mongoose.config';
import { ChatModule } from './chat/chat.module';
import { bullMQConfig } from './configs/bull-mq.config';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(mongooseConfig.uri!),
    BullModule.forRoot(bullMQConfig),
    UserModule,
    AuthModule,
    ChatModule,
    SyncModule,
  ],
  controllers: [AppController],
  providers: [AppService, Expo],
})
export class AppModule {}
