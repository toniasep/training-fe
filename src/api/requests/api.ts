import { apiClient } from '@/lib/api-client';
import type { TRequest } from '@/api/requests/type';

export const getRequests = (searchQuery: string): Promise<TRequest[]> => {
  return apiClient.get<TRequest[]>('/requests', { params: { search: searchQuery } });
};

export const getRequestById = (id: string): Promise<TRequest> => {
  return apiClient.get<TRequest>(`/requests/${id}`);
};

export const updateRequest = (id: string, updatedFields: Partial<TRequest>): Promise<TRequest> => {
  return apiClient.put<TRequest>(`/requests/${id}`, updatedFields);
};
