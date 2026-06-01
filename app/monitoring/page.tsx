"use client";

import React, { useState, useEffect } from 'react';
import {
    Activity, Users, UserCheck, Clock, Shield, Search,
    RefreshCw, Zap, Landmark, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { attendanceApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function MonitoringPage() {
    const [activePlants, setActivePlants] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchActive = async () => {
        setLoading(true);
        try {
            const res: any = await attendanceApi.request('/attendance/monitoring-active');
            setActivePlants(res.plants || {});
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActive();
        // Refresh every minute
        const t = setInterval(fetchActive, 60000);
        return () => clearInterval(t);
    }, []);

    const totalActive = Object.values(activePlants).reduce((acc, workers) => acc + workers.length, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Live Workforce Monitoring</h2>
                    <p className="text-muted-foreground">Real-time head count across all industrial facilities</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest">{totalActive} WORKERS INSIDE</span>
                    </div>
                    <button onClick={fetchActive} className="p-2.5 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Plants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(activePlants).map(([plantName, workers]) => (
                    <div key={plantName} className="glass-card rounded-[2rem] overflow-hidden border border-white/5 flex flex-col">
                        <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center accent-glow">
                                    <Landmark className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{plantName}</h3>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Facility Active</p>
                                </div>
                            </div>
                            <span className="bg-white/5 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                {workers.length} IN
                            </span>
                        </div>

                        <div className="flex-1 p-4 space-y-2 overflow-y-auto max-h-[400px]">
                            {workers.map((w) => (
                                <div key={w.worker_code} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs">
                                            {w.worker_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none mb-1">{w.worker_name}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono">{w.worker_code} • {w.contractor}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-green-500 font-bold uppercase mb-0.5">Checked In</p>
                                        <p className="text-xs font-mono font-bold flex items-center gap-1">
                                            <ArrowUpRight className="h-3 w-3 text-green-500" />
                                            {w.checkin_time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {workers.length === 0 && (
                                <div className="py-12 text-center text-muted-foreground italic text-sm">No workers currently in this plant</div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-white/5">
                            <button className="w-full py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-1 group">
                                View Full Roster <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}

                {Object.keys(activePlants).length === 0 && !loading && (
                    <div className="col-span-full py-24 text-center glass-card rounded-[3rem]">
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold text-lg">No active movement detected</p>
                        <p className="text-muted-foreground text-sm mt-1">Check-in workers to see them in real-time here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
