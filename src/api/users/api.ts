import type { TUser } from './type';

let mockUsers: TUser[] = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', role: 'Developer', status: 'Aktif', password: 'password123' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin', status: 'Pending', password: 'password123' },
    { id: '3', name: 'Michael Brown', email: 'michael.brown@example.com', role: 'User', status: 'Inactive', password: 'password123' },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Developer', status: 'Aktif', password: 'password123' },
    { id: '5', name: 'Chris Johnson', email: 'chris.johnson@example.com', role: 'User', status: 'Aktif', password: 'password123' },
];

export const getUser = (searchQuery: string): TUser[] => {
    return mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

export const getUserById = (id: string): TUser | undefined => {
    return mockUsers.find(user => user.id === id);
}

export const getUserLogin = (email: string, password: string): TUser | undefined => {
    return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password?.toLowerCase() === password.toLowerCase());
}

export const createUser = (user: Omit<TUser, 'id'>): TUser => {
    const newId = String(Math.max(...mockUsers.map(u => Number(u.id)), 0) + 1);
    const newUser = { ...user, id: newId };
    mockUsers.push(newUser);
    return newUser;
};

export const updateUser = (id: string, updatedFields: Partial<Omit<TUser, 'id'>>): TUser | undefined => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    mockUsers[index] = {
        ...mockUsers[index],
        ...updatedFields
    };
    return mockUsers[index];
};

