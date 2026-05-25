import { apiClient } from '@/libs/api-client';
import type { TAuditLog } from '@/api/audit-logs/types';

export const getAuditLogs = (): Promise<TAuditLog[]> => {
  return apiClient.get<TAuditLog[]>('/audit-logs');
};
