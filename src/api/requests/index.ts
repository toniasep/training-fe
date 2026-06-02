import { apiClient } from '@/libs/api-client';
import type { TRequest, TUpdateRequest } from '@/api/requests/types';
import type { ListQuery } from '@/types/query';

export const getRequests = async (
  query?: ListQuery & { status?: string; priority?: string; sortBy?: string; sortOrder?: string }
): Promise<{ data: TRequest[]; total: number }> => {
  const res = await apiClient.get<{ data: TRequest[]; total: number }>('/requests', {
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
  return res.data;
};

export const getRequestById = async (id: string): Promise<TRequest> => {
  const res = await apiClient.get<TRequest>(`/requests/${id}`);
  return res.data;
};

export const updateRequest = async (id: string, updatedFields: TUpdateRequest): Promise<TRequest> => {
  const res = await apiClient.patch<TRequest>(`/requests/${id}`, updatedFields);
  return res.data;
};

export const updateRequestStatus = async (
  id: string,
  status: TRequest['status'],
  simulateError?: number
): Promise<TRequest> => {
  const res = await apiClient.patch<TRequest>(`/requests/${id}/status`, { status, simulateError });
  return res.data;
};

