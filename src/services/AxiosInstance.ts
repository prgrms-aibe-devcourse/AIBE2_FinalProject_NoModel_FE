import axios, {AxiosError} from 'axios';
import { tokenCookies } from '../utils/cookieUtils';

const axiosInstance = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8080/api',
  withCredentials: true, // 쿠키를 포함하여 요청 전송
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // 쿠키 기반 인증을 사용하므로 Authorization 헤더 설정 불필요
    // withCredentials: true 설정으로 쿠키가 자동 포함됨
    
    // 필요한 경우 다른 공통 헤더 설정
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 인증 관련 에러 처리
axiosInstance.interceptors.response.use(
  async (response) => {
    return response;
  },

  async (error) => {
    // 401 인증 에러 처리 (쿠키 만료 또는 유효하지 않은 쿠키)
    if (error.response?.status === 401 || error.response?.data?.code === 'AUTH_001') {
      console.log('인증 오류 - 세션 만료');
      
      // 로컬 스토리지 정리 (필요한 경우)
      tokenCookies.clearAll();
      
      // 로그인 페이지로 리다이렉트
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  },
);

let redirectedForBan = false;

axiosInstance.interceptors.response.use(
    (res) => res,
    (error: AxiosError<any>) => {
      const status = error.response?.status;
      const data = error.response?.data as any | undefined;

      if (status === 403 && !redirectedForBan) {
        redirectedForBan = true;
        alert('해당 계정은 이용이 제한되었습니다.\n자세한 내용은 고객센터로 문의해주세요.');
        // 뒤로가기로 다시 403 페이지로 못 돌아오게 replace 사용
        window.location.replace('/');
        // 이후 체인 중단
        return new Promise(() => {});
      }

      return Promise.reject(error);
    }
);

export default axiosInstance;