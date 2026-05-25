import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/api/users/api';
import type { TUser, TCreateUserRequest } from '@/api/users/type';
import { userQueryKeys } from './query-keys';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<TUser, Error, TCreateUserRequest>({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate list of users
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      // Invalidate audit logs because user creation generates a log
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};
