import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/api/audit-logs';
import type { TAuditLog } from '@/api/audit-logs/types';
import { auditLogQueryKeys } from './query-keys';
import { ApiError } from '@/libs/api-client';

export const useAuditLogsQuery = () => {
  return useQuery<TAuditLog[], ApiError>({
    queryKey: auditLogQueryKeys.all,
    queryFn: getAuditLogs,
  });
};
