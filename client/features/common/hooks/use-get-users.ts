import { useInfiniteQuery } from '@tanstack/react-query';

import { getUsersApi } from '../api/get-users.api';
import type { SearchUserParam } from '../schemas/search-user/search-user-param.schema';

export function useGetUsers({ search, limit }: Omit<SearchUserParam, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['search-user', search],

    queryFn: ({ pageParam }) => getUsersApi({ search, page: pageParam, limit }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length > 0 ? allPages.length + 1 : undefined;
    },
  });
}
