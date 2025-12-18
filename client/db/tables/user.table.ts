import { tableSchema } from '@nozbe/watermelondb';

export const USER_TABLE_NAME = 'users';

export const UserTable = tableSchema({
  name: USER_TABLE_NAME,
  columns: [
    { name: 'first_name', type: 'string' },
    { name: 'middle_name', type: 'string', isOptional: true },
    { name: 'last_name', type: 'string' },
    { name: 'phone_number', type: 'string', isIndexed: true },
    { name: 'email', type: 'string', isOptional: true },
    { name: 'avatar', type: 'string', isOptional: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});
