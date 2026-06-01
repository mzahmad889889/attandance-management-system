"use client";

import React, { useState } from 'react';
import { Sidebar, Navbar } from './dashboard-layout';
import { useAuth } from '@/lib/auth-context';
import { LoginPage } from './login-page';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center animate-pulse accent-glow">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <p className="text-muted-foreground text-sm animate-pulse">Initializing system...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <LoginPage />;
    }

    return <AppShell>{children}</AppShell>;
}

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground industrial-gradient">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Navbar setIsOpen={setIsSidebarOpen} />
                <main className="flex-1 p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
