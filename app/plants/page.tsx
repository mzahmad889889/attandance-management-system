"use client";

import React from 'react';
import {
    Factory,
    MapPin,
    Users,
    ShieldCheck,
    Activity,
    Settings,
    ChevronRight,
    Search
} from 'lucide-react';
import { PLANTS } from '@/lib/mock-data';

export default function PlantsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Plant Management</h2>
                    <p className="text-muted-foreground">Operational status and resource allocation across facilities</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search facilities..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-primary/30"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PLANTS.map((plant) => (
                    <div key={plant.id} className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> ONLINE
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="h-20 w-20 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                                <Factory className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-1">{plant.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {plant.location} • ID: {plant.id}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <Users className="h-5 w-5 text-muted-foreground mb-2" />
                                <p className="text-lg font-bold">{plant.activeWorkers}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">At Peak</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <ShieldCheck className="h-5 w-5 text-muted-foreground mb-2" />
                                <p className="text-lg font-bold">100%</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Safety</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <Activity className="h-5 w-5 text-muted-foreground mb-2" />
                                <p className="text-lg font-bold">A+</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Efficiency</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold">Capacity Utilization</span>
                                <span className="text-xs text-muted-foreground">{plant.activeWorkers} / {plant.capacity}</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
                                    style={{ width: `${(plant.activeWorkers / plant.capacity) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button className="flex-1 py-3 px-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold hover:bg-white/10 flex items-center justify-center gap-2">
                                <Settings className="h-4 w-4" /> Config
                            </button>
                            <button className="flex-1 py-3 px-4 bg-primary text-white rounded-2xl text-xs font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2">
                                Manage Site <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
