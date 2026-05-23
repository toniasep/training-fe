import { apiClient } from '../../lib/api-client';
import type { TAuditLog } from './type';

export const getAuditLogs = (): Promise<TAuditLog[]> => {
  return apiClient.get<TAuditLog[]>('/audit-logs');
};
