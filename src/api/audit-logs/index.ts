import { apiClient } from '@/libs/api-client';
import type { TAuditLog } from '@/api/audit-logs/types';
import type { ListQuery } from '@/types/query';

export const getAuditLogs = async (
  query?: ListQuery & { actor?: string; action?: string }
): Promise<{ data: TAuditLog[]; total: number }> => {
  const res = await apiClient.get<{ data: TAuditLog[]; total: number }>('/audit-logs', {
    params: {
      search: query?.search,
      actor: query?.actor,
      action: query?.action,
      page: query?.page,
      pageSize: query?.limit,
    },
  });
  return res.data;
};

