"use client";

import React from 'react';
import {
    FileText,
    Download,
    TrendingUp,
    PieChart,
    BarChart3,
    Calendar,
    ArrowRight,
    Clock,
    Users,
    Zap
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';

const REPORTS = [
    { title: 'Monthly Attendance Summary', category: 'Attendance', date: 'May 01 - May 31', format: 'PDF, CSV', icon: FileText },
    { title: 'Shift Rotation Efficiency', category: 'Operations', date: 'April 2024', format: 'Excel', icon: Zap },
    { title: 'Contractor Performance Audit', category: 'Management', date: 'Q2 2024', format: 'PDF', icon: BarChart3 },
    { title: 'Overtime Expenditure Report', category: 'Finance', date: 'Current Week', format: 'CSV', icon: Clock },
    { title: 'Worker Distribution Heatmap', category: 'Logistics', date: 'May 2024', format: 'Interactive', icon: PieChart },
    { title: 'Safety Compliance Analytics', category: 'Compliance', date: 'Annual 2023', format: 'PDF', icon: TrendingUp },
];

export default function ReportsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Intelligence & Reports</h2>
                    <p className="text-muted-foreground">Detailed analytics and boardroom-ready documentation</p>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Schedule New
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-3xl border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <TrendingUp className="h-8 w-8 text-primary mb-4" />
                    <p className="text-sm font-bold opacity-80 mb-1">DATA INSIGHTS</p>
                    <h4 className="text-2xl font-bold">128 Reports</h4>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-2 uppercase">Processed this year</p>
                </div>
                <div className="glass-card p-6 rounded-3xl">
                    <Download className="h-8 w-8 text-blue-500 mb-4" />
                    <p className="text-sm font-bold opacity-80 mb-1">DOWNLOADS</p>
                    <h4 className="text-2xl font-bold">1.2 TB</h4>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-2 uppercase">Archives generated</p>
                </div>
                <div className="glass-card p-6 rounded-3xl">
                    <Users className="h-8 w-8 text-green-500 mb-4" />
                    <p className="text-sm font-bold opacity-80 mb-1">USERS</p>
                    <h4 className="text-2xl font-bold">42 Admins</h4>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-2 uppercase">Requesting data</p>
                </div>
                <div className="glass-card p-6 rounded-3xl">
                    <Clock className="h-8 w-8 text-amber-500 mb-4" />
                    <p className="text-sm font-bold opacity-80 mb-1">REAL-TIME</p>
                    <h4 className="text-2xl font-bold">2.4 sec</h4>
                    <p className="text-[10px] text-muted-foreground font-bold tracking-widest mt-2 uppercase">Avg query speed</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Available Report Modules</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {REPORTS.map((report, i) => (
                            <div key={i} className="glass-card p-5 rounded-2xl flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                        <report.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{report.title}</h4>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{report.category} • {report.date}</p>
                                    </div>
                                </div>
                                <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold">Data Visualization Templates</h3>
                    <div className="glass-card p-6 rounded-[2rem] h-[400px] flex items-center justify-center border-dashed border-white/20">
                        <div className="text-center space-y-4">
                            <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                                <PieChart className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <div>
                                <p className="font-bold text-muted-foreground">Preview Engine Offline</p>
                                <p className="text-xs text-muted-foreground/60">Selected report preview currently initializing...</p>
                            </div>
                            <button className="px-6 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary/20">
                                Initialize Preview
                            </button>
                        </div>
                    </div>

                    <div className="p-6 glass-card rounded-3xl border border-amber-500/10 bg-amber-500/5">
                        <h4 className="text-sm font-bold flex items-center gap-2 text-amber-500 mb-2">
                            <TrendingUp className="h-4 w-4" /> Seasonal Adjustment Notice
                        </h4>
                        <p className="text-xs leading-relaxed opacity-80">
                            Please note that upcoming June reports will automatically incorporate seasonal shift adjustments for extreme heat conditions in Plant P01 and P03.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
