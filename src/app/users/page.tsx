import { useState, useEffect } from 'react';
import { PageHeader } from '../../common/components/page-header';
import { UserListFilter } from './_components/user-list-filter';
import { UserTable } from './_components/user-table';
import { UserFormDialog } from './_components/user-form-dialog';
import { getUser } from '../../api/users/api';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import type { TUser } from '../../api/users/type';
import { Spinner } from '@/components/ui/spinner';

const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<TUser | undefined>(undefined);
    const [users, setUsers] = useState<TUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        
        queueMicrotask(() => {
            if (isMounted) {
                setIsLoading(true);
                setError(null);
            }
        });

        getUser(searchQuery)
            .then((data) => {
                if (isMounted) {
                    setUsers(data);
                    setIsLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (isMounted) {
                    console.error('Failed to fetch users:', err);
                    const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data user.';
                    setError(errorMessage);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [searchQuery, refreshKey]);

    const handleAddClick = () => {
        setSelectedUser(undefined);
        setDialogOpen(true);
    };

    const handleEditClick = (user: TUser) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleSuccess = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div>
            <PageHeader
                title="Manajemen User"
                description="Kelola data pengguna"
            />

            <div className="flex items-center justify-between mb-6">
                <div className="max-w-xs flex-1">
                    <UserListFilter
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                </div>
                <Button onClick={handleAddClick}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah User
                </Button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 rounded-xl border border-slate-800/40">
                    <Spinner className="h-8 w-8 text-indigo-500 mb-2" />
                    <p className="text-sm text-slate-400">Memuat data user...</p>
                </div>
            ) : error ? (
                <div className="flex items-start gap-3 p-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-slate-100">Gagal Memuat Data</h4>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
            ) : (
                <UserTable users={users} onEdit={handleEditClick} />
            )}

            <UserFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={selectedUser}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default UsersPage;