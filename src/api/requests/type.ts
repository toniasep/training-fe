export type TRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export type TRequest = {
  id: string;
  title: string;
  description: string;
  status: TRequestStatus;
  createdAt: string;
}
