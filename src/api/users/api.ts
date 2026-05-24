import { apiClient } from '@/lib/api-client';
import type { TUser, TCreateUserRequest, TUpdateUserRequest } from '@/api/users/type';

export const getUsers = (searchQuery: string): Promise<TUser[]> => {
  return apiClient.get<TUser[]>('/users', { params: { search: searchQuery } });
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
