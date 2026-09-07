"use client";

import React, { useEffect, useState } from 'react';
import {
  Users, UserCheck, UserPlus, Clock, Factory, Zap, ChevronRight, Activity, Download, Loader2
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { PlantChart } from '@/components/dashboard/plant-chart';
import { attendanceApi, reportsApi, workersApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ plants: any[]; contractors: any[] }>({ plants: [], contractors: [] });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [plantId, setPlantId] = useState('');
  const [contractorId, setContractorId] = useState('');
  const [shift, setShift] = useState('');

  useEffect(() => {
    Promise.all([
      attendanceApi.todayStats(),
      reportsApi.summary(),
      attendanceApi.liveFeed(),
      workersApi.meta(),
    ]).then(([s, sum, feed, workerMeta]: any[]) => {
      setStats(s);
      setSummary(sum);
      setLiveFeed(feed.records || []);
      setMeta({
        plants: workerMeta?.plants || [],
        contractors: workerMeta?.contractors || [],
      });
    }).catch(() => { }).finally(() => setLoading(false));

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      attendanceApi.todayStats().then((s: any) => setStats(s)).catch(() => { });
      attendanceApi.liveFeed().then((f: any) => setLiveFeed(f.records || [])).catch(() => { });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      alert('From date cannot be later than To date.');
      return;
    }

    setExporting(true);
    try {
      const res = await reportsApi.exportExcel({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        plant_id: plantId || undefined,
        contractor_id: contractorId || undefined,
        shift: shift || undefined,
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${dateFrom || 'all'}_to_${dateTo || 'all'}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed – start the backend first');
    } finally {
      setExporting(false);
    }
  };

  const chartData = summary?.chart_data || [];
  const plantData = summary?.plant_breakdown || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Main Dashboard</h2>
          <p className="text-muted-foreground">Industrial management overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex flex-col gap-3 xl:items-end">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 w-fit">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium">System Live</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2 w-full xl:max-w-[900px]">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 outline-none focus:ring-2 ring-primary/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 outline-none focus:ring-2 ring-primary/30 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Plant</label>
              <select
                value={plantId}
                onChange={(e) => setPlantId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 outline-none focus:ring-2 ring-primary/30 text-sm"
              >
                <option value="">All Plants</option>
                {meta.plants.map((plant: any) => (
                  <option key={plant.id} value={plant.id}>{plant.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contractor</label>
              <select
                value={contractorId}
                onChange={(e) => setContractorId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 outline-none focus:ring-2 ring-primary/30 text-sm"
              >
                <option value="">All Contractors</option>
                {meta.contractors.map((contractor: any) => (
                  <option key={contractor.id} value={contractor.id}>{contractor.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shift</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 outline-none focus:ring-2 ring-primary/30 text-sm"
              >
                <option value="">All Shifts</option>
                <option value="Day">Day</option>
                <option value="Night">Night</option>
                <option value="Rest">Rest</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 w-fit"
          >
            {exporting ? <><Loader2 className="h-4 w-4 animate-spin" /> Exporting...</> : <><Download className="h-4 w-4" /> Export Excel</>}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Workers"
          value={loading ? '…' : (stats?.total_workers ?? '—')}
          icon={Users}
          trend={{ value: 'Active Now', isUp: true }}
        />
        <StatCard
          title="Present Today"
          value={loading ? '…' : (stats?.present_today ?? '—')}
          subValue={stats ? `/ ${stats.total_workers}` : ''}
          icon={UserCheck}
          trend={{ value: stats ? `${Math.round((stats.present_today / stats.total_workers) * 100)}%` : '—', isUp: true }}
          color="green-500"
        />
        <StatCard
          title="Absent Workers"
          value={loading ? '…' : (stats?.absent_today ?? '—')}
          icon={UserPlus}
          trend={{ value: 'Decrease', isUp: false }}
          color="red-500"
        />
        <StatCard
          title="Overtime Hours"
          value={loading ? '…' : (stats?.total_overtime_hours?.toFixed(1) ?? '0')}
          subValue="Total today"
          icon={Clock}
          trend={{ value: 'hrs', isUp: true }}
          color="amber-500"
        />
        <StatCard
          title="Active Plants"
          value={plantData.length || 4}
          subValue="All operational"
          icon={Factory}
        />
        <StatCard
          title="Live Inside Plant"
          value={loading ? '…' : (stats?.live_in ?? '—')}
          subValue="Real-time head count"
          icon={Activity}
          color="blue-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AttendanceChart data={chartData} />
        <PlantChart data={plantData} />
      </div>

      {/* Bottom Grid: Activity Feed & Plant Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Live Activity Feed
            </h3>
            <a href="/check-in" className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
              View Check-In <ChevronRight className="h-3 w-3" />
            </a>
          </div>
          <div className="space-y-4">
            {liveFeed.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {loading ? 'Loading feed...' : 'No activity today yet. Connect backend to see live data.'}
              </div>
            ) : (
              liveFeed.slice(0, 8).map((rec: any) => (
                <div key={rec.id} className="flex items-center gap-4 group cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center relative ${rec.live_status === 'IN' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <UserCheck className={`h-5 w-5 ${rec.live_status === 'IN' ? 'text-green-500' : 'text-red-400'}`} />
                    <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border-2 border-slate-900 ${rec.live_status === 'IN' ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rec.worker_name} — {rec.live_status === 'IN' ? 'checked IN' : 'checked OUT'} at {rec.plant_name}</p>
                    <p className="text-[10px] text-muted-foreground">{rec.contractor_name} • {rec.checkin_time || rec.checkout_time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Plant Status */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6">Plant Health</h3>
          <div className="space-y-4">
            {plantData.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">Connect backend to see data</p>
            ) : (
              plantData.map((plant: any) => (
                <div key={plant.plant} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold">{plant.plant}</h4>
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Utilization</span>
                      <span>{plant.capacity ? Math.round((plant.active_now / plant.capacity) * 100) : 0}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: plant.capacity ? `${Math.min(100, Math.round((plant.active_now / plant.capacity) * 100))}%` : '0%' }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Inside: <span className="text-white font-bold">{plant.active_now}</span></span>
                    <span className="text-muted-foreground">Total: <span className="text-white font-bold">{plant.total}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
