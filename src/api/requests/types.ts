export type TRequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type TRequestPriority = 'Low' | 'Medium' | 'High';

export type TRequest = {
  id: string;
  title: string;
  description: string;
  status: TRequestStatus;
  createdAt: string;
  priority?: TRequestPriority;
  assignee?: string;
}
