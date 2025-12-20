import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDebounce } from 'use-debounce';

import { SearchUserInput } from '@/features/common/components/search-user';
import { UserList } from '@/features/common/components/user-list';

import { useGetUsers } from '@/features/common/hooks/use-get-users';

export default function SearchScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [searchValue] = useDebounce(search, 500);

  const { data, fetchNextPage, isFetchingNextPage } = useGetUsers({
    search: searchValue,
    limit: 10,
  });

  const users = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <View style={{ marginTop: safeAreaInsets.top }} className="flex-1 p-2">
      <SearchUserInput
        placeholder="Search..."
        className="mb-5"
        value={search}
        onChangeText={setSearch}
      />

      <UserList
        data={users}
        isFetchingNextPage={isFetchingNextPage}
        onEndReached={() => fetchNextPage()}
      />
    </View>
  );
}
