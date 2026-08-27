"use client";

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ATTENDANCE_STATS } from '@/lib/mock-data';

interface AttendanceChartProps {
    data?: { date?: string; day: string; present: number; absent: number }[];
}

export function AttendanceChart({ data }: AttendanceChartProps) {
    const chartData = data && data.length > 0
        ? data
        : ATTENDANCE_STATS.map(({ name, present, absent }) => ({ day: name, present, absent }));

    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold">Weekly Attendance</h3>
                    <p className="text-xs text-muted-foreground">Last 7 days overview</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={12} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12 }}
                        labelStyle={{ color: '#94a3b8' }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="present" name="Present" fill="#f97316" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
