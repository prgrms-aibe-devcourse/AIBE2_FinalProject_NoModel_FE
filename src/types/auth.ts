import { ApiError } from './api';

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  response: {
    grantType: string;
    accessToken: string;
    accessTokenValidTime: number;
    refreshToken: string;
    refreshTokenValidTime: number;
    user?: unknown;
  } | null;
  error: ApiError | null;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  agreeToMarketing?: boolean;
}

export interface SignupResponse {
  success: boolean;
  response: {
    userId: string;
    email: string;
    name: string;
  } | null;
  error: ApiError | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenValidTime: number;
  refreshTokenValidTime: number;
}

// Local storage keys
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'nomodel_access_token',
  REFRESH_TOKEN: 'nomodel_refresh_token',
  ACCESS_TOKEN_EXPIRE: 'nomodel_access_token_expire',
  REFRESH_TOKEN_EXPIRE: 'nomodel_refresh_token_expire',
  USER_INFO: 'nomodel_user_info',
} as const;
