import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/api/audit-log/api';
import type { TAuditLog } from '@/api/audit-log/type';
import { auditLogQueryKeys } from './query-keys';

export const useAuditLogList = () => {
  return useQuery<TAuditLog[], Error>({
    queryKey: auditLogQueryKeys.all,
    queryFn: getAuditLogs,
  });
};
