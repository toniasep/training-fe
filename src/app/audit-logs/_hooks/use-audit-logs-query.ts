import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/api/audit-logs';
import type { TAuditLog } from '@/api/audit-logs/types';
import type { ListQuery } from '@/types/query';
import { ApiError } from '@/libs/api-client';

export const useAuditLogsQuery = (query?: ListQuery & { actor?: string; action?: string }) => {
  return useQuery<{ data: TAuditLog[]; total: number }, ApiError>({
    queryKey: ['audit-logs', query],
    queryFn: () => getAuditLogs(query),
  });
};
