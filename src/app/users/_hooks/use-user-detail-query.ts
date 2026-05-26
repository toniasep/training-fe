import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/api/users';
import type { TUser } from '@/api/users/types';
import { userQueryKeys } from '../_const/query-keys';

export const useUserDetailQuery = (id?: string) => {
  return useQuery<TUser, Error>({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error('User ID is required');
      return getUserById(id);
    },
    enabled: !!id,
  });
};
