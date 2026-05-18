export type UserRole = 'Developer' | 'Admin' | 'User';
export type UserStatus = 'Aktif' | 'Pending' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}
