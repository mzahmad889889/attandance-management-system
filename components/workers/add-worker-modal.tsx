"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Factory, Briefcase, Clock, Shield, CheckCircle2, Camera, RefreshCcw, Upload, Image as ImageIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import { CONTRACTORS, PLANTS } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface AddWorkerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (worker: any) => void;
}

export function AddWorkerModal({ isOpen, onClose, onAdd }: AddWorkerModalProps) {
    const webcamRef = useRef<Webcam>(null);
    const [capturedImg, setCapturedImg] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        plantId: 'P1',
        contractor: CONTRACTORS[0],
        shiftType: 'Day',
    });
    const [isSuccess, setIsSuccess] = useState(false);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setCapturedImg(imageSrc);
            setShowCamera(false);
        }
    }, [webcamRef]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(true);
        const newWorker = {
            ...formData,
            photo: capturedImg || `https://i.pravatar.cc/150?u=${formData.id || Date.now()}`,
        };

        setTimeout(() => {
            onAdd(newWorker);
            setIsSuccess(false);
            onClose();
            // Reset
            setFormData({
                name: '',
                id: '',
                plantId: 'P1',
                contractor: CONTRACTORS[0],
                shiftType: 'Day',
            });
            setCapturedImg(null);
            setShowCamera(false);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-2xl glass-card rounded-[2.5rem] overflow-hidden pointer-events-auto border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">Onboard New Worker</h2>
                                        <p className="text-sm text-muted-foreground">Register a new personnel to the industrial ecosystem</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {!isSuccess ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                            {/* Photo Section */}
                                            <div className="md:col-span-4 space-y-4">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <Camera className="h-3 w-3" /> Worker Photo
                                                </label>

                                                <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                                                    {showCamera ? (
                                                        <Webcam
                                                            audio={false}
                                                            ref={webcamRef}
                                                            screenshotFormat="image/jpeg"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : capturedImg ? (
                                                        <img src={capturedImg} alt="Worker" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                                                            <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                                                            <p className="text-[10px] font-bold">NO IMAGE CAPTURED</p>
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCamera(!showCamera)}
                                                            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-xl"
                                                        >
                                                            {showCamera ? <RefreshCcw className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                                                        </button>
                                                        <label className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 cursor-pointer backdrop-blur-md border border-white/10">
                                                            <Upload className="h-5 w-5" />
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => setCapturedImg(reader.result as string);
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }} />
                                                        </label>
                                                    </div>

                                                    {showCamera && (
                                                        <button
                                                            type="button"
                                                            onClick={capture}
                                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
                                                        >
                                                            <div className="h-4 w-4 rounded-full border-2 border-black" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground text-center italic">Biometric photo recommended</p>
                                            </div>

                                            {/* Details Section */}
                                            <div className="md:col-span-8 space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                        <User className="h-3 w-3" /> Full Name
                                                    </label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="e.g. Robert Hammond"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 ring-primary/30 transition-all font-medium"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <Shield className="h-3 w-3" /> Employee ID
                                                        </label>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="e.g. W0421"
                                                            value={formData.id}
                                                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 ring-primary/30 transition-all font-mono text-sm"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <Factory className="h-3 w-3" /> Assign Plant
                                                        </label>
                                                        <select
                                                            value={formData.plantId}
                                                            onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 ring-primary/30 transition-all text-sm appearance-none"
                                                        >
                                                            {PLANTS.map(p => <option key={p.id} value={p.id} className="bg-[#0f172a] text-white">{p.name}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <Briefcase className="h-3 w-3" /> Contractor
                                                        </label>
                                                        <select
                                                            value={formData.contractor}
                                                            onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 ring-primary/30 transition-all text-sm appearance-none"
                                                        >
                                                            {CONTRACTORS.map(c => <option key={c} value={c} className="bg-[#0f172a] text-white">{c}</option>)}
                                                        </select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                            <Clock className="h-3 w-3" /> Shift Assignment
                                                        </label>
                                                        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                                                            {['Day', 'Night', 'Rest'].map((type) => (
                                                                <button
                                                                    key={type}
                                                                    type="button"
                                                                    onClick={() => setFormData({ ...formData, shiftType: type as any })}
                                                                    className={cn(
                                                                        "flex-1 py-2 rounded-xl text-[10px] font-bold transition-all",
                                                                        formData.shiftType === type
                                                                            ? "bg-primary text-white shadow-lg"
                                                                            : "text-muted-foreground hover:bg-white/5"
                                                                    )}
                                                                >
                                                                    {type.toUpperCase()}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <button
                                                type="submit"
                                                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                                            >
                                                Register Worker
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="py-12 flex flex-col items-center text-center space-y-4"
                                    >
                                        <div className="h-20 w-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-500 mb-4">
                                            <CheckCircle2 className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Registration Complete</h3>
                                        <p className="text-muted-foreground max-w-[300px]">Personnel has been successfully added to the system directory.</p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
