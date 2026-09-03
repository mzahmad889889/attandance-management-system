/**
 * Shared chart tokens for the dashboard.
 *
 * The chart surface is the glass card (60% card colour) over the page background. The
 * accent is one step darker than the brand orange because the brand step sits just above
 * the dark-mode lightness band; this one passes the band, chroma and 3:1 contrast checks.
 * The de-emphasis grey is for context series (e.g. Absent) and also clears 3:1.
 */
export const CHART = {
    accent: '#ea580c',
    deemphasis: '#64748b',
    surface: '#111a2e',
    ink: '#e2e8f0',
    inkMuted: '#94a3b8',
    grid: 'rgba(255,255,255,0.06)',
    hover: 'rgba(255,255,255,0.04)',
    tooltip: {
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        fontSize: 12,
    },
} as const;
