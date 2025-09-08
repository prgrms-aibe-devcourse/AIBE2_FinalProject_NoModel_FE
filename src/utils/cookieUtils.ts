// Base64 encoding/decoding utilities for safe cookie storage
const base64Utils = {
  encode: (str: string): string => {
    try {
      // Unicode 문자열을 안전하게 Base64로 인코딩
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
    } catch (error) {
      console.error('Base64 encoding error:', error);
      return str; // 실패 시 원본 반환
    }
  },

  decode: (str: string): string => {
    try {
      // Base64를 Unicode 문자열로 안전하게 디코딩
      return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (error) {
      console.error('Base64 decoding error:', error);
      return str; // 실패 시 원본 반환
    }
  }
};

// Cookie utility functions for token management
export const cookieUtils = {
  // Set cookie with expiration
  setCookie: (name: string, value: string, maxAge?: number) => {
    let cookieString = `${name}=${value}; path=/; SameSite=Strict`;
    
    if (maxAge) {
      cookieString += `; max-age=${Math.floor(maxAge / 1000)}`;
    }
    
    document.cookie = cookieString;
  },

  // Get cookie value
  getCookie: (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Remove cookie
  removeCookie: (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  },

  // Check if cookie exists and is not expired
  isCookieValid: (name: string): boolean => {
    return cookieUtils.getCookie(name) !== null;
  },

  // Set cookie with Base64 encoding (for complex data)
  setEncodedCookie: (name: string, value: string, maxAge?: number) => {
    try {
      const encodedValue = base64Utils.encode(value);
      cookieUtils.setCookie(name, encodedValue, maxAge);
    } catch (error) {
      console.error('Encoded cookie set error:', error);
      // 폴백으로 원본 값 저장
      cookieUtils.setCookie(name, value, maxAge);
    }
  },

  // Get cookie with Base64 decoding (for complex data)
  getEncodedCookie: (name: string): string | null => {
    try {
      const encodedValue = cookieUtils.getCookie(name);
      if (!encodedValue) {
        return null;
      }
      return base64Utils.decode(encodedValue);
    } catch (error) {
      console.error('Encoded cookie get error:', error);
      // 폴백으로 원본 값 반환
      return cookieUtils.getCookie(name);
    }
  }
};

// Token-specific cookie management
export const tokenCookies = {
  ACCESS_TOKEN: 'nomodel_access_token',
  REFRESH_TOKEN: 'nomodel_refresh_token',
  ACCESS_TOKEN_EXPIRE: 'nomodel_access_token_expire',
  REFRESH_TOKEN_EXPIRE: 'nomodel_refresh_token_expire',
  USER_INFO: 'nomodel_user_info',

  // Set tokens in cookies
  setTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenValidTime: number;
    refreshTokenValidTime: number;
  }) => {
    const now = Date.now();
    
    // Set tokens
    cookieUtils.setCookie(tokenCookies.ACCESS_TOKEN, tokens.accessToken, tokens.accessTokenValidTime);
    cookieUtils.setCookie(tokenCookies.REFRESH_TOKEN, tokens.refreshToken, tokens.refreshTokenValidTime);
    
    // Set expiration timestamps
    cookieUtils.setCookie(
      tokenCookies.ACCESS_TOKEN_EXPIRE, 
      (now + tokens.accessTokenValidTime).toString(),
      tokens.accessTokenValidTime
    );
    cookieUtils.setCookie(
      tokenCookies.REFRESH_TOKEN_EXPIRE, 
      (now + tokens.refreshTokenValidTime).toString(),
      tokens.refreshTokenValidTime
    );
  },

  // Get access token if valid
  getAccessToken: (): string | null => {
    const token = cookieUtils.getCookie(tokenCookies.ACCESS_TOKEN);
    const expireTime = cookieUtils.getCookie(tokenCookies.ACCESS_TOKEN_EXPIRE);
    
    if (!token || !expireTime) {
      return null;
    }

    // Check if token is expired
    if (Date.now() >= parseInt(expireTime)) {
      return null;
    }

    return token;
  },

  // Get refresh token if valid
  getRefreshToken: (): string | null => {
    const token = cookieUtils.getCookie(tokenCookies.REFRESH_TOKEN);
    const expireTime = cookieUtils.getCookie(tokenCookies.REFRESH_TOKEN_EXPIRE);
    
    if (!token || !expireTime) {
      return null;
    }

    // Check if refresh token is expired
    if (Date.now() >= parseInt(expireTime)) {
      return null;
    }

    return token;
  },

  // Set user info (Base64 encoded for safe cookie storage)
  setUserInfo: (userInfo: any) => {
    try {
      const jsonString = JSON.stringify(userInfo);
      const encodedUserInfo = base64Utils.encode(jsonString);
      cookieUtils.setCookie(tokenCookies.USER_INFO, encodedUserInfo);
      console.log('✅ 사용자 정보 쿠키 저장 성공 (Base64 인코딩)');
    } catch (error) {
      console.error('❌ 사용자 정보 쿠키 저장 실패:', error);
    }
  },

  // Get user info (Base64 decoded from cookie)
  getUserInfo: (): any | null => {
    try {
      const encodedUserInfo = cookieUtils.getCookie(tokenCookies.USER_INFO);
      if (!encodedUserInfo) {
        return null;
      }
      
      const decodedUserInfo = base64Utils.decode(encodedUserInfo);
      const userInfo = JSON.parse(decodedUserInfo);
      console.log('✅ 사용자 정보 쿠키 읽기 성공 (Base64 디코딩)');
      return userInfo;
    } catch (error) {
      console.error('❌ 사용자 정보 쿠키 읽기 실패:', error);
      // 오류 발생 시 쿠키 삭제하여 재로그인 유도
      cookieUtils.removeCookie(tokenCookies.USER_INFO);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = tokenCookies.getAccessToken();
    return !!token;
  },

  // Clear all tokens and user data
  clearAll: () => {
    cookieUtils.removeCookie(tokenCookies.ACCESS_TOKEN);
    cookieUtils.removeCookie(tokenCookies.REFRESH_TOKEN);
    cookieUtils.removeCookie(tokenCookies.ACCESS_TOKEN_EXPIRE);
    cookieUtils.removeCookie(tokenCookies.REFRESH_TOKEN_EXPIRE);
    cookieUtils.removeCookie(tokenCookies.USER_INFO);
  }
};