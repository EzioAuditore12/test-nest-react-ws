import { database } from '@/db';

import { User } from '@/db/models/user.model';
import { USER_TABLE_NAME } from '@/db/tables/user.table';

import type { CreateUserParam } from './schemas/create-user.schema';
import type { UpdateUser } from './schemas/update-user.schema';

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

  async update(id: string, data: UpdateUser) {
    return await database.write(async () => {
      const record = await database.get<User>(USER_TABLE_NAME).find(id);

      await record.update((user) => {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            (user as any)[key] = value;
          }
        });
      });
    });
  }

  async findAll() {
    return await database.get<User>(USER_TABLE_NAME).query().fetch();
  }

  async findById(id: string) {
    try {
      return await database.get<User>(USER_TABLE_NAME).find(id);
    } catch {
      return null;
    }
  }
}
