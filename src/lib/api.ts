const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

type TokenResponse = {
    accessToken: string;
    refreshToken: string;
    tokenType?: string;
};

function getAccess()  { return localStorage.getItem("access"); }
function getRefresh() { return localStorage.getItem("refresh"); }
function setTokens(a?: string | null, r?: string | null) {
    if (a) localStorage.setItem("access", a);
    if (r) localStorage.setItem("refresh", r);
}
function clearTokens() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
}

async function request(path: string, opts: RequestInit = {}, retry = true): Promise<Response> {
    const headers = new Headers(opts.headers || {});
    const access = getAccess();
    if (access) headers.set("Authorization", `Bearer ${access}`);
    if (!headers.has("Content-Type") && opts.body && !(opts.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }
    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
    if (res.status === 401 && retry && getRefresh()) {
        // refresh once
        const rr = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: getRefresh() }),
        });
        if (rr.ok) {
            const data = (await rr.json()) as TokenResponse;
            setTokens(data.accessToken, data.refreshToken);
            return request(path, opts, false);
        } else {
            clearTokens();
        }
    }
    return res;
}

async function get<T>(path: string): Promise<T> {
    const r = await request(path);
    if (!r.ok) throw new Error(`GET ${path} ${r.status}`);
    return r.json() as Promise<T>;
}
async function post<T, B = unknown>(path: string, body?: B): Promise<T> {
    const r = await request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) throw new Error(`POST ${path} ${r.status}`);
    return r.json() as Promise<T>;
}

// Helper: OAuth 시작 URL(=/oauth2/authorization) 은 API 베이스에서 /api를 뺀 origin 사용
function getOauthBase(): string {
    return API_BASE.replace(/\/api\/?$/, "");
}

export const api = { get, post, setTokens, clearTokens, API_BASE, getOauthBase };
export type { TokenResponse };
