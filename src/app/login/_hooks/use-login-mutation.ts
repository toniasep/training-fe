import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '@/api/auth';
import type { TLoginRequest, TLoginResponse } from '@/api/auth/types';
import { useAuth } from '@/app/_components/auth-context';
import { ApiError } from '@/libs/api-client';

export const useLoginMutation = () => {
  const { login } = useAuth();

  return useMutation<TLoginResponse, ApiError, TLoginRequest>({
    mutationFn: loginApi,
    onSuccess: (response) => {
      // Save credentials to localStorage and update QueryClient cache
      login(response.token, response.user);
    },
  });
};
