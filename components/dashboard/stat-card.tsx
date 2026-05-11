"use client";

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    color?: string;
}

export function StatCard({ title, value, subValue, icon: Icon, trend, color }: StatCardProps) {
    return (
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:bg-white/10 transition-colors">
            <div className={cn(
                "absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 opacity-10 group-hover:scale-110 transition-transform duration-500",
                color || "text-primary"
            )}>
                <Icon className="h-full w-full" />
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center",
                    color ? `bg-${color}/20 text-${color}` : "bg-primary/20 text-primary"
                )}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        trend.isUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                    )}>
                        {trend.isUp ? '+' : '-'}{trend.value}
                    </span>
                )}
            </div>

            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold">{value}</h3>
                    {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
                </div>
            </div>
        </div>
    );
}
