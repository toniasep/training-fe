import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRequest } from '@/api/requests/api';
import type { TRequest } from '@/api/requests/type';
import { requestQueryKeys } from './query-keys';

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<TRequest, Error, { id: string; data: Partial<TRequest> }>({
    mutationFn: ({ id, data }) => updateRequest(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific request detail cache and the list cache
      queryClient.invalidateQueries({ queryKey: requestQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: requestQueryKeys.lists() });
      // Invalidate audit logs because updating request status updates generate a log entry
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};
