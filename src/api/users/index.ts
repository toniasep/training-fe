import { apiClient } from '@/libs/api-client';
import type { TUser, TCreateUserRequest, TUpdateUserRequest } from '@/api/users/types';
import type { UserListQuery } from '@/app/users/_types/user-list-query';

export const getUsers = (
  query?: UserListQuery & { sortBy?: string; sortOrder?: string }
): Promise<{ data: TUser[]; total: number }> => {
  return apiClient.get<{ data: TUser[]; total: number }>('/users', {
    params: {
      search: query?.search,
      role: query?.role,
      status: query?.status,
      page: query?.page,
      pageSize: query?.limit,
      sortBy: query?.sortBy,
      sortOrder: query?.sortOrder,
    },
  });
};

export const getUserById = (id: string): Promise<TUser> => {
  return apiClient.get<TUser>(`/users/${id}`);
};

export const createUser = (user: TCreateUserRequest): Promise<TUser> => {
  return apiClient.post<TUser>('/users', user);
};

export const updateUser = (id: string, updatedFields: TUpdateUserRequest): Promise<TUser> => {
  return apiClient.patch<TUser>(`/users/${id}`, updatedFields);
};

export const updateUserStatus = (id: string, status: TUser['status']): Promise<TUser> => {
  return apiClient.patch<TUser>(`/users/${id}/status`, { status });
};

