"use client";

import React, { useState } from 'react';
import { Sidebar, Navbar } from './dashboard-layout';

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
