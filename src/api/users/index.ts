import { apiClient } from '@/libs/api-client';
import type { TUser, TCreateUserRequest, TUpdateUserRequest } from '@/api/users/types';
import type { UserListQuery } from '@/app/users/_types/user-list-query';

export const getUsers = async (
  query?: UserListQuery & { sortBy?: string; sortOrder?: string }
): Promise<{ data: TUser[]; total: number }> => {
  const res = await apiClient.get<{ data: TUser[]; total: number }>('/users', {
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
  return res.data;
};

export const getUserById = async (id: string): Promise<TUser> => {
  const res = await apiClient.get<TUser>(`/users/${id}`);
  return res.data;
};

export const createUser = async (user: TCreateUserRequest): Promise<TUser> => {
  const res = await apiClient.post<TUser>('/users', user);
  return res.data;
};

export const updateUser = async (id: string, updatedFields: TUpdateUserRequest): Promise<TUser> => {
  const res = await apiClient.patch<TUser>(`/users/${id}`, updatedFields);
  return res.data;
};

export const updateUserStatus = async (id: string, status: TUser['status']): Promise<TUser> => {
  const res = await apiClient.patch<TUser>(`/users/${id}/status`, { status });
  return res.data;
};

