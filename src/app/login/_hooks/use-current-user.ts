import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/api/auth/api';
import type { TAuthUser } from '@/api/auth/type';

export const useCurrentUserQuery = () => {
  const token = localStorage.getItem('auth_token');
  return useQuery<TAuthUser, Error>({
    queryKey: ['auth', 'current-user'],
    queryFn: getCurrentUser,
    enabled: !!token,
    staleTime: Infinity, // User info doesn't change frequently during session
    initialData: () => {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          localStorage.removeItem('auth_user');
        }
      }
      return undefined;
    },
  });
};
