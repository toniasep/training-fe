import { Link } from 'react-router-dom';
import { Eye, Pencil, UserCheck, UserX } from 'lucide-react';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import type { TUser } from '@/api/users/type';
import { Button } from '@/components/ui/button';
import { useUpdateUserStatus } from '../_hooks/use-update-user-status';
import { useToast } from '@/components/layout/toast-context';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
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
    isFiltered: boolean;
}

export const UserTable = ({ users, onEdit, isFiltered }: UserTableProps) => {
    const { mutate: updateStatus } = useUpdateUserStatus();
    const { toast } = useToast();
    const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

    const handleToggleStatus = (user: TUser) => {
        const nextStatus = user.status === 'Aktif' ? 'Inactive' : 'Aktif';
        const actionLabel = nextStatus === 'Aktif' ? 'mengaktifkan' : 'menonaktifkan';
        setLoadingUserId(user.id);
        
        updateStatus(
            { id: user.id, status: nextStatus },
            {
                onSuccess: () => {
                    toast(`Berhasil ${actionLabel} user ${user.name}.`, 'success');
                    setLoadingUserId(null);
                },
                onError: (error) => {
                    toast(error.message || `Gagal ${actionLabel} user.`, 'error');
                    setLoadingUserId(null);
                },
            }
        );
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[300px]">Aksi</TableHead>
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
                                    {user.status === 'Aktif' ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={loadingUserId === user.id}
                                            onClick={() => handleToggleStatus(user)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200"
                                        >
                                            {loadingUserId === user.id ? (
                                                <Spinner className="h-3 w-3 mr-1" />
                                            ) : (
                                                <UserX className="h-3.5 w-3.5 mr-1" />
                                            )}
                                            Nonaktifkan
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={loadingUserId === user.id}
                                            onClick={() => handleToggleStatus(user)}
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 border-green-200"
                                        >
                                            {loadingUserId === user.id ? (
                                                <Spinner className="h-3 w-3 mr-1" />
                                            ) : (
                                                <UserCheck className="h-3.5 w-3.5 mr-1" />
                                            )}
                                            Aktifkan
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="p-0">
                            <EmptyState
                                title={isFiltered ? "Pencarian Tidak Ditemukan" : "Data User Kosong"}
                                description={
                                    isFiltered
                                        ? "Tidak ada data user yang sesuai dengan kata kunci pencarian Anda."
                                        : "Belum ada data user di sistem ini."
                                }
                            />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

