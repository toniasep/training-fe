import { useQuery } from '@tanstack/react-query';
import { getRequests } from '@/api/requests';
import type { TRequest } from '@/api/requests/types';
import type { ListQuery } from '@/types/query';
import { requestQueryKeys } from './query-keys';
import { ApiError } from '@/libs/api-client';

export const useRequestsQuery = (
  query?: ListQuery & { status?: string; priority?: string; sortBy?: string; sortOrder?: string }
) => {
  return useQuery<{ data: TRequest[]; total: number }, ApiError>({
    queryKey: requestQueryKeys.list(query),
    queryFn: () => getRequests(query),
  });
};

