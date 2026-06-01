"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    Clock,
    History,
    Activity,
    Settings,
    Factory,
    FileBox,
    Menu,
    Search,
    Bell,
    User as UserIcon,
    LogOut,
    ScanFace,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

const sidebarItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Workers', href: '/workers', icon: Users },
    { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
    { name: 'Face Check-In/Out', href: '/check-in', icon: ScanFace },
    { name: 'Worker History', href: '/history', icon: History },
    { name: 'Live Monitoring', href: '/monitoring', icon: Activity },
    { name: 'Shift Management', href: '/shifts', icon: Factory },
    { name: 'Plants', href: '/plants', icon: Settings },
    { name: 'Reports', href: '/reports', icon: FileBox },
];

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen w-64 glass-card transition-transform lg:translate-x-0 border-r",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center accent-glow">
                            <Factory className="text-white h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-none">INDUSTRY</h1>
                            <p className="text-[10px] text-muted-foreground tracking-widest font-semibold uppercase">Pro Management</p>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
                        {sidebarItems.map((item) => {
                            const active = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                                        active
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5", active ? "text-white" : "text-muted-foreground group-hover:text-white")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User + Logout */}
                    <div className="p-4 border-t border-white/5 space-y-3">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                            <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {user?.role === 'admin' ? 'Admin Access' : 'Manager Access'}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">{user?.name}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export function Navbar({ setIsOpen }: { setIsOpen: (val: boolean) => void }) {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 h-16 glass-card border-b flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-white/5"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 w-80">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search workers, plants, shifts..."
                        className="bg-transparent border-none outline-none text-sm w-full"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2 rounded-lg hover:bg-white/5 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
                </button>

                <div className="h-8 w-px bg-white/10 mx-1 md:mx-2" />

                <div className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-lg transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-orange-500 to-primary flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold leading-none">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{user?.role || 'Loading'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
