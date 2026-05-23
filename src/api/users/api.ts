import { apiClient } from '../../lib/api-client';
import type { TUser } from './type';

export const getUser = (searchQuery: string): Promise<TUser[]> => {
  return apiClient.get<TUser[]>('/users', { params: { search: searchQuery } });
};

export const getUserById = (id: string): Promise<TUser> => {
  return apiClient.get<TUser>(`/users/${id}`);
};

export const createUser = (user: Omit<TUser, 'id'>): Promise<TUser> => {
  return apiClient.post<TUser>('/users', user);
};

export const updateUser = (id: string, updatedFields: Partial<Omit<TUser, 'id'>>): Promise<TUser> => {
  return apiClient.put<TUser>(`/users/${id}`, updatedFields);
};
