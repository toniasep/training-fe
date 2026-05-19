import { StatusBadge } from '../../../common/components/status-badge';
import type { TUser } from '../../../api/users/type';

interface UserTableProps {
    users: TUser[];
}

export const UserTable = ({ users }: UserTableProps) => {
    return (
        <article className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <StatusBadge status={user.status} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                                    Tidak ada data user yang sesuai dengan pencarian.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </article>
    );
};
