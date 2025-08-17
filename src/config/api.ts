/**
 * API Configuration Module
 * Environment-based configuration for development and production
 */

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  enableLogging: boolean;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * Get API configuration based on current environment
 */
export const getApiConfig = (): ApiConfig => {
  const config: ApiConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
    enableLogging: import.meta.env.VITE_ENABLE_API_LOGGING === 'true',
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3', 10),
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000', 10),
  };

  // Development mode logging
  if (import.meta.env.DEV && config.enableLogging) {
    console.log('🔧 API Configuration:', {
      ...config,
      environment: import.meta.env.MODE,
    });
  }

  return config;
};

/**
 * API endpoints configuration
 */
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  
  // Users
  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  
  // Projects (example endpoints)
  projects: {
    list: '/projects',
    create: '/projects',
    get: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    delete: (id: string) => `/projects/${id}`,
  },
  
  // Tasks (example endpoints)
  tasks: {
    list: '/tasks',
    create: '/tasks',
    get: (id: string) => `/tasks/${id}`,
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    byProject: (projectId: string) => `/projects/${projectId}/tasks`,
  },
} as const;

/**
 * HTTP status codes for API responses
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * API error types
 */
export const API_ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ApiErrorType = typeof API_ERROR_TYPES[keyof typeof API_ERROR_TYPES];