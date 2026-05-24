import { apiClient } from '@/lib/api-client';
import type { TAuditLog } from '@/api/audit-log/type';

export const getAuditLogs = (): Promise<TAuditLog[]> => {
  return apiClient.get<TAuditLog[]>('/audit-logs');
};
