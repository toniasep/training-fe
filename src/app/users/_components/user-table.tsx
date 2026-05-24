import { Link } from 'react-router-dom';
import { Eye, Pencil } from 'lucide-react';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import type { TUser } from '@/api/users/type';
import { Button } from '@/components/ui/button';
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
    onEdit: (user: TUser) => void;
}

export const UserTable = ({ users, onEdit }: UserTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[180px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell className="font-medium">
                                <Link to={`/users/${user.id}`} className="hover:underline hover:text-primary transition-colors">
                                    {user.name}
                                </Link>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <StatusBadge status={user.status} />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link to={`/users/${user.id}`}>
                                            <Eye className="h-3.5 w-3.5 mr-1" />
                                            Detail
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                                        <Pencil className="h-3.5 w-3.5 mr-1" />
                                        Edit
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="p-0">
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
