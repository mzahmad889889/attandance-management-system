/**
 * Same-origin proxy to the Flask backend.
 *
 * The browser only ever talks to this Next.js server, so there is no CORS
 * negotiation and no mixed-content block when the site is served over HTTPS.
 *
 * BACKEND_URL is read per request, which makes it an ordinary runtime env var —
 * unlike NEXT_PUBLIC_API_URL, which Next inlines into the client bundle at build
 * time and therefore has to be passed as a Docker build arg.
 */
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function backendUrl() {
    return (process.env.BACKEND_URL || 'http://backend:5000').replace(/\/+$/, '');
}

// Headers that describe the hop, not the payload — forwarding them corrupts the proxy.
const HOP_BY_HOP = new Set([
    'connection',
    'keep-alive',
    'transfer-encoding',
    'upgrade',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'host',
    'content-length',
    'content-encoding',
]);

function copyHeaders(source: Headers): Headers {
    const out = new Headers();
    source.forEach((value, key) => {
        if (!HOP_BY_HOP.has(key.toLowerCase())) out.set(key, value);
    });
    return out;
}

async function proxy(req: NextRequest) {
    const target = `${backendUrl()}${req.nextUrl.pathname}${req.nextUrl.search}`;
    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';

    let res: Response;
    try {
        res = await fetch(target, {
            method: req.method,
            headers: copyHeaders(req.headers),
            body: hasBody ? await req.arrayBuffer() : undefined,
            redirect: 'follow',
            cache: 'no-store',
        });
    } catch (err) {
        console.error(`[api-proxy] ${req.method} ${target} failed:`, err);
        return Response.json(
            { error: 'Backend is unreachable. Check the BACKEND_URL setting and that the API container is running.' },
            { status: 502 }
        );
    }

    return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: copyHeaders(res.headers),
    });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;
