import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/api/audit-logs';
import type { TAuditLog } from '@/api/audit-logs/types';
import { auditLogQueryKeys } from './query-keys';

export const useAuditLogsQuery = () => {
  return useQuery<TAuditLog[], Error>({
    queryKey: auditLogQueryKeys.all,
    queryFn: getAuditLogs,
  });
};
