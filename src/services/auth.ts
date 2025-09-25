import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types/auth';
import { PostAxiosInstance, GetAxiosInstance } from './ApiService';
import { AxiosError } from 'axios';
import { tokenCookies } from '../utils/cookieUtils';
import { buildApiUrl } from '../config/env';
import { ApiError } from '../types/api';

const buildApiError = (err: unknown, fallbackMessage: string): ApiError => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as any;
    const serverError = data?.error;

    if (serverError && typeof serverError === 'object') {
      const message = typeof serverError.message === 'string'
        ? serverError.message
        : typeof data?.message === 'string'
          ? data.message
          : fallbackMessage;

      const status = typeof serverError.status === 'number'
        ? serverError.status
        : err.response?.status ?? 500;

      return {
        message,
        status,
        ...serverError,
      };
    }

    const derivedMessage = typeof data?.message === 'string'
      ? data.message
      : typeof data?.error === 'string'
        ? data.error
        : fallbackMessage;

    return {
      message: derivedMessage,
      status: err.response?.status ?? 500,
    };
  }

  if (err instanceof Error) {
    return {
      message: err.message,
      status: 500,
    };
  }

  return {
    message: fallbackMessage,
    status: 500,
  };
};

class AuthService {
  // Login API call - Cookie based authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await PostAxiosInstance<LoginResponse>('/auth/login', credentials);
      const data = response.data;

      if (data.success) {
        // HttpOnly 쿠키는 백엔드가 Set-Cookie 헤더로 설정함
        console.log('Login successful, HttpOnly cookies set by backend');
        
        // HttpOnly 쿠키는 JS로 읽을 수 없으므로 localStorage에 로그인 상태 저장
        localStorage.setItem('isLoggedIn', 'true');
        
        // 사용자 정보가 있으면 저장
        if (data.response?.user) {
          tokenCookies.setUserInfo(data.response.user);
        }
        
        return data;
      }

      return data;
    } catch (error) {
      console.error('Login API error:', error);
      
      return {
        success: false,
        response: null,
        error: buildApiError(error, '로그인에 실패했습니다.'),
      };
    }
  }

  // Signup API call
  async signup(userData: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await PostAxiosInstance<SignupResponse>('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Signup API error:', error);
      
      return {
        success: false,
        response: null,
        error: buildApiError(error, '회원가입에 실패했습니다.'),
      };
    }
  }

  // Get user profile - Cookie based
  async getUserProfile(): Promise<any> {
    try {
      // 쿠키 기반 인증이므로 토큰 확인 불필요
      // withCredentials: true로 쿠키가 자동 전송됨
      const response = await GetAxiosInstance('/members/me');
      const data = response.data;
      
      // Store user info locally
      if (data.success && data.response) {
        tokenCookies.setUserInfo(data.response);
      }
      
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      
      if (error instanceof AxiosError && error.response?.status === 401) {
        // 쿠키 만료 또는 유효하지 않음
        this.logout();
        throw new Error('Authentication failed');
      }
      
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await PostAxiosInstance('/auth/refresh', { refreshToken });
      const data = response.data;
      
      if (data.success && data.response) {
        tokenCookies.setTokens({
          accessToken: data.response.accessToken,
          refreshToken: data.response.refreshToken,
          accessTokenValidTime: data.response.accessTokenValidTime,
          refreshTokenValidTime: data.response.refreshTokenValidTime,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Refresh token error:', error);
      return false;
    }
  }

  // Get access token
  getAccessToken(): string | null {
    return tokenCookies.getAccessToken();
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return tokenCookies.getRefreshToken();
  }

  // Get stored user info
  getStoredUserInfo(): any | null {
    return tokenCookies.getUserInfo();
  }

  // Check if user is authenticated - Cookie based
  isAuthenticated(): boolean {
    // HttpOnly 쿠키는 JavaScript로 읽을 수 없음
    // localStorage에 로그인 상태를 저장하여 확인
    const userInfo = tokenCookies.getUserInfo();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    console.log('🔍 인증 상태 확인 (HttpOnly 쿠키):');
    console.log('  - localStorage isLoggedIn:', isLoggedIn);
    console.log('  - userInfo 존재:', !!userInfo);
    console.log('  - 최종 결과:', isLoggedIn || !!userInfo);
    
    // HttpOnly 쿠키는 읽을 수 없으므로 
    // 로그인 시 localStorage에 상태를 저장하고 그것을 확인
    return isLoggedIn || !!userInfo;
  }

  // Logout - clear cookies and local data
  async logout(): Promise<void> {
    try {
      // 백엔드에 로그아웃 요청을 보내 쿠키 삭제
      await PostAxiosInstance('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 로컬 데이터 정리
      tokenCookies.clearAll();
      localStorage.removeItem('isLoggedIn');
    }
  }

  // Make authenticated API request (deprecated - use AxiosInstance directly)
  async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    console.warn('authenticatedRequest is deprecated. Use AxiosInstance directly.');
    
    let token = this.getAccessToken();
    
    if (!token) {
      // Try to refresh token
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        throw new Error('Authentication required');
      }
      token = this.getAccessToken();
    }

    const response = await fetch(buildApiUrl(url), {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // If unauthorized, try to refresh token once
    if (response.status === 401) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const newToken = this.getAccessToken();
        return fetch(buildApiUrl(url), {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json',
          },
        });
      } else {
        this.logout();
        throw new Error('Authentication failed');
      }
    }

    return response;
  }
}

export const authService = new AuthService();
