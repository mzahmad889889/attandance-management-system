"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, User, Factory, Briefcase, Clock, Shield, CheckCircle2,
    Camera, RefreshCcw, Upload, Image as ImageIcon, ScanFace, Loader2
} from 'lucide-react';
import Webcam from 'react-webcam';
import { cn } from '@/lib/utils';
import { faceApi } from '@/lib/api';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd?: (worker: any) => Promise<any>;
    onUpdate?: (id: number, worker: any) => Promise<any>;
    worker?: any; // optional worker when editing
    meta: { plants: any[]; contractors: any[] };
}

const SCAN_INTERVAL_MS = 800;
const TARGET_FRAMES = 8;

export function AddWorkerModal(props: Props) {
    const { isOpen, onClose, meta, onAdd, onUpdate, worker } = props;
    const webcamRef = useRef<Webcam>(null);
    const scanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [capturedImg, setCapturedImg] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanFrames, setScanFrames] = useState<string[]>([]);
    const [scanStatus, setScanStatus] = useState('');
    const [faceRegistered, setFaceRegistered] = useState(false);
    const [formData, setFormData] = useState<{
        name: string; worker_code: string; plant_id: string; contractor_id: string;
        shift_type: string | null; age: string; cnic: string; phone: string;
    }>({
        name: '', worker_code: '', plant_id: '', contractor_id: '', shift_type: null,
        age: '', cnic: '', phone: '',
    });
    // shiftMode: 'system' = omit shift (use system default), 'nil' = explicitly no shift, 'specify' = choose Day/Night/Rest
    const [shiftMode, setShiftMode] = useState<'system'|'nil'|'specify'>('system');
    const [isSuccess, setIsSuccess] = useState(false);
    // When editing an existing worker, populate the form
    useEffect(() => {
        if ((props as any)?.worker && isOpen) {
            const w = (props as any).worker;
            setFormData({
                name: w.name || '',
                worker_code: w.worker_code || '',
                plant_id: String(w.plant_id || ''),
                contractor_id: String(w.contractor_id || ''),
                shift_type: w.shift_type || null,
                age: w.age || '',
                cnic: w.cnic || '',
                phone: w.phone || '',
            });
            // derive shiftMode from worker.shift_type
            if (w.shift_type === null || w.shift_type === undefined) setShiftMode('nil');
            else if (w.shift_type) setShiftMode('specify');
            else setShiftMode('system');
        }
    }, [isOpen]);
    const [submitting, setSubmitting] = useState(false);
    const [registeredWorkerId, setRegisteredWorkerId] = useState<number | null>(null);

    const plants = meta.plants;
    const contractors = meta.contractors;

    useEffect(() => {
        if (plants.length && !formData.plant_id) {
            setFormData(f => ({ ...f, plant_id: String(plants[0]?.id || '') }));
        }
        if (contractors.length && !formData.contractor_id) {
            setFormData(f => ({ ...f, contractor_id: String(contractors[0]?.id || '') }));
        }
    }, [plants, contractors]);

    // Face scanning loop: captures a frame every SCAN_INTERVAL_MS
    const startFaceScan = useCallback(() => {
        if (isScanning) return;
        setIsScanning(true);
        setScanFrames([]);
        setScanStatus('Scanning face... (hold still)');
        setFaceRegistered(false);

        let collected: string[] = [];
        scanTimerRef.current = setInterval(() => {
            const img = webcamRef.current?.getScreenshot();
            if (img && collected.length < TARGET_FRAMES) {
                collected.push(img);
                setScanFrames([...collected]);
                setScanStatus(`Captured ${collected.length}/${TARGET_FRAMES} frames`);
                if (!capturedImg) setCapturedImg(img);

                if (collected.length >= TARGET_FRAMES) {
                    clearInterval(scanTimerRef.current!);
                    setScanStatus(`✓ ${TARGET_FRAMES} frames captured. Will register on save.`);
                    setIsScanning(false);
                }
            }
        }, SCAN_INTERVAL_MS);
    }, [isScanning, capturedImg]);

    const stopScan = useCallback(() => {
        if (scanTimerRef.current) clearInterval(scanTimerRef.current);
        setIsScanning(false);
    }, []);

    useEffect(() => () => stopScan(), [stopScan]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload: any = {
                ...formData,
                plant_id: Number(formData.plant_id),
                contractor_id: Number(formData.contractor_id),
                age: formData.age ? Number(formData.age) : null,
                photo: capturedImg || undefined,
            };
            // Handle shift selection behaviour:
            // - 'system': omit shift_type so backend uses system default
            // - 'nil': explicitly send null so worker has no assigned shift
            // - 'specify': include selected shift_type (if any)
            if (shiftMode === 'system') {
                delete payload.shift_type;
            } else if (shiftMode === 'nil') {
                payload.shift_type = null;
            } else if (shiftMode === 'specify') {
                if (formData.shift_type) {
                    payload.shift_type = formData.shift_type;
                } else {
                    // no specific shift chosen despite specifying — fallback to system default
                    delete payload.shift_type;
                }
            }

            // Create or update
            let res: any = null;
            if (props.onUpdate && props.worker) {
                // update
                res = await props.onUpdate(props.worker.id, payload);
            } else if (props.onAdd) {
                res = await props.onAdd(payload);
            }

            // If we have face frames and a worker ID from the backend, register face
            const workerId = res?.worker?.id || (props.worker?.id ?? null);
            if (scanFrames.length >= 2 && workerId) {
                setScanStatus('Registering face embeddings...');
                await faceApi.register(workerId, scanFrames);
                setFaceRegistered(true);
            }

            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                setFormData({ name: '', worker_code: '', plant_id: String(plants[0]?.id || ''), contractor_id: String(contractors[0]?.id || ''), shift_type: null, age: '', cnic: '', phone: '' });
                setShiftMode('system');
                setCapturedImg(null);
                setScanFrames([]);
                setShowCamera(false);
            }, 1200);
        } catch (err: any) {
            alert(err.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
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
                            className="w-full max-w-2xl glass-card rounded-[2.5rem] overflow-hidden pointer-events-auto border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">Onboard New Worker</h2>
                                        <p className="text-sm text-muted-foreground">Register personnel with face recognition</p>
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
                                            {/* Photo + Face Scan Section */}
                                            <div className="md:col-span-4 space-y-4">
                                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                                    <Camera className="h-3 w-3" /> Biometric Photo
                                                </label>

                                                <div className="aspect-square rounded-3xl bg-white/5 border-2 border-white/10 overflow-hidden relative">
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
                                                            <ScanFace className="h-12 w-12 mb-2 opacity-20" />
                                                            <p className="text-[10px] font-bold">NO FACE CAPTURED</p>
                                                        </div>
                                                    )}

                                                    {/* Scanning animation overlay */}
                                                    {isScanning && (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                            <div className="w-32 h-32 border-2 border-primary rounded-full animate-ping opacity-30 absolute" />
                                                            <ScanFace className="h-10 w-10 text-primary animate-pulse" />
                                                            <p className="text-xs text-primary font-bold mt-2">{scanFrames.length}/{TARGET_FRAMES}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Camera controls */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowCamera(!showCamera); if (!showCamera) stopScan(); }}
                                                        className="py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center justify-center gap-1 hover:bg-white/10"
                                                    >
                                                        <Camera className="h-3.5 w-3.5" />
                                                        {showCamera ? 'Hide' : 'Open'} Cam
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={isScanning ? stopScan : startFaceScan}
                                                        disabled={!showCamera}
                                                        className={cn(
                                                            "py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all disabled:opacity-40",
                                                            isScanning
                                                                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                                                                : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20"
                                                        )}
                                                    >
                                                        <ScanFace className="h-3.5 w-3.5" />
                                                        {isScanning ? 'Stop' : 'Scan Face'}
                                                    </button>
                                                </div>

                                                {scanStatus && (
                                                    <p className="text-[10px] text-center text-primary/80 font-medium">{scanStatus}</p>
                                                )}

                                                <label className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold flex items-center justify-center gap-1 hover:bg-white/10 cursor-pointer">
                                                    <Upload className="h-3.5 w-3.5" />
                                                    Upload Photo
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

                                            {/* Details */}
                                            <div className="md:col-span-8 space-y-4">
                                                {/* Name */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                        <User className="h-3 w-3" /> Full Name *
                                                    </label>
                                                    <input required type="text" placeholder="e.g. Muhammad Zain"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* Worker Code */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                            <Shield className="h-3 w-3" /> Code
                                                        </label>
                                                        <input type="text" placeholder="Auto-generated"
                                                            value={formData.worker_code}
                                                            onChange={e => setFormData({ ...formData, worker_code: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 font-mono text-sm"
                                                        />
                                                    </div>
                                                    {/* Age */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Age</label>
                                                        <input type="number" placeholder="e.g. 28"
                                                            value={formData.age}
                                                            onChange={e => setFormData({ ...formData, age: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    {/* Plant */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                            <Factory className="h-3 w-3" /> Plant *
                                                        </label>
                                                        <select required value={formData.plant_id}
                                                            onChange={e => setFormData({ ...formData, plant_id: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm appearance-none"
                                                        >
                                                            {plants.map((p: any) => (
                                                                <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {/* Contractor */}
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                            <Briefcase className="h-3 w-3" /> Contractor *
                                                        </label>
                                                        <select required value={formData.contractor_id}
                                                            onChange={e => setFormData({ ...formData, contractor_id: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm appearance-none"
                                                        >
                                                            {contractors.map((c: any) => (
                                                                <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Phone + CNIC */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Phone</label>
                                                        <input type="text" placeholder="03xx-xxxxxxx"
                                                            value={formData.phone}
                                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">CNIC</label>
                                                        <input type="text" placeholder="xxxxx-xxxxxxx-x"
                                                            value={formData.cnic}
                                                            onChange={e => setFormData({ ...formData, cnic: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none focus:ring-2 ring-primary/30 text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Shift */}
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock className="h-3 w-3" /> Default Shift
                                                    </label>

                                                                                            <div className="flex items-center gap-3 mb-2">
                                                                                                <label className="flex items-center gap-2 text-xs">
                                                                                                    <input type="radio" name="shift_mode" checked={shiftMode === 'system'} onChange={e => { setShiftMode('system'); setFormData({ ...formData, shift_type: null }); }} className="w-4 h-4" />
                                                                                                    <span className="text-[10px]">System default</span>
                                                                                                </label>
                                                                                                <label className="flex items-center gap-2 text-xs">
                                                                                                    <input type="radio" name="shift_mode" checked={shiftMode === 'nil'} onChange={e => { setShiftMode('nil'); setFormData({ ...formData, shift_type: null }); }} className="w-4 h-4" />
                                                                                                    <span className="text-[10px]">No shift (nil)</span>
                                                                                                </label>
                                                                                                <label className="flex items-center gap-2 text-xs">
                                                                                                    <input type="radio" name="shift_mode" checked={shiftMode === 'specify'} onChange={e => { setShiftMode('specify'); if (!formData.shift_type) setFormData({ ...formData, shift_type: 'Day' }); }} className="w-4 h-4" />
                                                                                                    <span className="text-[10px]">Specify shift</span>
                                                                                                </label>
                                                                                                {shiftMode === 'system' && (
                                                                                                    <span className="text-[10px] text-muted-foreground">(will use system default)</span>
                                                                                                )}
                                                                                                {shiftMode === 'nil' && (
                                                                                                    <span className="text-[10px] text-muted-foreground">(worker will have no assigned shift)</span>
                                                                                                )}
                                                                                            </div>

                                                                                            <div className={cn("flex bg-white/5 p-1 rounded-xl border border-white/10", shiftMode !== 'specify' && 'opacity-50') }>
                                                                                                {['Day', 'Night', 'Rest'].map(type => (
                                                                                                    <button key={type} type="button"
                                                                                                        onClick={() => setFormData({ ...formData, shift_type: formData.shift_type === type ? null : type })}
                                                                                                        disabled={shiftMode !== 'specify'}
                                                                                                        className={cn(
                                                                                                            "flex-1 py-2 rounded-lg text-[10px] font-bold transition-all",
                                                                                                            shiftMode === 'specify' && formData.shift_type === type
                                                                                                                ? "bg-primary text-white shadow-lg"
                                                                                                                : "text-muted-foreground hover:bg-white/5",
                                                                                                            shiftMode !== 'specify' && "cursor-not-allowed"
                                                                                                        )}
                                                                                                    >
                                                                                                        {type.toUpperCase()}
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            {submitting ? (
                                                <><Loader2 className="h-5 w-5 animate-spin" /> Registering...</>
                                            ) : (
                                                <><ScanFace className="h-5 w-5" /> Register Worker{scanFrames.length >= 2 ? ' + Face' : ''}</>
                                            )}
                                        </button>
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
                                        <p className="text-muted-foreground max-w-[280px] text-sm">
                                            Worker added successfully.
                                            {faceRegistered ? ' Face recognition is ready.' : scanFrames.length >= 2 ? ' Face data saved.' : ' Add face from worker profile to enable face check-in.'}
                                        </p>
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
