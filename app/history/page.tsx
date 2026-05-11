"use client";

import React, { useState } from 'react';
import {
    Search,
    Calendar,
    Clock,
    FileText,
    MapPin,
    ArrowLeft,
    TrendingUp,
    Shield,
    Camera
} from 'lucide-react';
import { MOCK_WORKERS, MOCK_ATTENDANCE } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function WorkerHistoryPage() {
    const [workerId, setWorkerId] = useState('W0001');
    const worker = MOCK_WORKERS.find(w => w.id === workerId) || MOCK_WORKERS[0];
    const history = MOCK_ATTENDANCE.slice(0, 8);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Worker Dossier</h2>
                    <p className="text-muted-foreground">Comprehensive history and performance logs</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search Worker ID..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-primary/30"
                        value={workerId}
                        onChange={(e) => setWorkerId(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-8 rounded-[2rem] text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">ACTIVE</span>
                        </div>
                        <div className="w-32 h-32 mx-auto rounded-3xl border-4 border-primary/20 p-1 relative group cursor-pointer">
                            <img src={`https://i.pravatar.cc/150?u=${worker.id}`} alt="Profile" className="w-full h-full object-cover rounded-[1.2rem]" />
                            <div className="absolute inset-0 bg-primary/40 rounded-[1.2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Camera className="text-white h-8 w-8" />
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-2xl font-bold">{worker.name}</h3>
                            <p className="text-primary font-mono text-sm font-bold tracking-widest">{worker.id}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold text-center">Plant</p>
                                <p className="text-sm font-bold text-center">{worker.plantId}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold text-center">Shift</p>
                                <p className="text-sm font-bold text-center">{worker.shiftType}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-3xl space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Performance Overview</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-bold">98.5%</p>
                                    <p className="text-xs text-muted-foreground">Punctuality Score</p>
                                </div>
                                <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: '98.5%' }} />
                            </div>
                        </div>
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-2xl font-bold">24h</p>
                                    <p className="text-xs text-muted-foreground">OT This Month</p>
                                </div>
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Attendance & Photo History
                            </h3>
                            <select className="bg-transparent border border-white/10 rounded-lg text-xs px-3 py-1 font-bold outline-none">
                                <option>Last 30 Days</option>
                                <option>Last 3 Months</option>
                            </select>
                        </div>
                        <div className="p-6">
                            <div className="space-y-8 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-8 bottom-8 w-px bg-white/10" />

                                {history.map((record, i) => (
                                    <div key={i} className="flex gap-6 relative">
                                        <div className="z-10 h-12 w-12 rounded-2xl bg-slate-900 border-2 border-white/10 flex items-center justify-center shrink-0">
                                            <Shield className={cn("h-6 w-6", i === 0 ? "text-primary" : "text-muted-foreground")} />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                <div>
                                                    <p className="font-bold text-lg">Shift {record.shiftType} - Plant {record.plantId}</p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1 font-bold"><Calendar className="h-3.3 w-3.5" /> May {12 - i}, 2024</span>
                                                        <span className="flex items-center gap-1 font-bold font-mono"><Clock className="h-3.5 w-3.5" /> 08:00 - 17:30</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold">TOTAL: 9.5 HRS</span>
                                                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold">OT: 1.5 HRS</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 border border-white/10 rounded-[1.5rem]">
                                                <div className="aspect-square rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer border border-white/10">
                                                    <img src={`https://i.pravatar.cc/150?u=checkin-${i}`} alt="Check-in Photo" className="h-full w-full object-cover" />
                                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-[8px] text-center font-bold">CHECK-IN</div>
                                                </div>
                                                <div className="aspect-square rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer border border-white/10">
                                                    <img src={`https://i.pravatar.cc/150?u=checkout-${i}`} alt="Check-out Photo" className="h-full w-full object-cover" />
                                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 text-[8px] text-center font-bold">CHECK-OUT</div>
                                                </div>
                                                <div className="flex flex-col justify-center gap-3 md:col-span-2 px-2">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-primary" />
                                                        <p className="text-xs">Location: <span className="font-bold text-white">North Gate Terminal 04</span></p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4 text-green-500" />
                                                        <p className="text-xs">Bio-Verification: <span className="font-bold text-green-500 uppercase">Passed</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
