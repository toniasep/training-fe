import type { TUser } from './type';

const mockUsers: TUser[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Developer', status: 'Aktif' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin', status: 'Pending' },
    { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com', role: 'User', status: 'Inactive' },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Developer', status: 'Aktif' },
    { id: '5', name: 'Chris Johnson', email: 'chris.johnson@example.com', role: 'User', status: 'Aktif' },
];

export const getUser = (searchQuery: string): TUser[] => {
    return mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
}
