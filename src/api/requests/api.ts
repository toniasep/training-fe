import { apiClient } from '@/lib/api-client';
import type { TRequest } from '@/api/requests/type';

export const getRequests = (searchQuery: string): Promise<TRequest[]> => {
  return apiClient.get<TRequest[]>('/requests', { params: { search: searchQuery } });
};

export const getRequestById = (id: string): Promise<TRequest> => {
  return apiClient.get<TRequest>(`/requests/${id}`);
};
