"use client";

import React from 'react';
import {
    RadialBarChart, RadialBar, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { Factory } from 'lucide-react';
import { PLANT_STATS } from '@/lib/mock-data';

interface PlantChartProps {
    data?: { plant: string; total: number; active_now: number; capacity: number }[];
}

const COLORS = ['#f97316', '#60a5fa', '#34d399', '#a78bfa'];

export function PlantChart({ data }: PlantChartProps) {
    const chartData = data && data.length > 0
        ? data.map((p, i) => ({ name: p.plant, workers: p.total, fill: COLORS[i % COLORS.length] }))
        : PLANT_STATS.map((p, i) => ({ ...p, fill: COLORS[i % COLORS.length] }));

    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold">Plant Distribution</h3>
                    <p className="text-xs text-muted-foreground">Workers per plant</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Factory className="h-5 w-5" />
                </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="30%"
                    outerRadius="90%"
                    barSize={14}
                    data={chartData}
                >
                    <RadialBar
                        background={{ fill: 'rgba(255,255,255,0.03)' }}
                        dataKey="workers"
                        cornerRadius={6}
                        label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
                    />
                    <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    );
}
