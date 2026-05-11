"use client";

import React, { useState } from 'react';
import {
    Search,
    ArrowRightLeft,
    History,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Database,
    Scan
} from 'lucide-react';
import { CameraCapture } from '@/components/attendance/camera-capture';
import { MOCK_ATTENDANCE, MOCK_WORKERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function CheckInPage() {
    const [searchId, setSearchId] = useState('');
    const [selectedWorker, setSelectedWorker] = useState<any>(null);
    const recentAttendance = MOCK_ATTENDANCE.slice(0, 10);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const worker = MOCK_WORKERS.find(w => w.id.toLowerCase() === searchId.toLowerCase());
        if (worker) {
            setSelectedWorker(worker);
        } else {
            alert("Worker ID not found");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Check-In / Out</h2>
                    <p className="text-muted-foreground">Industrial biometrics attendance terminal</p>
                </div>
                <div className="text-right">
                    <h3 className="text-2xl font-mono font-bold tracking-tighter">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Search & Camera */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="glass-card p-6 rounded-3xl space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Scan className="h-5 w-5 text-primary" />
                            Identify Worker
                        </h3>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Enter Worker ID (e.g. W0001)"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 ring-primary/50 transition-all font-mono"
                                />
                            </div>
                            <button type="submit" className="bg-primary text-white px-6 rounded-xl font-bold hover:bg-primary/90 transition-all">
                                Find
                            </button>
                        </form>
                    </div>

                    <CameraCapture
                        onCapture={(img) => console.log('Captured:', img)}
                        workerName={selectedWorker?.name}
                        workerId={selectedWorker?.id}
                    />
                </div>

                {/* Right Column: Recent Activity & Table */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                Live Monitoring History
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">LIVE FEED</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-b border-white/10">
                                        <th className="px-6 py-4">Worker / ID</th>
                                        <th className="px-6 py-4">Plant/Shift</th>
                                        <th className="px-6 py-4">Timestamp</th>
                                        <th className="px-6 py-4">Event</th>
                                        <th className="px-6 py-4 text-right">Photo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentAttendance.map((record) => (
                                        <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                                        {record.workerName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{record.workerName}</p>
                                                        <p className="text-[10px] text-muted-foreground font-mono">{record.workerId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-bold">{record.plantId}</p>
                                                <p className="text-[10px] text-muted-foreground">{record.shiftType}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 font-mono text-xs">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    {record.checkIn.split('T')[1].substring(0, 5)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "px-2 py-1 rounded-md text-[10px] font-bold",
                                                    record.liveStatus === "IN" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                                )}>
                                                    {record.liveStatus === "IN" ? "CHECK-IN" : "CHECK-OUT"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end">
                                                    <div className="h-10 w-10 rounded-lg overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors">
                                                        <img src={record.photo} alt="log" className="h-full w-full object-cover" />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 bg-white/5 flex justify-center">
                            <button className="text-xs font-bold text-muted-foreground hover:text-white flex items-center gap-2">
                                <Database className="h-4 w-4" /> Load More History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
