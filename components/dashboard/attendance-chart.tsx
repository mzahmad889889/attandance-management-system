"use client";

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { ATTENDANCE_STATS } from '@/lib/mock-data';
import { CHART } from './chart-theme';

interface AttendanceChartProps {
    data?: { date?: string; day: string; present: number; absent: number }[];
    /** Plot height in px. The dashboard passes the plant chart's height so the two cards stay level. */
    height?: number;
}

export function AttendanceChart({ data, height = 220 }: AttendanceChartProps) {
    const chartData = data && data.length > 0
        ? data
        : ATTENDANCE_STATS.map(({ name, present, absent }) => ({ day: name, present, absent }));

    return (
        <div className="glass-card p-6 rounded-2xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold">Weekly Attendance</h3>
                    <p className="text-xs text-muted-foreground">Last 7 days, present vs absent per day</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <TrendingUp className="h-5 w-5" />
                </div>
            </div>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={chartData} barSize={14} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                        <CartesianGrid vertical={false} stroke={CHART.grid} />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: CHART.inkMuted }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: CHART.inkMuted }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip
                            cursor={{ fill: CHART.hover }}
                            contentStyle={CHART.tooltip}
                            labelStyle={{ color: CHART.inkMuted }}
                            itemStyle={{ color: CHART.ink }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => <span style={{ color: CHART.inkMuted }}>{value}</span>}
                        />
                        {/* Stacked so each day reads as one headcount; present is the story, absent is context.
                            The thin surface-coloured stroke is the gap between the two segments. No animation:
                            the data refreshes every 30s and bars re-growing each time is noise, and an
                            interrupted animation leaves bars at a stale size. */}
                        <Bar dataKey="present" name="Present" stackId="day" fill={CHART.accent} stroke={CHART.surface} strokeWidth={1} isAnimationActive={false} />
                        <Bar dataKey="absent" name="Absent" stackId="day" fill={CHART.deemphasis} stroke={CHART.surface} strokeWidth={1} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
