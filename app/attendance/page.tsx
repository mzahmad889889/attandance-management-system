"use client";

import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    MoreVertical,
    Calendar,
    Clock,
    MapPin,
    ArrowUpRight,
    ArrowDownRight,
    CircleDot
} from 'lucide-react';
import { MOCK_ATTENDANCE } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance Logs</h2>
                    <p className="text-muted-foreground">Comprehensive workforce attendance records</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors">
                        <Download className="h-4 w-4" /> Export CSV
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Pick Date
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by worker name, ID or contractor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-primary/30 transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select className="flex-1 md:w-40 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none">
                        <option>All Plants</option>
                        <option>Main Assembly</option>
                        <option>Packaging</option>
                    </select>
                    <select className="flex-1 md:w-40 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none">
                        <option>All Shifts</option>
                        <option>Day Shift</option>
                        <option>Night Shift</option>
                    </select>
                    <button className="p-2 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-b border-white/10">
                                <th className="px-6 py-5">Worker Details</th>
                                <th className="px-6 py-5">Department / Plant</th>
                                <th className="px-6 py-5">Shift Type</th>
                                <th className="px-6 py-5">Check In/Out</th>
                                <th className="px-6 py-5">Work Duration</th>
                                <th className="px-6 py-5">Live Status</th>
                                <th className="px-6 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {MOCK_ATTENDANCE.map((record) => (
                                <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10">
                                                <img src={record.photo} alt={record.workerName} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{record.workerName}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{record.workerId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{record.plantId}</span>
                                            <span className="text-[10px] text-muted-foreground">{record.contractor}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-bold border",
                                            record.shiftType === "Day" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                        )}>
                                            {record.shiftType.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-green-500">
                                                <ArrowUpRight className="h-3 w-3" /> {record.checkIn.split('T')[1].substring(0, 5)}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400">
                                                <ArrowDownRight className="h-3 w-3" /> {record.checkOut ? record.checkOut.split('T')[1].substring(0, 5) : "--:--"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold">{record.totalHours || '8.5'} hrs</p>
                                            <p className="text-[10px] text-primary font-bold">OT: {record.overtimeHours || '0'} hrs</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <CircleDot className={cn("h-2 w-2", record.liveStatus === 'IN' ? 'text-green-500 animate-pulse' : 'text-muted-foreground')} />
                                            <span className={cn(
                                                "text-xs font-bold",
                                                record.liveStatus === 'IN' ? "text-green-500" : "text-muted-foreground"
                                            )}>
                                                {record.liveStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                            <MoreVertical className="h-5 w-5 text-muted-foreground" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-white/5 border-t border-white/10 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Showing 1-20 of 324 records</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
