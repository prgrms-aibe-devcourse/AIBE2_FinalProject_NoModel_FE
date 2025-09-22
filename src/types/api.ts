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
