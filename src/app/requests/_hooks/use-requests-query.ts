import { useQuery } from '@tanstack/react-query';
import { getRequests } from '@/api/requests';
import type { TRequest } from '@/api/requests/types';
import type { ListQuery } from '@/types/query';
import { requestQueryKeys } from './query-keys';

export const useRequestsQuery = (query?: ListQuery) => {
  return useQuery<TRequest[], Error>({
    queryKey: requestQueryKeys.list(query),
    queryFn: () => getRequests(query),
  });
};
