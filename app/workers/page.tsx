"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
    Search, UserPlus, Filter, Trash2, RefreshCw, Tag, MapPin, Edit2
} from 'lucide-react';
import { workersApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AddWorkerModal } from '@/components/workers/add-worker-modal';

export default function WorkersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<any | null>(null);
    const [workers, setWorkers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [plantFilter, setPlantFilter] = useState('');
    const [shiftFilter, setShiftFilter] = useState('');
    const [meta, setMeta] = useState<{ plants: any[]; contractors: any[] }>({ plants: [], contractors: [] });

    const fetchWorkers = useCallback(async () => {
        setLoading(true);
        try {
            const res: any = await workersApi.list({
                page,
                per_page: 24,
                search: searchTerm,
                plant_id: plantFilter,
                shift: shiftFilter,
            });
            setWorkers(res.workers || []);
            setTotalPages(res.pages || 1);
            setTotal(res.total || 0);
        } catch {
            // fallback silently
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm, plantFilter, shiftFilter]);

    useEffect(() => {
        workersApi.meta().then((m: any) => setMeta(m)).catch(() => { });
    }, []);

    useEffect(() => {
        const t = setTimeout(fetchWorkers, 300);
        return () => clearTimeout(t);
    }, [fetchWorkers]);

    const handleAddWorker = async (newWorker: any) => {
        try {
            const res = await workersApi.create(newWorker);
            fetchWorkers();
            return res; // Important: return the result so modal gets worker ID
        } catch (e: any) {
            throw e; // Modal handles the error UI
        }
    };

    const handleUpdateWorker = async (id: number, data: any) => {
        try {
            const res = await workersApi.update(id, data);
            fetchWorkers();
            return res;
        } catch (e: any) {
            throw e;
        }
    };

    const handleDeleteWorker = async (id: number) => {
        if (!confirm('Are you sure you want to deactivate this worker?')) return;
        try {
            await workersApi.delete(id);
            fetchWorkers();
        } catch (e: any) {
            alert(e.message || 'Failed to delete worker');
        }
    };

    const shiftColor = (s: string) => {
        if (s === 'Day') return 'text-amber-500 bg-amber-500/10';
        if (s === 'Night') return 'text-indigo-400 bg-indigo-500/10';
        return 'text-slate-400 bg-white/5';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AddWorkerModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingWorker(null); }}
                onAdd={handleAddWorker}
                onUpdate={handleUpdateWorker}
                worker={editingWorker}
                meta={meta}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Worker Directory</h2>
                    <p className="text-muted-foreground">
                        {total} workers registered across {meta.plants.length || 4} plants
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2"
                >
                    <UserPlus className="h-4 w-4" /> Add New Worker
                </button>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name or worker code..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={plantFilter}
                        onChange={e => { setPlantFilter(e.target.value); setPage(1); }}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
                    >
                        <option value="">All Plants</option>
                        {meta.plants.map((p: any) => (
                            <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                        ))}
                    </select>
                    <select
                        value={shiftFilter}
                        onChange={e => { setShiftFilter(e.target.value); setPage(1); }}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
                    >
                        <option value="">All Shifts</option>
                        <option value="Day" className="bg-slate-900">Day</option>
                        <option value="Night" className="bg-slate-900">Night</option>
                        <option value="Rest" className="bg-slate-900">Rest</option>
                    </select>
                    <button onClick={fetchWorkers} className="p-2 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10">
                        <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading && workers.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="glass-card p-6 rounded-[2rem] h-64 animate-pulse bg-white/5" />
                    ))}
                </div>
            ) : workers.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                    <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No workers found</p>
                    <p className="text-sm mt-1">Add workers or connect the backend</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {workers.map((worker: any) => (
                        <div key={worker.id} className="glass-card p-6 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="relative">
                                    <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-all bg-white/5 flex items-center justify-center">
                                        {worker.photo_url ? (
                                            <img
                                                src={`http://localhost:5000${worker.photo_url}`}
                                                alt={worker.name}
                                                className="h-full w-full object-cover"
                                                onError={(e: any) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold text-primary/50">{worker.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900",
                                        worker.live_status === 'IN' ? "bg-green-500" : "bg-slate-600"
                                    )} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingWorker(worker); setIsModalOpen(true); }}
                                        className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-white transition-colors"
                                        title="Edit Worker"
                                    >
                                        <Edit2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWorker(worker.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-full group/del transition-colors text-muted-foreground hover:text-red-500"
                                        title="Delete Worker"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg mb-0.5 truncate">{worker.name}</h3>
                            <p className="text-primary font-mono text-xs font-bold tracking-widest mb-4">{worker.worker_code}</p>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> Plant
                                    </span>
                                    <span className="text-white truncate max-w-[110px]">{worker.plant_name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-muted-foreground">Contractor</span>
                                    <span className="text-white truncate max-w-[100px]">{worker.contractor_name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-muted-foreground">Shift</span>
                                    <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold", shiftColor(worker.shift_type))}>
                                        {worker.shift_type ? worker.shift_type.toUpperCase() : 'UNASSIGNED'}
                                    </span>
                                </div>
                                {worker.live_status === 'IN' && worker.checkin_time && (
                                    <div className="flex items-center justify-between text-xs font-medium">
                                        <span className="text-muted-foreground">Checked In</span>
                                        <span className="text-green-500 font-mono font-bold">{worker.checkin_time}</span>
                                    </div>
                                )}
                                {!worker.has_face && (
                                    <div className="flex items-center gap-1.5 text-[10px] text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
                                        <Tag className="h-3 w-3" />
                                        No face registered
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm disabled:opacity-40"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                        Page {page} of {totalPages} ({total} workers)
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
