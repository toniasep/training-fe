import { useQuery } from '@tanstack/react-query';
import { getRequestById } from '@/api/requests';
import type { TRequest } from '@/api/requests/types';
import { requestQueryKeys } from './query-keys';

export const useRequestDetailQuery = (id?: string) => {
  return useQuery<TRequest, Error>({
    queryKey: requestQueryKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error('Request ID is required');
      return getRequestById(id);
    },
    enabled: !!id,
  });
};
