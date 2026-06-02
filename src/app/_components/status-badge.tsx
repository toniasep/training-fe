import { Badge } from '@/app/_components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const normStatus = status.toLowerCase();

  if (normStatus === 'active' || normStatus === 'approved') {
    return (
      <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
        {normStatus === 'active' ? 'Active' : 'Approved'}
      </Badge>
    );
  }

  if (normStatus === 'invited' || normStatus === 'open') {
    return (
      <Badge className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20">
        {normStatus === 'invited' ? 'Invited' : 'Open'}
      </Badge>
    );
  }

  if (normStatus === 'in_review') {
    return (
      <Badge className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
        In Review
      </Badge>
    );
  }

  if (normStatus === 'suspended' || normStatus === 'rejected') {
    return (
      <Badge className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20">
        {normStatus === 'suspended' ? 'Suspended' : 'Rejected'}
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      {status}
    </Badge>
  );
};

