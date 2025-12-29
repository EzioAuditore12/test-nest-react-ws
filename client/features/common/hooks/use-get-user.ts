import { useQuery } from '@tanstack/react-query';

import { getUserApi } from '../api/get-user.api';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

export const useGetUser = (id: string) => {
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getUserApi(id),
  });

  useRefreshOnFocus(refetch);

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
