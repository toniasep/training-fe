import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/api/audit-log/api';
import type { TAuditLog } from '@/api/audit-log/type';

export const useAuditLogs = () => {
  return useQuery<TAuditLog[], Error>({
    queryKey: ['audit-logs'],
    queryFn: getAuditLogs,
  });
};
