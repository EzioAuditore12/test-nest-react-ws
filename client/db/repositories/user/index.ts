import { database } from '@/db';

import { User } from '@/db/models/user.model';
import { USER_TABLE_NAME } from '@/db/tables/user.table';

import type { CreateUserParam } from './schemas/create-user.schema';

export class UserRepository {
  async create(data: CreateUserParam) {
    return await database.write(async () => {
      return await database.get<User>(USER_TABLE_NAME).create((user) => {
        user._raw.id = data.id;
        user.name = data.name;
        user.username = data.username;
        user.createdAt = data.createdAt;
        user.updatedAt = data.updatedAt;
      });
    });
  }

  async findAll() {
    return await database.get<User>(USER_TABLE_NAME).query().fetch();
  }

  async findById(id: string) {
    return await database.get<User>(USER_TABLE_NAME).find(id);
  }
}
