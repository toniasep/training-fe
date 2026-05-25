import { useQuery } from '@tanstack/react-query';
import { getRequestById } from '@/api/requests/api';
import type { TRequest } from '@/api/requests/type';
import { requestQueryKeys } from './query-keys';

export const useRequestDetail = (id?: string) => {
  return useQuery<TRequest, Error>({
    queryKey: requestQueryKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error('Request ID is required');
      return getRequestById(id);
    },
    enabled: !!id,
  });
};
