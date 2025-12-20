import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import type { ConfigType } from '@nestjs/config';
import { hash, verify } from '@node-rs/argon2';

import refreshJwtConfig from './configs/refresh-jwt.config';

import { AuthJwtPayload } from './types/auth-jwt.payload';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register-user/register-user.dto';

import { LoginUserDto } from './dto/login-user/login-user.dto';
import { User } from 'src/user/entities/user.entity';

import { BlackListedRefreshToken } from './entities/blacklist-refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSerice: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private readonly refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @InjectRepository(BlackListedRefreshToken)
    private readonly blackListedRefreshTokenRepo: Repository<BlackListedRefreshToken>,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { username, password } = registerUserDto;

    const existingUser = await this.userSerice.findOneByUserName(username);

    if (existingUser)
      throw new ConflictException('User with this username already exists');

    const hashedPassword = await hash(password);

    const createdUser = await this.userSerice.create({
      name: registerUserDto.name,
      username: registerUserDto.username,
      password: hashedPassword,
    });

    return plainToInstance(User, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.userSerice.findOneByUserName(username);

    if (!user)
      throw new NotFoundException('User with this username does not exist');

    const verifyPassword = await verify(user.password, password);

    if (!verifyPassword)
      throw new UnauthorizedException(
        'Either entered username or passsword is wrong',
      );

    return plainToInstance(User, user, {
      excludeExtraneousValues: true,
    });
  }

  generateTokens(userId: string) {
    const payload: Pick<AuthJwtPayload, 'sub'> = { sub: userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    return { accessToken, refreshToken };
  }

  async insertBlackListedRefreshToken({
    refreshToken,
    issuedAt,
    expiredAt,
  }: {
    refreshToken: string;
    issuedAt: Date;
    expiredAt: Date;
  }) {
    const insertBlaclistedToken = this.blackListedRefreshTokenRepo.create({
      refreshToken,
      createdAt: issuedAt,
      expiredAt,
    });
    await this.blackListedRefreshTokenRepo.save(insertBlaclistedToken);
  }

  async findBlackListedRefreshToken(refreshToken: string) {
    return this.blackListedRefreshTokenRepo.findOne({
      where: { refreshToken },
    });
  }

  async refreshTokens({
    userId,
    expiredAt,
    createdAt,
    refreshToken,
  }: {
    userId: string;
    refreshToken: string;
    createdAt: Date;
    expiredAt: Date;
  }) {
    await this.insertBlackListedRefreshToken({
      refreshToken,
      issuedAt: createdAt,
      expiredAt,
    });

    return this.generateTokens(userId);
  }
}
