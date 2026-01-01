import { useQuery } from '@tanstack/react-query';

import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

import { userProfileApi } from '../api/get-profile.api';

export const useGetProfile = () => {
  const { data, isError, error, refetch, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: userProfileApi,
  });

  useRefreshOnFocus(refetch);

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
