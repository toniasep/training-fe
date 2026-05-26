export type TAuditLogTargetType = 'user' | 'request' | 'auth';

export type TAuditLog = {
  id: string;
  actorName: string;
  action: string;
  targetType: TAuditLogTargetType;
  targetId: string;
  createdAt: string;
  details?: string;
}

