import { useState, useMemo } from 'react';
import { PageHeader } from '../../common/components/PageHeader';
import type { User } from '../../types';
import { UserListFilter } from './_components/UserListFilter';
import { UserTable } from './_components/UserTable';

const mockUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Developer', status: 'Aktif' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin', status: 'Pending' },
    { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com', role: 'User', status: 'Inactive' },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Developer', status: 'Aktif' },
    { id: '5', name: 'Chris Johnson', email: 'chris.johnson@example.com', role: 'User', status: 'Aktif' },
];

const UsersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => {
        return mockUsers.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
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