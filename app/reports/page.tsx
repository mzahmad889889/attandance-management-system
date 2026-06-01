"use client";

import React, { useState, useEffect } from 'react';
import {
    FileText, Download, TrendingUp, PieChart, BarChart3, Calendar,
    ArrowRight, Clock, Users, Zap, FileSpreadsheet, Loader2
} from 'lucide-react';
import { reportsApi, workersApi } from '@/lib/api';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';

export default function ReportsPage() {
    const [summary, setSummary] = useState<any>(null);
    const [meta, setMeta] = useState<{ plants: any[] }>({ plants: [] });
    const [exporting, setExporting] = useState(false);
    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
    });
    const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
    const [plantId, setPlantId] = useState('');

    useEffect(() => {
        reportsApi.summary().then(setSummary).catch(() => { });
        workersApi.meta().then((m: any) => setMeta({ plants: m.plants || [] })).catch(() => { });
    }, []);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await reportsApi.exportExcel({ date_from: dateFrom, date_to: dateTo, plant_id: plantId || undefined });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendance_${dateFrom}_to_${dateTo}.xlsx`;
            a.click();
        } catch {
            alert('Export failed. Make sure the backend is running (python app.py).');
        } finally {
            setExporting(false);
        }
    };

    const chartData = summary?.chart_data || [];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
                    <p className="text-muted-foreground">Export attendance data and view insights</p>
                </div>
            </div>

            {/* Export Tool */}
            <div className="glass-card p-8 rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3 mb-6">
                    <FileSpreadsheet className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold text-primary">Excel Export Tool</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date From</label>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Date To</label>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Plant</label>
                        <select value={plantId} onChange={e => setPlantId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm appearance-none">
                            <option value="">All Plants</option>
                            {meta.plants.map((p: any) => (
                                <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button onClick={handleExport} disabled={exporting}
                            className="w-full bg-primary text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/20">
                            {exporting ? <><Loader2 className="h-4 w-4 animate-spin" /> Exporting...</> : <><Download className="h-4 w-4" /> Export Excel</>}
                        </button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Exports attendance records with check-in/out times, total hours, overtime, and status for the selected date range.
                    Requires backend to be running.
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Monthly OT Hours', value: summary?.monthly_overtime_hours?.toFixed(1) ?? '—', icon: Zap, color: 'text-amber-500' },
                    { label: 'Plants Tracked', value: meta.plants.length || '—', icon: BarChart3, color: 'text-blue-500' },
                    { label: 'System Status', value: 'LIVE', icon: TrendingUp, color: 'text-green-500' },
                    { label: 'Export Formats', value: 'Excel', icon: FileText, color: 'text-primary' },
                ].map(s => (
                    <div key={s.label} className="glass-card p-5 rounded-2xl">
                        <s.icon className={`h-6 w-6 ${s.color} mb-3`} />
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">{s.label}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold mb-4">7-Day Attendance Trend</h3>
                    <AttendanceChart data={chartData} />
                </div>

                {/* Plant Breakdown */}
                <div>
                    <h3 className="text-lg font-bold mb-4">Plant Breakdown</h3>
                    <div className="space-y-3">
                        {(summary?.plant_breakdown || []).map((p: any) => (
                            <div key={p.plant} className="glass-card p-4 rounded-2xl flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                    {p.plant?.charAt(p.plant.length - 1)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold">{p.plant}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${p.capacity ? (p.total / p.capacity) * 100 : 0}%` }} />
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">{p.total}/{p.capacity}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-green-500">{p.active_now} IN</span>
                                </div>
                            </div>
                        ))}
                        {(!summary?.plant_breakdown || summary.plant_breakdown.length === 0) && (
                            <div className="text-center py-8 text-muted-foreground text-sm">Connect backend to see plant data</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
