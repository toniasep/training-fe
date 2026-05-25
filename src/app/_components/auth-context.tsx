import React, { createContext, useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUserQuery } from '@/app/login/_hooks/use-current-user-query';
import type { TAuthUser } from '@/api/auth/types';

interface AuthContextType {
    user: TAuthUser | null;
    login: (token: string, user: TAuthUser) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem('auth_token');
    
    // Read current user status from TanStack query
    const { data: user = null, isLoading } = useCurrentUserQuery();

    // If a token is in localStorage, but TanStack Query is still loading/fetching and we don't have the user object yet
    const contextIsLoading = !!token && isLoading && !user;

    const login = (newToken: string, newUser: TAuthUser) => {
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        // Update query cache immediately
        queryClient.setQueryData(['auth', 'current-user'], newUser);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Clear all query client data (especially auth user info and user/request lists)
        queryClient.setQueryData(['auth', 'current-user'], null);
        queryClient.clear();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading: contextIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth harus digunakan di dalam AuthProvider');
    }
    return context;
};
