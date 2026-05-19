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
        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <PageHeader
                title="Manajemen User"
                description="Kelola data pengguna"
            />

            <UserListFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <UserTable users={filteredUsers} />
        </main>
    );
};

export default UsersPage;