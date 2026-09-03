"use client";

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Tailwind only emits classes it can find written out in full in the source, so each
 * colour variant is a complete string here rather than being assembled from a prop.
 * (Assembling `bg-${color}/20` at runtime is why some cards had no icon tile.)
 */
const TONES = {
    primary: { tile: 'bg-primary/20 text-primary', ghost: 'text-primary' },
    green: { tile: 'bg-green-500/20 text-green-500', ghost: 'text-green-500' },
    red: { tile: 'bg-red-500/20 text-red-500', ghost: 'text-red-500' },
    amber: { tile: 'bg-amber-500/20 text-amber-500', ghost: 'text-amber-500' },
    blue: { tile: 'bg-blue-500/20 text-blue-500', ghost: 'text-blue-500' },
} as const;

export type StatTone = keyof typeof TONES;

export interface StatTrend {
    /** Change against the comparison period; the sign picks the arrow. */
    delta: number;
    /** What the delta is measured against, e.g. "vs yesterday". */
    label: string;
    /** Whether a rise is good news (present) or bad (absent). Drives the colour. */
    upIsGood?: boolean;
}

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    /** Omit when there is nothing real to compare against; a made-up pill is worse than none. */
    trend?: StatTrend;
    tone?: StatTone;
}

function TrendPill({ delta, label, upIsGood = true }: StatTrend) {
    if (delta === 0) {
        return (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-muted-foreground whitespace-nowrap">
                No change {label}
            </span>
        );
    }
    const good = delta > 0 ? upIsGood : !upIsGood;
    return (
        <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap',
            good ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        )}>
            {delta > 0 ? '+' : '−'}{Math.abs(delta)} {label}
        </span>
    );
}

export function StatCard({ title, value, subValue, icon: Icon, trend, tone = 'primary' }: StatCardProps) {
    const t = TONES[tone];
    return (
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:bg-white/10 transition-colors">
            {/* Decorative watermark, kept inside the card behind the empty bottom-right corner */}
            <div className={cn(
                'absolute -bottom-4 -right-4 h-24 w-24 opacity-[0.06] pointer-events-none group-hover:scale-110 transition-transform duration-500',
                t.ghost
            )}>
                <Icon className="h-full w-full" />
            </div>

            <div className="flex justify-between items-start mb-4 gap-2">
                <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center shrink-0', t.tile)}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && <TrendPill {...trend} />}
            </div>

            <div className="relative">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold">{value}</h3>
                    {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
                </div>
            </div>
        </div>
    );
}
