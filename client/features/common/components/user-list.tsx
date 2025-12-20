import { FlashList, type FlashListProps } from '@shopify/flash-list';
import { router } from 'expo-router';

import type { User } from '../../auth/common/schemas/user.schema';
import { UserCard } from './user-card';

interface UserListProps extends Omit<
  FlashListProps<User>,
  'data' | 'children' | 'keyExtractor' | 'renderItem'
> {
  data: User[];
  isFetchingNextPage?: boolean;
}

export function UserList({ className, isFetchingNextPage, data, ...props }: UserListProps) {
  return (
    <>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserCard
            data={item}
            className="mb-3"
            onPress={() =>
              router.push({
                pathname: '/(main)/[id]',
                params: { id: item.id },
              })
            }
          />
        )}
        {...props}
      />
    </>
  );
}
