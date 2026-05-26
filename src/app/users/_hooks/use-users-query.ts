import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/users';
import type { TUser } from '@/api/users/types';
import type { UserListQuery } from '../_types/user-list-query';
import { userQueryKeys } from './query-keys';
import { ApiError } from '@/libs/api-client';

export const useUsersQuery = (query?: UserListQuery & { sortBy?: string; sortOrder?: string }) => {
  return useQuery<{ data: TUser[]; total: number }, ApiError>({
    queryKey: userQueryKeys.list(query),
    queryFn: () => getUsers(query),
  });
};

