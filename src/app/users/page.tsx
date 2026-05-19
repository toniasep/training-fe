import { useState, useMemo } from 'react';
import { PageHeader } from '../../common/components/page-header';
import { UserListFilter } from './_components/user-list-filter';
import { UserTable } from './_components/user-table';
import { getUser } from '../../api/users/api';

const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => {
        return getUser(searchQuery);
    }, [searchQuery]);

    return (
        <div>
            <PageHeader
                title="Manajemen User"
                description="Kelola data pengguna"
            />

            <div className="mb-6 max-w-xs">
                <UserListFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            <UserTable users={filteredUsers} />
        </div>
    );
};

export default UsersPage;