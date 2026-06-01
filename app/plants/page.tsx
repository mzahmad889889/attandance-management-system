"use client";

import React, { useState, useEffect } from 'react';
import {
    MapPin, Factory, Users, ExternalLink, Plus, Search,
    Settings, Trash2, Edit2, AlertCircle, Save, X, Loader2
} from 'lucide-react';
import { plantsApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function PlantsPage() {
    const [plants, setPlants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newPlant, setNewPlant] = useState({ name: '', location: '', capacity: 90 });
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchPlants = async () => {
        setLoading(true);
        try {
            const res: any = await plantsApi.list();
            setPlants(res.plants || []);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlants();
    }, []);

    const handleCreate = async () => {
        if (!newPlant.name) return;
        try {
            await plantsApi.create(newPlant);
            setNewPlant({ name: '', location: '', capacity: 90 });
            setIsAdding(false);
            fetchPlants();
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleUpdate = async (id: number, data: any) => {
        try {
            await plantsApi.update(id, data);
            setEditingId(null);
            fetchPlants();
        } catch (e: any) {
            alert(e.message);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Plant Management</h2>
                    <p className="text-muted-foreground">Manage industrial facilities and their capacities</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4" /> Add New Plant
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Plants', value: plants.length, icon: Factory, color: 'text-primary' },
                    { label: 'Total Capacity', value: plants.reduce((acc, p) => acc + (p.capacity || 0), 0), icon: Users, color: 'text-blue-500' },
                    { label: 'Average Utilization', value: '78%', icon: Settings, color: 'text-green-500' },
                ].map((s, i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl">
                        <s.icon className={cn("h-6 w-6 mb-3", s.color)} />
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-3xl font-bold">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isAdding && (
                    <div className="glass-card p-6 rounded-3xl border-2 border-primary/30 bg-primary/5 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">New Facility Details</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plant Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Plant-05"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                                    value={newPlant.name}
                                    onChange={e => setNewPlant({ ...newPlant, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</label>
                                <input
                                    type="text"
                                    placeholder="Sector, Area, City"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                                    value={newPlant.location}
                                    onChange={e => setNewPlant({ ...newPlant, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target Capacity</label>
                                <input
                                    type="number"
                                    placeholder="90"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                                    value={newPlant.capacity}
                                    onChange={e => setNewPlant({ ...newPlant, capacity: Number(e.target.value) })}
                                />
                            </div>
                            <button
                                onClick={handleCreate}
                                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="h-4 w-4" /> Save Facility
                            </button>
                        </div>
                    </div>
                )}

                {plants.map((plant: any) => (
                    <div key={plant.id} className="glass-card p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
                        {/* Status bar */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary/50 to-blue-500/50" />

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                    <Factory className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{plant.name}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {plant.location || 'Location Not Set'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setEditingId(plant.id)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="glass-card bg-white/5 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Workforce</p>
                                <p className="text-2xl font-bold">{plant.total_workers || 0}</p>
                            </div>
                            <div className="glass-card bg-white/5 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Target Capacity</p>
                                <p className="text-2xl font-bold">{plant.capacity}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Utilization Rate</p>
                                    <p className="text-[10px] font-bold text-primary">{plant.capacity ? Math.round((plant.total_workers / plant.capacity) * 100) : 0}%</p>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-1000"
                                        style={{ width: `${plant.capacity ? Math.min(100, Math.round((plant.total_workers / plant.capacity) * 100)) : 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && plants.length === 0 && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glass-card p-6 rounded-3xl h-64 animate-pulse bg-white/5" />
                ))}

                {!loading && plants.length === 0 && !isAdding && (
                    <div className="col-span-2 text-center py-24 glass-card rounded-[3rem]">
                        <Factory className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold text-lg">No plants registered yet</p>
                        <p className="text-muted-foreground text-sm mt-1">Start by adding your first industrial facility</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mt-6 text-primary font-bold text-sm hover:underline"
                        >
                            Add New Plant Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
