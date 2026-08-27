"use client";

import React, { useState, useEffect } from 'react';
import {
    History as HistoryIcon, Search, Calendar, User, Download,
    FileSpreadsheet, Loader2, ArrowRight, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';
import { workersApi, reportsApi, SERVER_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [workers, setWorkers] = useState<any[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Search workers as the user types
    useEffect(() => {
        if (!searchTerm) {
            setWorkers([]);
            return;
        }
        const t = setTimeout(async () => {
            setLoading(true);
            try {
                const res: any = await workersApi.list({ search: searchTerm });
                setWorkers(res.workers || []);
            } catch {
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const selectWorker = async (worker: any) => {
        setSelectedWorker(worker);
        setLoadingHistory(true);
        try {
            const res: any = await reportsApi.request(`/reports/worker/${worker.id}/history`);
            setHistory(res.history || []);
        } catch {
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleExport = async () => {
        if (!selectedWorker) return;
        setExporting(true);
        try {
            const res = await reportsApi.requestBlob(`/reports/worker/${selectedWorker.id}/export`);
            const url = URL.createObjectURL(res);
            const a = document.createElement('a');
            a.href = url;
            a.download = `History_${selectedWorker.worker_code}.xlsx`;
            a.click();
        } catch (e) {
            alert('Failed to export. Check if backend is running.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Worker History Records</h2>
                <p className="text-muted-foreground">Search personnel to view 30-day detailed logs and download reports</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Search & Roster */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 rounded-[2rem] border border-white/10">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Find Personnel</label>
                        <div className="relative mb-6">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name or W-code..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                            />
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {workers.map((w) => (
                                <button
                                    key={w.id}
                                    onClick={() => selectWorker(w)}
                                    className={cn(
                                        "w-full p-4 rounded-2xl flex items-center justify-between transition-all border",
                                        selectedWorker?.id === w.id
                                            ? "bg-primary border-primary shadow-lg shadow-primary/20"
                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                    )}
                                >
                                    <div className="text-left">
                                        <p className={cn("text-sm font-bold", selectedWorker?.id === w.id ? "text-white" : "text-white")}>{w.name}</p>
                                        <p className={cn("text-[10px] font-mono", selectedWorker?.id === w.id ? "text-white/80" : "text-muted-foreground")}>{w.worker_code} • {w.plant_name}</p>
                                    </div>
                                    <ArrowRight className={cn("h-4 w-4", selectedWorker?.id === w.id ? "text-white" : "text-muted-foreground")} />
                                </button>
                            ))}
                            {!searchTerm && <p className="text-center py-8 text-xs text-muted-foreground italic">Type to search for a worker</p>}
                            {searchTerm && workers.length === 0 && !loading && <p className="text-center py-8 text-xs text-muted-foreground">No matches found</p>}
                        </div>
                    </div>
                </div>

                {/* Right: History View */}
                <div className="lg:col-span-8">
                    {!selectedWorker ? (
                        <div className="h-full min-h-[500px] glass-card rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12">
                            <HistoryIcon className="h-12 w-12 text-white/10 mb-4" />
                            <p className="font-bold text-lg mb-1">Select a worker</p>
                            <p className="text-muted-foreground text-sm max-w-xs">Identify a personnel from the left panel to view their detailed 30-day attendance history.</p>
                        </div>
                    ) : (
                        <div className="glass-card rounded-[3rem] overflow-hidden border border-white/10 h-full flex flex-col">
                            {/* Worker Header */}
                            <div className="p-8 border-b border-white/10 bg-gradient-to-br from-primary/10 to-transparent flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-20 w-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {selectedWorker.photo_url ? (
                                            <img src={`${SERVER_URL}${selectedWorker.photo_url}`} alt="P" className="h-full w-full object-cover" />
                                        ) : (
                                            <User className="h-10 w-10 text-white/20" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{selectedWorker.name}</h3>
                                        <p className="text-primary font-mono font-bold tracking-widest">{selectedWorker.worker_code}</p>
                                        <p className="text-xs text-muted-foreground">{selectedWorker.plant_name} • {selectedWorker.contractor_name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleExport}
                                    disabled={exporting}
                                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all border border-white/10 disabled:opacity-50"
                                >
                                    {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                    Monthly Report
                                </button>
                            </div>

                            {/* History Table */}
                            <div className="flex-1 overflow-auto max-h-[600px]">
                                {loadingHistory ? (
                                    <div className="py-24 flex flex-col items-center gap-3">
                                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                        <p className="text-xs text-muted-foreground italic">Fetching history logs...</p>
                                    </div>
                                ) : history.length === 0 ? (
                                    <div className="py-24 text-center text-muted-foreground italic">No logs found for the last 30 days</div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className="sticky top-0 bg-slate-900/80 backdrop-blur-md z-10">
                                            <tr className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest border-b border-white/5">
                                                <th className="px-8 py-4">Date</th>
                                                <th className="px-8 py-4">Shift</th>
                                                <th className="px-8 py-4">Timing</th>
                                                <th className="px-8 py-4">Duration</th>
                                                <th className="px-8 py-4">Overtime</th>
                                                <th className="px-8 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {history.map((record) => (
                                                <tr key={record.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-8 py-5">
                                                        <p className="text-sm font-bold">{new Date(record.date).toLocaleDateString([], { day: 'numeric', month: 'short' })}</p>
                                                        <p className="text-[10px] text-muted-foreground">{new Date(record.date).toLocaleDateString([], { weekday: 'long' })}</p>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className={cn(
                                                            "px-2 py-1 rounded text-[10px] font-bold",
                                                            record.shift_type === 'Day' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                                                        )}>
                                                            {record.shift_type.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 font-mono text-xs">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <ArrowUpRight className="h-3 w-3 text-green-500" /> {record.checkin_time || '--:--'}
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-50">
                                                            <ArrowDownRight className="h-3 w-3 text-red-400" /> {record.checkout_time || '--:--'}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <p className="text-sm font-bold">{record.total_hours}h</p>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        {record.overtime_hours > 0 ? (
                                                            <span className="text-xs font-bold text-primary">+{record.overtime_hours}h</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="px-2 py-1 bg-white/5 text-[10px] font-bold uppercase rounded border border-white/10">{record.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
