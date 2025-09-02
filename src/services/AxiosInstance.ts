import axios from 'axios';
import { tokenCookies } from '../utils/cookieUtils';

const axiosInstance = axios.create({ 
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080'
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = tokenCookies.getAccessToken();

    // if (!accessToken) {
    //   // 토큰이 없을 경우 로그아웃 처리
    //   localStorage.clear();
    //   window.location.href = '/login';
    //   throw new Error('토큰 없음');
    // }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 토큰 관련 에러 처리
axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },

  async (error) => {
    // 토큰 만료나 잘못된 토큰일 때 로그아웃 처리
    if (error.response?.status === 401 || error.response?.data?.code === 'AUTH_001') {
      console.log('인증 오류 - 토큰 제거');
      tokenCookies.clearAll();
      
      // 로그인 페이지로 리다이렉트 (필요한 경우)
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;