"use client";

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCcw, CheckCircle2, User, Factory, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraCaptureProps {
    onCapture: (image: string) => void;
    workerName?: string;
    workerId?: string;
}

export function CameraCapture({ onCapture, workerName, workerId }: CameraCaptureProps) {
    const webcamRef = useRef<Webcam>(null);
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
            onCapture(imageSrc);

            // Simulate verification
            setIsVerifying(true);
            setTimeout(() => {
                setIsVerifying(false);
                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 3000);
            }, 1500);
        }
    }, [onCapture]);

    const retake = () => {
        setImgSrc(null);
        setIsSuccess(false);
    };

    return (
        <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <div className="relative aspect-video bg-black flex items-center justify-center">
                {!imgSrc ? (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "user" }}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/50 rounded-3xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-white/20 rounded-[40px]" />
                            <motion.div
                                animate={{ top: ['30%', '70%', '30%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute left-1/2 -translate-x-1/2 w-64 h-0.5 bg-primary shadow-[0_0_15px_rgba(249,115,22,0.8)]"
                            />
                        </div>
                    </>
                ) : (
                    <img src={imgSrc} alt="captured" className="h-full w-full object-cover" />
                )}

                <AnimatePresence>
                    {isVerifying && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4"
                        >
                            <RefreshCcw className="h-10 w-10 text-primary animate-spin" />
                            <p className="text-sm font-bold tracking-widest text-primary">SCANNING BIOMETRICS...</p>
                        </motion.div>
                    )}

                    {isSuccess && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute inset-x-6 bottom-6 bg-green-500 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl"
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="h-6 w-6" />
                                <div>
                                    <p className="font-bold leading-none">Verification Successful</p>
                                    <p className="text-[10px] opacity-90">Attendance logged: {new Date().toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <User className="h-3 w-3" /> Worker Info
                        </label>
                        <p className="font-bold truncate">{workerName || 'Scan ID to Identify'}</p>
                        <p className="text-xs text-muted-foreground">{workerId || '---'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Plant Location
                        </label>
                        <p className="font-bold">Plant P01</p>
                        <p className="text-xs text-muted-foreground">Main Entrance</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {!imgSrc ? (
                        <button
                            onClick={capture}
                            className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group"
                        >
                            <Camera className="h-5 w-5 group-active:scale-90 transition-transform" />
                            Capture & Check-IN
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={retake}
                                className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                            >
                                <RefreshCcw className="h-5 w-5" />
                                Retake
                            </button>
                            <button
                                className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                            >
                                Done
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
