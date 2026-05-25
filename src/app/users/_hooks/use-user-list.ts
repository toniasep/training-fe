import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/users/api';
import type { TUser } from '@/api/users/type';
import type { UserListQuery } from '../_types/user-list-query';
import { userQueryKeys } from './query-keys';

export const useUserList = (query?: UserListQuery) => {
  return useQuery<TUser[], Error>({
    queryKey: userQueryKeys.list(query),
    queryFn: () => getUsers(query),
  });
};
