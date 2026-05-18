interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  let bgClass = 'bg-gray-100 text-gray-800 border-gray-200';
  if (status === 'Aktif' || status === 'Approved') {
    bgClass = 'bg-green-100 text-green-800 border-green-200';
  } else if (status === 'Pending') {
    bgClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
  } else if (status === 'Inactive' || status === 'Rejected') {
    bgClass = 'bg-red-100 text-red-800 border-red-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bgClass}`}>
      {status}
    </span>
  );
};
