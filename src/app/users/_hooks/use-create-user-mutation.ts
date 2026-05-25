import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '@/api/users';
import type { TUser, TCreateUserRequest } from '@/api/users/types';
import { userQueryKeys } from './query-keys';

export const useCreateUserMutation = () => {
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
