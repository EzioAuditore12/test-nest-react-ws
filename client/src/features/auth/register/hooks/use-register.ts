import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/register.api';
import { useAuthStore } from '@/store/auth';
import { router } from 'expo-router';

export const useRegister = () => {
  const { setUserDetail, setTokens } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: registerApi,
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
