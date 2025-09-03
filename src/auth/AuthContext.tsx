import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

type MeResponse =
    | { authenticated: false }
    | {
    authenticated: true;
    sub?: string;
    name?: string;
    email?: string;
    provider?: string;
    avatar?: string;
    [k: string]: unknown;
};

type AuthContextValue = {
    user: MeResponse | null;
    busy: boolean;
    loginWith: (provider: "google" | "github") => void;
    loginLocal: (username: string, password: string) => Promise<void>;
    logout: () => void;
    reload: () => Promise<void>;
};

const AuthCtx = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<MeResponse | null>(null);
    const [busy, setBusy] = useState(true);

    const loadMe = async () => {
        setBusy(true);
        try {
            const me = await api.get<MeResponse>("/me");
            setUser(me?.authenticated ? me : null);
        } catch {
            setUser(null);
        } finally {
            setBusy(false);
        }
    };

    useEffect(() => { void loadMe(); }, []);

    const loginWith = (provider: "google" | "github") => {
        window.location.href = `${api.getOauthBase()}/oauth2/authorization/${provider}`;
    };

    const loginLocal = async (username: string, password: string) => {
        const data = await api.post<{ accessToken: string; refreshToken: string }>(
            "/auth/login",
            { username, password }
        );
        api.setTokens(data.accessToken, data.refreshToken);
        await loadMe();
    };

    const logout = () => {
        api.clearTokens();
        setUser(null);
    };

    const value = useMemo<AuthContextValue>(() => ({
        user, busy, loginWith, loginLocal, logout, reload: loadMe
    }), [user, busy]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
