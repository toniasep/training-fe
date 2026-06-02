export type TRequestStatus = 'open' | 'in_review' | 'approved' | 'rejected';
export type TRequestPriority = 'low' | 'medium' | 'high';

export type TRequest = {
  id: string;
  title: string;
  description: string;
  requesterName: string;
  status: TRequestStatus;
  createdAt: string;
  priority: TRequestPriority;
  assigneeName: string | null;
}

export type TUpdateRequest = Partial<Omit<TRequest, 'id' | 'createdAt'>>;
