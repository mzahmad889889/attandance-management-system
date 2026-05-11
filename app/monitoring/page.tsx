"use client";

import React from 'react';
import {
    Activity,
    Factory,
    Map,
    UserCheck,
    Zap,
    ChevronRight,
    MapPin,
    AlertTriangle,
    Eye
} from 'lucide-react';
import { PLANTS, MOCK_WORKERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function MonitoringPage() {
    const activeWorkers = MOCK_WORKERS.filter(w => w.liveStatus === 'IN');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Live Plant Monitor</h2>
                    <p className="text-muted-foreground">Real-time occupancy and active personnel tracking</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Live Feed: Synchronized</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {PLANTS.map((plant) => (
                    <div key={plant.id} className="glass-card p-6 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10">
                                <Factory className="h-6 w-6" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">{plant.activeWorkers}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Active Inside</p>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold mb-1">{plant.name}</h3>
                        <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {plant.location}
                        </p>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                                <span>Utilization</span>
                                <span>{Math.round((plant.activeWorkers / plant.capacity) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-1000",
                                        (plant.activeWorkers / plant.capacity) > 0.9 ? "bg-red-500" : "bg-primary"
                                    )}
                                    style={{ width: `${(plant.activeWorkers / plant.capacity) * 100}%` }}
                                />
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                            <Eye className="h-4 w-4" /> View Details
                        </button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Active Workers Feed */}
                <div className="xl:col-span-2 glass-card rounded-3xl overflow-hidden border border-white/10">
                    <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-primary" />
                            Personnel Currently Inside
                        </h3>
                        <div className="text-[10px] font-bold text-muted-foreground">TOTAL: {activeWorkers.length}</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-b border-white/10 bg-white/2">
                                    <th className="px-6 py-4">Worker</th>
                                    <th className="px-6 py-4">Plant</th>
                                    <th className="px-6 py-4">Contractor</th>
                                    <th className="px-6 py-4">Check-In Time</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {activeWorkers.slice(0, 10).map((worker) => (
                                    <tr key={worker.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full border-2 border-primary/20 overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?u=${worker.id}`} alt="p" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{worker.name}</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono">{worker.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">{worker.plantId}</td>
                                        <td className="px-6 py-4 text-[10px] text-muted-foreground font-bold">{worker.contractor}</td>
                                        <td className="px-6 py-4 font-mono text-xs text-white/80">{worker.lastCheckIn} am</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> ON-SITE
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Incidents / Alerts */}
                <div className="glass-card p-6 rounded-3xl space-y-6">
                    <h3 className="font-bold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        Security Alerts
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-amber-500">OVER-CAPACITY THREAT</p>
                                <span className="text-[10px] text-muted-foreground">09:15 AM</span>
                            </div>
                            <p className="text-sm">Plant P01 utilization reached 92%. Monitoring inflow closely.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-red-500">SHIFT LEAKAGE</p>
                                <span className="text-[10px] text-muted-foreground">08:45 AM</span>
                            </div>
                            <p className="text-sm">3 workers from Night Shift still logged as IN at Plant P03.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-xs font-bold text-blue-500">SYSTEM NOTE</p>
                                <span className="text-[10px] text-muted-foreground">08:00 AM</span>
                            </div>
                            <p className="text-sm">Day shift synchronization completed successfully for all plants.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
