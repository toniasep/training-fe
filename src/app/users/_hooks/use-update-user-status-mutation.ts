import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '@/api/users';
import type { TUser, TUserStatus } from '@/api/users/types';
import { userQueryKeys } from './query-keys';

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TUser, Error, { id: string; status: TUserStatus }>({
    mutationFn: ({ id, status }) => updateUser(id, { status }),
    onSuccess: (_, variables) => {
      // Invalidate specific user cache and the list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
      // Invalidate audit logs because user status update generates a log
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};
