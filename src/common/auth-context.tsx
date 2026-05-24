import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '@/api/auth/api';
import type { TAuthUser } from '@/api/auth/type';

interface AuthContextType {
    user: TAuthUser | null;
    login: (token: string, user: TAuthUser) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<TAuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            const savedToken = localStorage.getItem('auth_token');
            const savedUser = localStorage.getItem('auth_user');

            if (!savedToken) {
                setIsLoading(false);
                return;
            }

            // Set initial state from localStorage cache to prevent flickers
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    localStorage.removeItem('auth_user');
                }
            }

            try {
                // Verify token with backend
                const currentUser = await getCurrentUser();
                setUser(currentUser);
                localStorage.setItem('auth_user', JSON.stringify(currentUser));
            } catch (error) {
                console.error('Failed to verify session:', error);
                // Clear session on authentication error (e.g. 401)
                setUser(null);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    const login = (token: string, user: TAuthUser) => {
        setUser(user);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
