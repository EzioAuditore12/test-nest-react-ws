import { tableSchema } from '@nozbe/watermelondb';

export const USER_TABLE_NAME = 'users';

export const UserTable = tableSchema({
  name: USER_TABLE_NAME,
  columns: [
    { name: 'username', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
