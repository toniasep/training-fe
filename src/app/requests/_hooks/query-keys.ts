import type { ListQuery } from '@/types/query';

export const requestQueryKeys = {
  all: ['requests'] as const,
  lists: () => [...requestQueryKeys.all, 'list'] as const,
  list: (query?: ListQuery) => [...requestQueryKeys.lists(), query] as const,
  details: () => [...requestQueryKeys.all, 'detail'] as const,
  detail: (id?: string) => [...requestQueryKeys.details(), id] as const,
};
