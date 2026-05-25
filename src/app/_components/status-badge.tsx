import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === 'Aktif' || status === 'Approved') {
    return (
      <Badge variant="default">
        {status}
      </Badge>
    );
  }

  if (status === 'Pending') {
    return (
      <Badge variant="secondary">
        {status}
      </Badge>
    );
  }

  if (status === 'Inactive' || status === 'Rejected') {
    return (
      <Badge variant="destructive">
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      {status}
    </Badge>
  );
};
