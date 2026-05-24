import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequests, getRequestById, updateRequest } from '@/api/requests/api';
import type { TRequest } from '@/api/requests/type';

export const useRequests = (searchQuery: string) => {
  return useQuery<TRequest[], Error>({
    queryKey: ['requests', searchQuery],
    queryFn: () => getRequests(searchQuery),
  });
};

export const useRequestDetail = (id?: string) => {
  return useQuery<TRequest, Error>({
    queryKey: ['requests', id],
    queryFn: () => {
      if (!id) throw new Error('Request ID is required');
      return getRequestById(id);
    },
    enabled: !!id,
  });
};

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<TRequest, Error, { id: string; data: Partial<TRequest> }>({
    mutationFn: ({ id, data }) => updateRequest(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific request detail cache and the list cache
      queryClient.invalidateQueries({ queryKey: ['requests', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      // Invalidate audit logs because updating request status updates generate a log entry
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
    },
  });
};
