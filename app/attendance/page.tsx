"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, Filter, Download, MoreVertical, Calendar, Clock,
    ArrowUpRight, ArrowDownRight, CircleDot, RefreshCw, FileSpreadsheet
} from 'lucide-react';
import { attendanceApi, reportsApi, workersApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function AttendancePage() {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [plantFilter, setPlantFilter] = useState('');
    const [shiftFilter, setShiftFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [meta, setMeta] = useState<{ plants: any[] }>({ plants: [] });
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        workersApi.meta().then((m: any) => setMeta({ plants: m.plants || [] })).catch(() => { });
    }, []);

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const res: any = await attendanceApi.list({
                page,
                per_page: 30,
                search: searchTerm,
                date: dateFilter,
                plant_id: plantFilter,
                shift: shiftFilter,
            });
            setRecords(res.records || []);
            setTotalPages(res.pages || 1);
            setTotal(res.total || 0);
        } catch {
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, dateFilter, plantFilter, shiftFilter]);

    useEffect(() => {
        const t = setTimeout(fetchRecords, 300);
        return () => clearTimeout(t);
    }, [fetchRecords]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await reportsApi.exportExcel({ date_from: dateFilter, date_to: dateFilter, plant_id: plantFilter || undefined });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendance_${dateFilter}.xlsx`;
            a.click();
        } catch {
            alert('Export failed. Make sure the backend is running.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Attendance Logs</h2>
                    <p className="text-muted-foreground">{total} records {dateFilter === new Date().toISOString().split('T')[0] ? 'today' : `on ${dateFilter}`}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        {exporting ? 'Exporting...' : 'Export Excel'}
                    </button>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={e => { setDateFilter(e.target.value); setPage(1); }}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 ring-primary/30"
                    />
                </div>
            </div>

            {/* Filters Bar */}
            <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by worker name or code..."
                        value={searchTerm}
                        onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        value={plantFilter}
                        onChange={e => { setPlantFilter(e.target.value); setPage(1); }}
                        className="flex-1 md:w-40 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                    >
                        <option value="">All Plants</option>
                        {meta.plants.map((p: any) => (
                            <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                        ))}
                    </select>
                    <select
                        value={shiftFilter}
                        onChange={e => { setShiftFilter(e.target.value); setPage(1); }}
                        className="flex-1 md:w-36 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none"
                    >
                        <option value="">All Shifts</option>
                        <option value="Day" className="bg-slate-900">Day Shift</option>
                        <option value="Night" className="bg-slate-900">Night Shift</option>
                        <option value="Rest" className="bg-slate-900">Rest Day</option>
                    </select>
                    <button onClick={fetchRecords} className="p-2 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10">
                        <RefreshCw className={cn("h-4 w-4 text-muted-foreground", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Main Table */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-b border-white/10">
                                <th className="px-6 py-5">Worker</th>
                                <th className="px-6 py-5">Plant / Contractor</th>
                                <th className="px-6 py-5">Shift</th>
                                <th className="px-6 py-5">Check In / Out</th>
                                <th className="px-6 py-5">Duration</th>
                                <th className="px-6 py-5">Overtime</th>
                                <th className="px-6 py-5">Live</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-8 rounded bg-white/5 animate-pulse" /></td></tr>
                                ))
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground">
                                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No attendance records found for this date.</p>
                                    </td>
                                </tr>
                            ) : (
                                records.map((record: any) => (
                                    <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-bold">{record.worker_name}</p>
                                                <p className="text-xs text-muted-foreground font-mono">{record.worker_code}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium">{record.plant_name}</p>
                                            <p className="text-[10px] text-muted-foreground">{record.contractor_name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold border",
                                                record.shift_type === "Day"
                                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                    : record.shift_type === "Night"
                                                        ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                                        : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                            )}>
                                                {record.shift_type?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-green-500">
                                                    <ArrowUpRight className="h-3 w-3" />
                                                    {record.checkin_time || '--:--'}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-400">
                                                    <ArrowDownRight className="h-3 w-3" />
                                                    {record.checkout_time || '--:--'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold">{record.total_hours ? `${record.total_hours} hrs` : '—'}</p>
                                            <p className="text-[10px] text-muted-foreground">of 12 hrs std</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.overtime_hours > 0 ? (
                                                <span className="text-primary font-bold text-sm">+{record.overtime_hours} hrs</span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <CircleDot className={cn("h-3 w-3", record.live_status === 'IN' ? 'text-green-500 animate-pulse' : 'text-muted-foreground')} />
                                                <span className={cn("text-xs font-bold", record.live_status === 'IN' ? "text-green-500" : "text-muted-foreground")}>
                                                    {record.live_status}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 bg-white/5 border-t border-white/10 flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        {total > 0 ? `Showing ${(page - 1) * 30 + 1}–${Math.min(page * 30, total)} of ${total} records` : 'No records'}
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm disabled:opacity-50">Previous</button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
