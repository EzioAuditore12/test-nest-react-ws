import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/user/entities/user.entity';
import { BlackListedRefreshToken } from './entities/blacklist-refresh-token.entity';

import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './configs/jwt.config';
import { ConfigModule } from '@nestjs/config';
import refreshJwtConfig from './configs/refresh-jwt.config';
import { JwtStrategy } from './stratergies/jwt.stratergy';
import { RefreshJwtStrategy } from './stratergies/refresh-jwt.stratergy';
import { WsJwtStrategy } from './stratergies/ws-jwt.stratergy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BlackListedRefreshToken]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    RefreshJwtStrategy,
    WsJwtStrategy,
  ],
})
export class AuthModule {}
