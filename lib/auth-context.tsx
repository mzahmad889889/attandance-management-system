/**
 * Auth context - manages login state across the app.
 */
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/lib/api';

interface User {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'manager';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: () => { },
    isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('ams_token');
        setUser(null);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('ams_token');
        if (!token) {
            setLoading(false);
            return;
        }
        authApi.me()
            .then((res: any) => setUser(res.user))
            .catch(() => { localStorage.removeItem('ams_token'); })
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res: any = await authApi.login(email, password);
        localStorage.setItem('ams_token', res.token);
        setUser(res.user);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
