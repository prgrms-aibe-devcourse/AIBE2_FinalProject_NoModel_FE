import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types/auth';
import { PostAxiosInstance, GetAxiosInstance } from './ApiService';
import { AxiosError } from 'axios';
import { tokenCookies } from '../utils/cookieUtils';

class AuthService {
  // Login API call
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await PostAxiosInstance<LoginResponse>('/api/auth/login', credentials);
      const data = response.data;

      // Store tokens if login successful
      if (data.success && data.response) {
        tokenCookies.setTokens({
          accessToken: data.response.accessToken,
          refreshToken: data.response.refreshToken,
          accessTokenValidTime: data.response.accessTokenValidTime,
          refreshTokenValidTime: data.response.refreshTokenValidTime,
        });
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

  // Get user profile
  async getUserProfile(): Promise<any> {
    try {
      const token = this.getAccessToken();
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await GetAxiosInstance('/auth/profile');
      const data = response.data;
      
      // Store user info
      if (data.success && data.response) {
        tokenCookies.setUserInfo(data.response);
      }
      
      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      
      if (error instanceof AxiosError && error.response?.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry with new token
          return this.getUserProfile();
        } else {
          this.logout();
          throw new Error('Authentication failed');
        }
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return tokenCookies.isAuthenticated();
  }

  // Logout - clear all stored data
  logout(): void {
    tokenCookies.clearAll();
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