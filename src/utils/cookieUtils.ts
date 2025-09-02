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

  // Set user info
  setUserInfo: (userInfo: any) => {
    cookieUtils.setCookie(tokenCookies.USER_INFO, JSON.stringify(userInfo));
  },

  // Get user info
  getUserInfo: (): any | null => {
    const userInfo = cookieUtils.getCookie(tokenCookies.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
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