import { Model } from '@nozbe/watermelondb';
import { date, text } from '@nozbe/watermelondb/decorators';

import { USER_TABLE_NAME } from '../tables/user.table';

export class User extends Model {
  static table = USER_TABLE_NAME;

  @text('name')
  name!: string;

  @text('username')
  username!: string;

  @date('updated_at')
  createdAt!: Date;

  @date('updated_at')
  updatedAt!: Date;
}
