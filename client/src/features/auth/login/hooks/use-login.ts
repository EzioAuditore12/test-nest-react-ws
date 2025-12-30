import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/login.api';
import { useAuthStore } from '@/store/auth';
import { router } from 'expo-router';

export const useLogin = () => {
  const { setUserDetail, setTokens } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setTokens(data.tokens);

      setUserDetail(data.user);

      router.replace('/(main)');
    },
    onError: (error) => {
      alert(error);
    },
  });
};
