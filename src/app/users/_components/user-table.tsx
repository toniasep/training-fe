import { StatusBadge } from '../../../common/components/status-badge';
import type { TUser } from '../../../api/users/type';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface UserTableProps {
    users: TUser[];
}

export const UserTable = ({ users }: UserTableProps) => {
    return (
        <article className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">ID</TableHead>
                        <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Nama</TableHead>
                        <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Role</TableHead>
                        <TableHead className="font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium text-gray-500">{user.id}</TableCell>
                                <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                                <TableCell className="text-gray-500">{user.role}</TableCell>
                                <TableCell>
                                    <StatusBadge status={user.status} />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                Tidak ada data user yang sesuai dengan pencarian.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </article>
    );
};
