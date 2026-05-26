import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRequestStatus } from '@/api/requests';
import type { TRequest } from '@/api/requests/types';
import { requestQueryKeys } from './query-keys';

export const useUpdateRequestStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TRequest, Error, { id: string; data: Partial<TRequest> & { simulateError?: number } }>({
    mutationFn: ({ id, data }) => updateRequestStatus(id, data.status!, data.simulateError),
    onSuccess: (_, variables) => {
      // Invalidate target request and lists
      queryClient.invalidateQueries({ queryKey: requestQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: requestQueryKeys.lists() });
      // Invalidate audit logs because request status update generates a log
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};
