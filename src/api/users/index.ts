import { apiClient } from '@/libs/api-client';
import type { TUser, TCreateUserRequest, TUpdateUserRequest } from '@/api/users/types';
import type { UserListQuery } from '@/app/users/_types/user-list-query';

export const getUsers = (query?: UserListQuery): Promise<TUser[]> => {
  return apiClient.get<TUser[]>('/users', { params: { search: query?.search } });
};

export const getUserById = (id: string): Promise<TUser> => {
  return apiClient.get<TUser>(`/users/${id}`);
};

export const createUser = (user: TCreateUserRequest): Promise<TUser> => {
  return apiClient.post<TUser>('/users', user);
};

export const updateUser = (id: string, updatedFields: TUpdateUserRequest): Promise<TUser> => {
  return apiClient.put<TUser>(`/users/${id}`, updatedFields);
};
