import { apiClient } from '@/libs/api-client';
import type { TRequest } from '@/api/requests/types';
import type { ListQuery } from '@/types/query';

export const getRequests = (
  query?: ListQuery & { status?: string; priority?: string; sortBy?: string; sortOrder?: string }
): Promise<{ data: TRequest[]; total: number }> => {
  return apiClient.get<{ data: TRequest[]; total: number }>('/requests', {
    params: {
      search: query?.search,
      status: query?.status,
      priority: query?.priority,
      page: query?.page,
      pageSize: query?.limit,
      sortBy: query?.sortBy,
      sortOrder: query?.sortOrder,
    },
  });
};

export const getRequestById = (id: string): Promise<TRequest> => {
  return apiClient.get<TRequest>(`/requests/${id}`);
};

export const updateRequest = (id: string, updatedFields: Partial<TRequest>): Promise<TRequest> => {
  return apiClient.patch<TRequest>(`/requests/${id}`, updatedFields);
};

export const updateRequestStatus = (
  id: string,
  status: TRequest['status'],
  simulateError?: number
): Promise<TRequest> => {
  return apiClient.patch<TRequest>(`/requests/${id}/status`, { status, simulateError });
};

