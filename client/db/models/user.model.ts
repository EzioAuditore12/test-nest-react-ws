import { Model } from '@nozbe/watermelondb';
import { date, text } from '@nozbe/watermelondb/decorators';

import { USER_TABLE_NAME } from '../tables/user.table';

export class User extends Model {
  static table = USER_TABLE_NAME;

  @text('first_name')
  firstName!: string;

  @text('middle_name')
  middleName!: string | null;

  @text('last_name')
  lastName!: string;

  @text('phone_number')
  phoneNumer!: string;

  @text('email')
  email!: string | null;

  @text('avatar')
  avatar!: string | null;

  @date('updated_at')
  createdAt!: Date;

  @date('updated_at')
  updatedAt!: Date;
}
