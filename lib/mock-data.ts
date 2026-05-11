export interface Worker {
    id: string;
    name: string;
    photo?: string;
    plantId: string;
    contractor: string;
    shiftType: 'Day' | 'Night' | 'Rest';
    status: 'Present' | 'Absent' | 'On Leave';
    liveStatus: 'IN' | 'OUT';
    lastCheckIn?: string;
    lastCheckOut?: string;
}

export interface AttendanceRecord {
    id: string;
    workerId: string;
    workerName: string;
    plantId: string;
    contractor: string;
    shiftType: 'Day' | 'Night' | 'Rest';
    checkIn: string;
    checkOut?: string;
    totalHours?: number;
    overtimeHours?: number;
    status: 'Present' | 'Late' | 'Absent';
    liveStatus: 'IN' | 'OUT';
    photo?: string;
}

export interface Plant {
    id: string;
    name: string;
    location: string;
    activeWorkers: number;
    capacity: number;
}

export const PLANTS: Plant[] = [
    { id: 'P1', name: 'Main Assembly', location: 'Section A', activeWorkers: 124, capacity: 150 },
    { id: 'P2', name: 'Packaging Unit', location: 'Section B', activeWorkers: 86, capacity: 100 },
    { id: 'P3', name: 'Raw Material', location: 'Section C', activeWorkers: 45, capacity: 60 },
    { id: 'P4', name: 'Quality Control', location: 'Section D', activeWorkers: 32, capacity: 50 },
];

export const CONTRACTORS = ['Apex Industrial', 'BuildPath Corp', 'Global Workforce', 'Zenith Services'];

export const SHIFT_ROTATION = ['2 Day', '2 Night', '2 Rest'];

// Helper to generate workers
const generateWorkers = (count: number): Worker[] => {
    const workers: Worker[] = [];
    for (let i = 1; i <= count; i++) {
        const plant = PLANTS[Math.floor(Math.random() * PLANTS.length)];
        const contractor = CONTRACTORS[Math.floor(Math.random() * CONTRACTORS.length)];
        const shiftType = i % 3 === 0 ? 'Rest' : (i % 2 === 0 ? 'Day' : 'Night');

        workers.push({
            id: `W${i.toString().padStart(4, '0')}`,
            name: `Worker ${i}`,
            plantId: plant.id,
            contractor: contractor,
            shiftType: shiftType as any,
            status: Math.random() > 0.1 ? 'Present' : 'Absent',
            liveStatus: Math.random() > 0.3 ? 'IN' : 'OUT',
            lastCheckIn: '08:00',
        });
    }
    return workers;
};

export const MOCK_WORKERS = generateWorkers(335);

export const MOCK_ATTENDANCE: AttendanceRecord[] = MOCK_WORKERS.filter(w => w.status === 'Present').map(w => ({
    id: `ATT-${w.id}`,
    workerId: w.id,
    workerName: w.name,
    plantId: w.plantId,
    contractor: w.contractor,
    shiftType: w.shiftType,
    checkIn: '2024-05-10T08:00:00',
    checkOut: w.liveStatus === 'OUT' ? '2024-05-10T17:00:00' : undefined,
    totalHours: w.liveStatus === 'OUT' ? 9 : undefined,
    overtimeHours: w.liveStatus === 'OUT' ? 1 : 0,
    status: 'Present',
    liveStatus: w.liveStatus,
    photo: 'https://i.pravatar.cc/150?u=' + w.id,
}));

export const ATTENDANCE_STATS = [
    { name: 'Mon', present: 310, absent: 25 },
    { name: 'Tue', present: 305, absent: 30 },
    { name: 'Wed', present: 320, absent: 15 },
    { name: 'Thu', present: 315, absent: 20 },
    { name: 'Fri', present: 325, absent: 10 },
    { name: 'Sat', present: 280, absent: 55 },
    { name: 'Sun', present: 250, absent: 85 },
];

export const PLANT_STATS = PLANTS.map(p => ({
    name: p.name,
    workers: p.activeWorkers,
}));

export const OVERTIME_TRENDS = [
    { time: '08:00', hours: 0 },
    { time: '10:00', hours: 2 },
    { time: '12:00', hours: 5 },
    { time: '14:00', hours: 8 },
    { time: '16:00', hours: 15 },
    { time: '18:00', hours: 45 },
    { time: '20:00', hours: 30 },
];
