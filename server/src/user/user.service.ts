import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, PaginationType, paginate } from 'nestjs-paginate';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

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
