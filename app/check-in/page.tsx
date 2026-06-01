"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    ScanFace, History, CheckCircle2, Clock, AlertTriangle, Database,
    Camera, ArrowUpRight, ArrowDownRight, RefreshCcw, Zap, Shield
} from 'lucide-react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { faceApi, attendanceApi } from '@/lib/api';
import { cn } from '@/lib/utils';

type Mode = 'checkin' | 'checkout';

export default function CheckInPage() {
    const webcamRef = useRef<Webcam>(null);
    const [mode, setMode] = useState<Mode>('checkin');
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [recentFeed, setRecentFeed] = useState<any[]>([]);
    const [isLive, setIsLive] = useState(false);
    const liveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [engineStatus, setEngineStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Update clock every second
        const t = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        // Check AI engine status
        faceApi.status().then((s: any) => {
            setEngineStatus(s.available ? 'online' : 'offline');
        }).catch(() => setEngineStatus('offline'));

        // Load recent feed
        attendanceApi.liveFeed().then((f: any) => setRecentFeed(f.records || [])).catch(() => { });
    }, []);

    const capture = useCallback(async () => {
        const img = webcamRef.current?.getScreenshot();
        if (!img) { setError('Could not capture frame from camera.'); return; }

        setProcessing(true);
        setResult(null);
        setError('');

        try {
            const res: any = await faceApi.recognize(img, mode);
            setResult(res);
            if (res.match) {
                // Refresh live feed
                attendanceApi.liveFeed().then((f: any) => setRecentFeed(f.records || [])).catch(() => { });
            }
        } catch (e: any) {
            setError(e.message || 'Recognition failed');
        } finally {
            setProcessing(false);
        }
    }, [mode]);

    // Auto-scan every 3 seconds when live mode is on
    useEffect(() => {
        if (isLive) {
            liveTimerRef.current = setInterval(capture, 3000);
        } else {
            if (liveTimerRef.current) clearInterval(liveTimerRef.current);
        }
        return () => { if (liveTimerRef.current) clearInterval(liveTimerRef.current); };
    }, [isLive, capture]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Face Check-In / Out</h2>
                    <p className="text-muted-foreground">AI biometrics attendance terminal — DeepFace / InsightFace</p>
                </div>
                <div className="text-right">
                    <h3 className="text-2xl font-mono font-bold tracking-tighter">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest">
                        {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>

            {/* Engine Status Banner */}
            <div className={cn(
                "px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold border",
                engineStatus === 'online'
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : engineStatus === 'offline'
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            )}>
                <span className={cn("h-2 w-2 rounded-full", engineStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500')} />
                {engineStatus === 'checking' ? 'Checking AI engine...' :
                    engineStatus === 'online' ? 'AI Face Recognition Engine: ONLINE' :
                        'AI Engine OFFLINE — start backend: python app.py (port 5000)'}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Camera */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Mode selector */}
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                        {(['checkin', 'checkout'] as Mode[]).map(m => (
                            <button key={m} onClick={() => { setMode(m); setResult(null); setError(''); }}
                                className={cn(
                                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                    mode === m ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-white/5"
                                )}
                            >
                                {m === 'checkin' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                {m === 'checkin' ? 'CHECK IN' : 'CHECK OUT'}
                            </button>
                        ))}
                    </div>

                    {/* Camera View */}
                    <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <div className="relative aspect-video bg-black">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{ facingMode: "user", width: 640, height: 480 }}
                                className="h-full w-full object-cover"
                            />

                            {/* Scanning overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 border-2 border-primary/60 rounded-3xl" />
                                <motion.div
                                    animate={{ top: ['25%', '75%', '25%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-1/2 -translate-x-1/2 w-52 h-0.5 bg-primary shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                                />
                                {isLive && (
                                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-red-500/80 text-white text-[10px] font-bold animate-pulse">
                                        ● LIVE
                                    </div>
                                )}
                            </div>

                            {/* Processing overlay */}
                            <AnimatePresence>
                                {processing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
                                    >
                                        <RefreshCcw className="h-10 w-10 text-primary animate-spin" />
                                        <p className="text-sm font-bold tracking-widest text-primary">IDENTIFYING...</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Result toast */}
                            <AnimatePresence>
                                {result && !processing && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className={cn(
                                            "absolute inset-x-3 bottom-3 p-4 rounded-2xl flex items-center gap-3 shadow-xl",
                                            result.match ? "bg-green-500" : "bg-red-500/90"
                                        )}
                                    >
                                        {result.match ? (
                                            <>
                                                <CheckCircle2 className="h-6 w-6 text-white shrink-0" />
                                                <div className="text-white">
                                                    <p className="font-bold leading-tight">{result.worker?.name}</p>
                                                    <p className="text-[11px] opacity-90">
                                                        {result.already_checked_in ? 'Already checked in' :
                                                            result.not_checked_in ? 'Not checked in today' :
                                                                `${mode === 'checkin' ? 'Check-In' : 'Check-Out'} successful`}
                                                        {' '}• {(result.confidence * 100).toFixed(1)}% match
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-6 w-6 text-white shrink-0" />
                                                <div className="text-white">
                                                    <p className="font-bold leading-tight">No Match Found</p>
                                                    <p className="text-[11px] opacity-90">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-4 space-y-3">
                            {error && (
                                <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                                    {error}
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={capture}
                                    disabled={processing || engineStatus !== 'online'}
                                    className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                >
                                    <ScanFace className="h-5 w-5" />
                                    Scan & {mode === 'checkin' ? 'Check In' : 'Check Out'}
                                </button>
                                <button
                                    onClick={() => setIsLive(!isLive)}
                                    className={cn(
                                        "px-4 rounded-2xl font-bold text-sm transition-all border",
                                        isLive
                                            ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                                            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                    )}
                                >
                                    <Zap className="h-5 w-5" />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground">
                                {isLive ? '⚡ Auto-scanning every 3 seconds (Live Mode)' : 'Click "Scan" or enable ⚡ Live Mode for continuous detection'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live History */}
                <div className="lg:col-span-7">
                    <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="text-base font-bold flex items-center gap-2">
                                <History className="h-5 w-5 text-primary" />
                                Today's Activity Feed
                            </h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20">LIVE FEED</span>
                                <button onClick={() => attendanceApi.liveFeed().then((f: any) => setRecentFeed(f.records || [])).catch(() => { })}
                                    className="p-1 hover:bg-white/10 rounded-lg">
                                    <RefreshCcw className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-auto max-h-[calc(100vh-22rem)]">
                            {recentFeed.length === 0 ? (
                                <div className="p-12 text-center text-muted-foreground">
                                    <Shield className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm font-medium">No check-ins yet today</p>
                                    <p className="text-xs mt-1">Start scanning workers to see the live feed</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-muted-foreground font-bold border-b border-white/10">
                                            <th className="px-5 py-3">Worker</th>
                                            <th className="px-5 py-3">Plant / Shift</th>
                                            <th className="px-5 py-3">Time</th>
                                            <th className="px-5 py-3">Event</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {recentFeed.map((rec: any) => (
                                            <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-5 py-3">
                                                    <p className="text-sm font-bold">{rec.worker_name}</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono">{rec.worker_code}</p>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <p className="text-xs font-bold">{rec.plant_name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{rec.shift_type}</p>
                                                </td>
                                                <td className="px-5 py-3 font-mono text-xs">
                                                    {rec.checkin_time || '--:--'}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={cn(
                                                        "px-2 py-1 rounded-md text-[10px] font-bold",
                                                        rec.live_status === 'IN'
                                                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                                                    )}>
                                                        {rec.live_status === 'IN' ? 'CHECK-IN' : 'CHECK-OUT'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
