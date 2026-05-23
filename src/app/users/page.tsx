import { useState, useMemo } from 'react';
import { PageHeader } from '../../common/components/page-header';
import { UserListFilter } from './_components/user-list-filter';
import { UserTable } from './_components/user-table';
import { UserFormDialog } from './_components/user-form-dialog';
import { getUser } from '../../api/users/api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { TUser } from '../../api/users/type';

const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<TUser | undefined>(undefined);

    const filteredUsers = useMemo(() => {
        return getUser(searchQuery);
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

            <UserTable users={filteredUsers} onEdit={handleEditClick} />

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