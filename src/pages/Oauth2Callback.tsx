import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const OAuth2Callback: React.FC = () => {
    const nav = useNavigate();

    useEffect(() => {
        const hash = window.location.hash.startsWith('#')
            ? window.location.hash.slice(1)
            : window.location.hash;
        const params = new URLSearchParams(hash);
        const access = params.get('access');
        const refresh = params.get('refresh');

        if (access && refresh) {
            // authService에 setTokens가 없으면 localStorage로 직접 저장해도 됩니다.
            (authService as any)?.setTokens?.(access, refresh);
            if (!(authService as any)?.setTokens) {
                localStorage.setItem('access', access);
                localStorage.setItem('refresh', refresh);
            }
        }

        // 선택: 로그인 후 프로필 미리 불러오기
        (async () => {
            try { await authService.getUserProfile?.(); } catch {}
            nav('/', { replace: true });
        })();
    }, [nav]);

    return <p className="p-6 text-center">Signing you in…</p>;
};

export default OAuth2Callback;
