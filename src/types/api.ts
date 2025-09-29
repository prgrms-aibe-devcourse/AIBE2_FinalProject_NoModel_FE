export interface ApiError {
  message: string;
  status: number;
  errorCode?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  response: T;
  error: ApiError | null;
}

// 서버 RefererType enum 대응 프런트 타입
export type RefererType =
  | 'REVIEW'
  | 'ORDER'
  | 'STORE_PURCHASE'
  | 'EVENT'
  | 'REFERRAL'
  | 'LOGIN'
  | 'MANUAL'
  | 'SYSTEM'
  | 'CHARGE';