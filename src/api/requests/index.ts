import { apiClient } from '@/libs/api-client';
import type { TRequest } from '@/api/requests/types';
import type { ListQuery } from '@/types/query';

export const getRequests = (query?: ListQuery): Promise<TRequest[]> => {
  return apiClient.get<TRequest[]>('/requests', { params: { search: query?.search } });
};

export const getRequestById = (id: string): Promise<TRequest> => {
  return apiClient.get<TRequest>(`/requests/${id}`);
};

export const updateRequest = (id: string, updatedFields: Partial<TRequest>): Promise<TRequest> => {
  return apiClient.put<TRequest>(`/requests/${id}`, updatedFields);
};
