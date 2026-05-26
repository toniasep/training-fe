import type { UserListQuery } from '../_types/user-list-query';

export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (query?: UserListQuery) => [...userQueryKeys.lists(), query] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id?: string) => [...userQueryKeys.details(), id] as const,
};
