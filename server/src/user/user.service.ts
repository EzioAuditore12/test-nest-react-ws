import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { PaginateQuery, PaginationType, paginate } from 'nestjs-paginate';
import { Expo } from 'expo-server-sdk';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async findOneByUserName(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  async findUsersWithChanges(ids: string[], since: Date) {
    if (ids.length === 0) return [];

    const users = await this.userRepository.find({
      where: {
        id: In(ids),
        updatedAt: MoreThan(since),
      },
    });

    return plainToInstance(User, users, {
      excludeExtraneousValues: true,
    });
  }

  async updateExpoPushToken(userId: string, expoPushToken: string | undefined) {
    if (!Expo.isExpoPushToken(expoPushToken))
      throw new BadRequestException('Given token is invalid');

    await this.userRepository.update(userId, { expoPushToken });
  }

  async findAll(query: PaginateQuery) {
    return await paginate(query, this.userRepository, {
      sortableColumns: ['username', 'name'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['username', 'name'],
      select: ['id', 'username', 'name', 'createdAt', 'updatedAt'],
      defaultLimit: 10,
      maxLimit: 30,
      paginationType: PaginationType.LIMIT_AND_OFFSET,
    });
  }
}
