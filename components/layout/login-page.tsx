"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Factory, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('admin@system.com');
    const [password, setPassword] = useState('admin123');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Login failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background industrial-gradient flex items-center justify-center relative overflow-hidden px-4">
            {/* Background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 h-64 w-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-2xl shadow-primary/30 accent-glow">
                        <Factory className="h-9 w-9 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">DYNEA PAKISTAN</h1>
                    <p className="text-muted-foreground text-sm mt-1">Attendance Management System</p>
                </div>

                {/* Card */}
                <div className="glass-card p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                    <h2 className="text-xl font-bold mb-1">Welcome back</h2>
                    <p className="text-muted-foreground text-sm mb-8">Sign in to access the control panel</p>

                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@system.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 ring-primary/40 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 outline-none focus:ring-2 ring-primary/40 transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                >
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-[10px] text-muted-foreground">
                            Default credentials: <span className="text-primary font-mono">admin@system.com</span> / <span className="text-primary font-mono">admin123</span>
                        </p>
                    </div>
                </div>

                <p className="text-center text-muted-foreground/50 text-xs mt-6">
                    © 2024 Industrial AMS — Powered by DeepFace AI
                </p>
            </motion.div>
        </div>
    );
}
