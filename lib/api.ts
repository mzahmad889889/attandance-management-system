/**
 * Central API client for the Attendance Management System backend.
 * All requests go through here with auth token injection.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** Backend server origin (BASE_URL without the trailing /api) — for images and other static routes. */
export const SERVER_URL = (BASE_URL || '').replace(/\/api\/?$/, '');

function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('ams_token');
}

async function request<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try {
            const errJson = await res.json();
            errMsg = errJson.error || errMsg;
        } catch (_) { }
        throw new Error(errMsg);
    }

    // Handle file downloads
    const ct = res.headers.get('Content-Type') || '';
    if (ct.includes('application/vnd') || ct.includes('application/octet')) {
        return res.blob() as unknown as T;
    }

    return res.json() as T;
}

// Low-level request for custom endpoints
export const apiRequest = request;

// For binary files
async function requestBlob(endpoint: string, options: RequestInit = {}): Promise<Blob> {
    const token = getToken();
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.blob();
}

// ---- Auth ----
export const authApi = {
    login: (email: string, password: string) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => request('/auth/me'),
    register: (data: { email: string; password: string; name: string; role: string }) =>
        request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

// ---- Workers ----
export const workersApi = {
    list: (params: Record<string, any> = {}) => {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
        ).toString();
        return request(`/workers/${qs ? '?' + qs : ''}`);
    },
    get: (id: number) => request(`/workers/${id}`),
    create: (data: any) => request('/workers/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/workers/${id}`, { method: 'DELETE' }),
    meta: () => request('/workers/meta'),
};

// ---- Attendance ----
export const attendanceApi = {
    list: (params: Record<string, any> = {}) => {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
        ).toString();
        return request(`/attendance/${qs ? '?' + qs : ''}`);
    },
    todayStats: () => request('/attendance/today-stats'),
    checkin: (workerCode: string) =>
        request('/attendance/checkin', { method: 'POST', body: JSON.stringify({ worker_code: workerCode }) }),
    checkout: (workerCode: string) =>
        request('/attendance/checkout', { method: 'POST', body: JSON.stringify({ worker_code: workerCode }) }),
    liveFeed: () => request('/attendance/live-feed'),
    monitoringActive: () => request('/attendance/monitoring-active'),
    request: (endpoint: string, options?: RequestInit) => request(endpoint, options),
};

// ---- Face ----
export const faceApi = {
    register: (workerId: number, frames: string[]) =>
        request('/face/register', { method: 'POST', body: JSON.stringify({ worker_id: workerId, frames }) }),
    recognize: (frame: string, mode: 'checkin' | 'checkout') =>
        request('/face/recognize', { method: 'POST', body: JSON.stringify({ frame, mode }) }),
    status: () => request('/face/status'),
};

// ---- Reports ----
export const reportsApi = {
    summary: () => request('/reports/summary'),
    exportExcel: async (params: Record<string, any> = {}) => {
        const token = getToken();
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
        ).toString();
        const res = await fetch(`${BASE_URL}/reports/export-excel${qs ? '?' + qs : ''}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            const text = await res.text();
            let message = 'Export failed.';
            try {
                const parsed = JSON.parse(text);
                message = parsed.error || message;
            } catch {
                message = text || message;
            }
            throw new Error(message);
        }

        return res;
    },
    workerHistory: (id: number, opts: { all?: boolean; days?: number } = {}) => {
        const qs = new URLSearchParams(
            Object.entries(opts)
                .filter(([, v]) => v != null)
                .map(([k, v]) => [k, String(v)])
        ).toString();
        return request(`/reports/worker/${id}/history${qs ? ('?' + qs) : ''}`);
    },
    workerExport: (id: number) => requestBlob(`/reports/worker/${id}/export`),
    request: (endpoint: string, options?: RequestInit) => request(endpoint, options),
    requestBlob: (endpoint: string, options?: RequestInit) => requestBlob(endpoint, options),
};

// ---- Plants ----
export const plantsApi = {
    list: () => request('/plants/'),
    create: (data: any) => request('/plants/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request(`/plants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/plants/${id}`, { method: 'DELETE' }),
};

// ---- Shifts ----
export const shiftsApi = {
    schedule: (plantId?: number) => request(`/shifts/schedule${plantId ? `?plant_id=${plantId}` : ''}`),
    summary: () => request('/shifts/summary'),
};
