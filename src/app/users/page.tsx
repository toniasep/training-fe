import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/page-header';
import { UserListFilter } from './_components/user-list-filter';
import { UserTable } from './_components/user-table';
import { UserFormDialog } from './_components/user-form-dialog';
import { useUserList } from './_hooks/use-user-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { TUser } from '@/api/users/type';
import { Spinner } from '@/components/ui/spinner';
import { ErrorState } from '@/components/common/error-state';

const UsersPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const querySearch = searchParams.get('search') || '';

    // Local input state for fluid UI typing response
    const [inputValue, setInputValue] = useState(querySearch);
    const [prevQuerySearch, setPrevQuerySearch] = useState(querySearch);
    
    // Sync input value if URL parameter changes externally
    if (querySearch !== prevQuerySearch) {
        setPrevQuerySearch(querySearch);
        setInputValue(querySearch);
    }

    // Debounced update to the URL search parameter
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchParams((prev) => {
                const nextParams = new URLSearchParams(prev);
                if (inputValue) {
                    nextParams.set('search', inputValue);
                } else {
                    nextParams.delete('search');
                }
                return nextParams;
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue, setSearchParams]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<TUser | undefined>(undefined);

    const { data: users = [], isLoading, error, refetch } = useUserList({
        page: 1,
        limit: 10,
        search: querySearch,
    });

    const handleAddClick = () => {
        setSelectedUser(undefined);
        setDialogOpen(true);
    };

    const handleEditClick = (user: TUser) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleSuccess = () => {
        // Cache invalidation is handled in mutation hooks on success.
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
                        searchQuery={inputValue}
                        onSearchChange={setInputValue}
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
                <ErrorState
                    title="Gagal Memuat Data"
                    message={error.message || 'Gagal mengambil data user.'}
                    onRetry={refetch}
                />
            ) : (
                <UserTable users={users} onEdit={handleEditClick} isFiltered={!!querySearch} />
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