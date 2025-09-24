const rawApiBase = import.meta.env.VITE_API_BASE?.trim();

export const API_BASE_URL = rawApiBase && rawApiBase.length > 0
  ? rawApiBase.replace(/\/$/, '')
  : 'http://localhost:8080/api';

export const buildApiUrl = (path: string) => {
  if (!path) {
    return API_BASE_URL;
  }

  return path.startsWith('/')
    ? `${API_BASE_URL}${path}`
    : `${API_BASE_URL}/${path}`;
};
