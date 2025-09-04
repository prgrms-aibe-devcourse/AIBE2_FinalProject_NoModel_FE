import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types/auth';
import { PostAxiosInstance, GetAxiosInstance } from './ApiService';
import { AxiosError } from 'axios';
import { tokenCookies } from '../utils/cookieUtils';

class AuthService {
  // Login API call - Cookie based authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await PostAxiosInstance<LoginResponse>('/api/auth/login', credentials);
      const data = response.data;

      // 쿠키 기반 인증이므로 body에서 토큰을 추출하지 않음
      // 백엔드가 Set-Cookie 헤더로 토큰을 설정함
      if (data.success) {
        // 로그인 성공 시 쿠키가 자동으로 설정됨
        // 별도의 토큰 저장 로직 불필요
        console.log('Login successful, cookies set by backend');
        
        // 성공 응답 반환 (토큰 정보는 없어도 됨)
        return {
          success: true,
          response: {
            grantType: 'Bearer',
            accessToken: 'cookie-based',
            accessTokenValidTime: 3600000,
            refreshToken: 'cookie-based',
            refreshTokenValidTime: 86400000
          },
          error: null
        };
      }

      return data;
    } catch (error) {
      console.error('Login API error:', error);
      
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           '로그인에 실패했습니다.';
        return {
          success: false,
          response: null,
          error: errorMessage,
        };
      }

      return {
        success: false,
        response: null,
        error: '네트워크 오류가 발생했습니다.',
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
      
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           '회원가입에 실패했습니다.';
        return {
          success: false,
          response: null,
          error: errorMessage,
        };
      }

      return {
        success: false,
        response: null,
        error: '네트워크 오류가 발생했습니다.',
      };
    }
  }

  // Get user profile - Cookie based
  async getUserProfile(): Promise<any> {
    try {
      // 쿠키 기반 인증이므로 토큰 확인 불필요
      // withCredentials: true로 쿠키가 자동 전송됨
      const response = await GetAxiosInstance('/auth/profile');
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
    // 쿠키 기반 인증에서는 쿠키 존재 여부를 서버에서 확인해야 함
    // 클라이언트에서는 로컬에 저장된 사용자 정보로 임시 확인
    return tokenCookies.getUserInfo() !== null;
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

    const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:8080'}${url}`, {
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
        return fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:8080'}${url}`, {
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