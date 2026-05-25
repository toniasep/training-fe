import type { ListQuery } from '@/types/query';

export type UserListQuery = ListQuery & {
    role?: string;
    status?: string;
};