import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/api/users/api';
import type { TUser } from '@/api/users/type';
import { userQueryKeys } from './query-keys';

export const useUserDetail = (id?: string) => {
  return useQuery<TUser, Error>({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error('User ID is required');
      return getUserById(id);
    },
    enabled: !!id,
  });
};
