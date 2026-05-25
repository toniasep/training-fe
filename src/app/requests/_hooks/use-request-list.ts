import { useQuery } from '@tanstack/react-query';
import { getRequests } from '@/api/requests/api';
import type { TRequest } from '@/api/requests/type';
import type { ListQuery } from '@/types/query';
import { requestQueryKeys } from './query-keys';

export const useRequestList = (query?: ListQuery) => {
  return useQuery<TRequest[], Error>({
    queryKey: requestQueryKeys.list(query),
    queryFn: () => getRequests(query),
  });
};
