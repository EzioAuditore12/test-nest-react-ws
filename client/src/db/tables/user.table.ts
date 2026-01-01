import { tableSchema } from '@nozbe/watermelondb';

import type { BaseChange, ChangesSchema } from '../types';

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

type User = {
  id: string;
  username: string;
  name: string;
  created_at: number;
  updated_at: number;
} & BaseChange;

export type UserChangeSchema = ChangesSchema<'users', User>;
