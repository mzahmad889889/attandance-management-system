"use client";

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Factory } from 'lucide-react';
import { PLANT_STATS } from '@/lib/mock-data';
import { CHART } from './chart-theme';

interface PlantChartProps {
    data?: { plant: string; total: number; active_now: number; capacity: number }[];
}

type Row = { name: string; workers: number; activeNow?: number };

const ROW_HEIGHT = 24;   // px per plant: room for an 11px label plus breathing space
const MIN_HEIGHT = 220;  // matches the weekly chart when there are only a few plants

/** Plot height for a given number of plants; exported so the chart beside it can match. */
export function plantChartHeight(rowCount: number): number {
    return Math.max(MIN_HEIGHT, rowCount * ROW_HEIGHT + 32);
}

export function PlantChart({ data }: PlantChartProps) {
    // Largest first so the chart reads as a ranking. One hue for every bar: length already
    // carries the value and the axis label carries identity, so a colour per plant said
    // nothing and ran out after four anyway.
    const rows: Row[] = (data && data.length > 0
        ? data.map(p => ({ name: p.plant, workers: p.total, activeNow: p.active_now }))
        : PLANT_STATS.map(p => ({ name: p.name, workers: p.workers }))
    ).sort((a, b) => b.workers - a.workers);

    const totalWorkers = rows.reduce((sum, r) => sum + r.workers, 0);
    const height = plantChartHeight(rows.length);

    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold">Plant Distribution</h3>
                    <p className="text-xs text-muted-foreground">{totalWorkers} workers across {rows.length} plants</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Factory className="h-5 w-5" />
                </div>
            </div>
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={rows} layout="vertical" barSize={12} margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                    <CartesianGrid horizontal={false} stroke={CHART.grid} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: CHART.inkMuted }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={112}
                        interval={0}
                        tick={{ fontSize: 11, fill: CHART.ink }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: CHART.hover }}
                        contentStyle={CHART.tooltip}
                        labelStyle={{ color: CHART.ink, fontWeight: 600 }}
                        itemStyle={{ color: CHART.inkMuted }}
                        formatter={(value: any, _name: any, item: any) => {
                            const active = item?.payload?.activeNow;
                            return [active === undefined ? `${value}` : `${value} (${active} inside now)`, 'Workers'];
                        }}
                    />
                    {/* No animation: see attendance-chart.tsx */}
                    <Bar dataKey="workers" name="Workers" fill={CHART.accent} radius={[0, 4, 4, 0]} isAnimationActive={false} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
