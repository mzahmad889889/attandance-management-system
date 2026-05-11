"use client";

import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Shield
} from 'lucide-react';
import { MOCK_WORKERS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { AddWorkerModal } from '@/components/workers/add-worker-modal';

export default function WorkersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workers, setWorkers] = useState(MOCK_WORKERS);

    const filteredWorkers = workers.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddWorker = (newWorker: any) => {
        const worker = {
            ...newWorker,
            status: 'Absent',
            liveStatus: 'OUT',
        };
        setWorkers([worker, ...workers]);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AddWorkerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddWorker}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Worker Directory</h2>
                    <p className="text-muted-foreground">Manage and monitor all personnel in the ecosystem</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2"
                >
                    <UserPlus className="h-4 w-4" /> Add New Worker
                </button>
            </div>

            <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by worker name, ID or contractor..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-white/10 rounded-xl bg-white/5 text-sm font-bold flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filters
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWorkers.slice(0, 24).map((worker) => (
                    <div key={worker.id} className="glass-card p-6 rounded-[2rem] border border-white/5 hover:border-primary/20 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-all">
                                    <img src={worker.photo || `https://i.pravatar.cc/150?u=${worker.id}`} alt={worker.name} />
                                </div>
                                <span className={cn(
                                    "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-900",
                                    worker.status === 'Present' ? "bg-green-500" : "bg-red-500"
                                )} />
                            </div>
                            <button className="p-2 hover:bg-white/5 rounded-full">
                                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <h3 className="font-bold text-lg mb-0.5">{worker.name}</h3>
                        <p className="text-primary font-mono text-xs font-bold tracking-widest mb-4">{worker.id}</p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-muted-foreground">Department:</span>
                                <span className="text-white">{worker.plantId}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-muted-foreground">Contractor:</span>
                                <span className="text-white truncate max-w-[100px]">{worker.contractor}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-medium">
                                <span className="text-muted-foreground">Shift Plan:</span>
                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold">
                                    {worker.shiftType.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-6">
                            <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
                    Load More Workers...
                </button>
            </div>
        </div>
    );
}
