"use client";

import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  Factory,
  Zap,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { PlantChart } from '@/components/dashboard/plant-chart';
import { MOCK_WORKERS, PLANTS } from '@/lib/mock-data';

export default function DashboardPage() {
  const totalWorkers = MOCK_WORKERS.length;
  const presentWorkers = MOCK_WORKERS.filter(w => w.status === 'Present').length;
  const absentWorkers = totalWorkers - presentWorkers;
  const insidePlants = MOCK_WORKERS.filter(w => w.liveStatus === 'IN').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Main Dashboard</h2>
          <p className="text-muted-foreground">Industrial management overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium">System Live</span>
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Workers"
          value={totalWorkers}
          icon={Users}
          trend={{ value: 'Active Now', isUp: true }}
        />
        <StatCard
          title="Present Today"
          value={presentWorkers}
          subValue={`/ ${totalWorkers}`}
          icon={UserCheck}
          trend={{ value: '92%', isUp: true }}
          color="green-500"
        />
        <StatCard
          title="Absent Workers"
          value={absentWorkers}
          icon={UserPlus}
          trend={{ value: 'Decrease', isUp: false }}
          color="red-500"
        />
        <StatCard
          title="Overtime Hours"
          value="428.5"
          subValue="Total today"
          icon={Clock}
          trend={{ value: '12%', isUp: true }}
          color="amber-500"
        />
        <StatCard
          title="Active Plants"
          value={PLANTS.length}
          subValue="All operational"
          icon={Factory}
        />
        <StatCard
          title="Live Inside Plant"
          value={insidePlants}
          subValue="Real-time head count"
          icon={Activity}
          color="blue-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AttendanceChart />
        <PlantChart />
      </div>

      {/* Bottom Grid: Activity Feed & Plant Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Live Activity Feed
            </h3>
            <button className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center relative">
                  <UserCheck className="h-5 w-5 text-green-500" />
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-slate-900" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Worker {i * 34} checked IN at Plant {i % 3 + 1}</p>
                  <p className="text-[10px] text-muted-foreground">Contractor: Apex Industrial • 2 mins ago</p>
                </div>
                <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Avatar" className="h-full w-auto object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plant Status */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-6">Plant Health</h3>
          <div className="space-y-4">
            {PLANTS.map((plant) => (
              <div key={plant.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold">{plant.name}</h4>
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">OPTIMAL</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Utilization</span>
                    <span>{Math.round((plant.activeWorkers / plant.capacity) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(plant.activeWorkers / plant.capacity) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Inside: <span className="text-white font-bold">{plant.activeWorkers}</span></span>
                  <span className="text-muted-foreground">Capacity: <span className="text-white font-bold">{plant.capacity}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
