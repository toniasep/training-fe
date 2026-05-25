import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/api/users';
import type { TUser, TUpdateUserRequest } from '@/api/users/types';
import { userQueryKeys } from './query-keys';

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TUser, Error, { id: string; data: TUpdateUserRequest }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific user cache and the list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      // Invalidate audit logs because user update generates a log
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};
