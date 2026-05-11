"use client";

import React from 'react';
import {
    Calendar,
    Users,
    Sunrise,
    Moon,
    Coffee,
    ArrowRightLeft,
    Plus,
    LayoutGrid,
    List,
    MoreHorizontal
} from 'lucide-react';
import { SHIFT_ROTATION, PLANTS, CONTRACTORS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const TEAMS = [
    { name: 'Alpha Squad', leader: 'John Doe', members: 42, plant: 'Plant P01', shift: 'Day' },
    { name: 'Beta Force', leader: 'Sarah Smith', members: 38, plant: 'Plant P02', shift: 'Night' },
    { name: 'Gamma Units', leader: 'Mike Ross', members: 45, plant: 'Plant P01', shift: 'Rest' },
    { name: 'Delta Team', leader: 'Rana Ali', members: 40, plant: 'Plant P03', shift: 'Day' },
];

export default function ShiftManagementPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Shift Operations</h2>
                    <p className="text-muted-foreground">Manage rotation logic and department rosters</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Assign Shift
                    </button>
                </div>
            </div>

            {/* Rotation Policy Card */}
            <div className="glass-card p-8 rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
                <div className="absolute -top-12 -right-12 h-64 w-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <ArrowRightLeft className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-bold uppercase tracking-widest text-primary">Current Rotation Policy</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                                <Sunrise className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">2 DAY SHIFTS</h4>
                                <p className="text-xs text-muted-foreground italic">08:00 AM - 18:00 PM</p>
                            </div>
                            <p className="text-sm text-slate-400">Regular daytime operations including production and quality control.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                                <Moon className="h-6 w-6 text-indigo-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">2 NIGHT SHIFTS</h4>
                                <p className="text-xs text-muted-foreground italic">20:00 PM - 06:00 AM</p>
                            </div>
                            <p className="text-sm text-slate-400">Night-time cycle focusing on manufacturing and raw material processing.</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-500/20 flex items-center justify-center">
                                <Coffee className="h-6 w-6 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">2 REST DAYS</h4>
                                <p className="text-xs text-muted-foreground italic">OFF DUTY</p>
                            </div>
                            <p className="text-sm text-slate-400">Recovery period for personnel to ensure compliance with health standards.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Team Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Group Rosters
                        </h3>
                        <div className="flex bg-white/5 rounded-lg p-1">
                            <button className="p-1 px-3 bg-white/10 rounded-md text-xs font-bold">GRID</button>
                            <button className="p-1 px-3 text-xs font-bold text-muted-foreground">LIST</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TEAMS.map((team, i) => (
                            <div key={i} className="glass-card p-6 rounded-3xl group border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                                        {team.name.charAt(0)}
                                    </div>
                                    <button className="p-2 hover:bg-white/5 rounded-full">
                                        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>
                                <h4 className="text-xl font-bold mb-1">{team.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                    <span className="font-bold">Lead: {team.leader}</span>
                                    <span>•</span>
                                    <span>{team.members} Personnel</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Active Shift</p>
                                        <span className={cn(
                                            "text-xs font-bold px-2 py-0.5 rounded-md",
                                            team.shift === 'Day' ? "text-amber-500 bg-amber-500/10" : (team.shift === 'Night' ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 bg-white/5")
                                        )}>
                                            {team.shift.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Location</p>
                                        <p className="text-xs font-bold">{team.plant}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Global Shift Calendar Snapshot */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Next 7 Days
                    </h3>
                    <div className="glass-card rounded-3xl overflow-hidden divide-y divide-white/5">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                            <div key={day} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl font-bold font-mono text-sm">{day}</span>
                                    <div>
                                        <p className="text-xs font-bold">ALPHA SQUAD</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Night Rotation</p>
                                    </div>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(j => (
                                        <div key={j} className="h-6 w-6 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/50?u=${j + i}`} alt="user" />
                                        </div>
                                    ))}
                                    <div className="h-6 w-6 rounded-full border-2 border-slate-900 bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                                        +39
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
