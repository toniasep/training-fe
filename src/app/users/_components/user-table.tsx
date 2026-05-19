import { StatusBadge } from '../../../common/components/status-badge';
import { EmptyState } from '../../../common/components/empty-state';
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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <StatusBadge status={user.status} />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="p-0">
                            <EmptyState
                                title="Data User Tidak Ditemukan"
                                description="Tidak ada data user yang sesuai dengan kata kunci pencarian Anda."
                            />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
