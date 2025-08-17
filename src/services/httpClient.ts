/**
 * HTTP Client Service
 * Robust fetch wrapper with error handling, retries, and logging
 */

import { getApiConfig, HTTP_STATUS, API_ERROR_TYPES, type ApiErrorType } from '../config/api';

export interface ApiError extends Error {
  status?: number;
  type: ApiErrorType;
  data?: any;
  originalError?: Error;
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableLogging?: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

class HttpClient {
  private config = getApiConfig();

  /**
   * Create API Error with proper typing and context
   */
  private createApiError(
    message: string,
    type: ApiErrorType,
    status?: number,
    data?: any,
    originalError?: Error
  ): ApiError {
    const error = new Error(message) as ApiError;
    error.type = type;
    error.status = status;
    error.data = data;
    error.originalError = originalError;
    return error;
  }

  /**
   * Log API request/response for debugging
   */
  private log(message: string, data?: any) {
    if (this.config.enableLogging && import.meta.env.DEV) {
      console.log(`🌐 [API] ${message}`, data || '');
    }
  }

  /**
   * Sleep function for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create AbortController with timeout
   */
  private createTimeoutController(timeout: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
  }

  /**
   * Build full URL with base URL
   */
  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.baseURL.endsWith('/') 
      ? this.config.baseURL.slice(0, -1) 
      : this.config.baseURL;
    
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Parse response body safely
   */
  private async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else if (contentType?.includes('text/')) {
        return await response.text();
      } else {
        return await response.blob();
      }
    } catch (error) {
      this.log('Response parsing failed', error);
      return null;
    }
  }

  /**
   * Handle HTTP errors and create appropriate ApiError
   */
  private async handleHttpError(response: Response): Promise<ApiError> {
    const data = await this.parseResponse(response);
    
    switch (response.status) {
      case HTTP_STATUS.BAD_REQUEST:
        return this.createApiError(
          'Invalid request parameters',
          API_ERROR_TYPES.VALIDATION_ERROR,
          response.status,
          data
        );
      
      case HTTP_STATUS.UNAUTHORIZED:
        return this.createApiError(
          'Authentication required',
          API_ERROR_TYPES.AUTHENTICATION_ERROR,
          response.status,
          data
        );
      
      case HTTP_STATUS.FORBIDDEN:
        return this.createApiError(
          'Access forbidden',
          API_ERROR_TYPES.AUTHORIZATION_ERROR,
          response.status,
          data
        );
      
      case HTTP_STATUS.NOT_FOUND:
        return this.createApiError(
          'Resource not found',
          API_ERROR_TYPES.NOT_FOUND_ERROR,
          response.status,
          data
        );
      
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        return this.createApiError(
          'Validation failed',
          API_ERROR_TYPES.VALIDATION_ERROR,
          response.status,
          data
        );
      
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return this.createApiError(
          'Server error occurred',
          API_ERROR_TYPES.SERVER_ERROR,
          response.status,
          data
        );
      
      default:
        return this.createApiError(
          `Request failed: ${response.statusText}`,
          API_ERROR_TYPES.UNKNOWN_ERROR,
          response.status,
          data
        );
    }
  }

  /**
   * Core request method with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.config.timeout,
      retryAttempts = this.config.retryAttempts,
      retryDelay = this.config.retryDelay,
      enableLogging = this.config.enableLogging,
      ...fetchOptions
    } = options;

    const url = this.buildUrl(endpoint);
    const controller = this.createTimeoutController(timeout);

    // Default headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    });

    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    };

    let lastError: ApiError | null = null;

    // Retry logic
    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        if (enableLogging && attempt > 0) {
          this.log(`Retry attempt ${attempt}/${retryAttempts}`, { url, method: requestOptions.method });
        } else if (enableLogging) {
          this.log(`${requestOptions.method || 'GET'} ${url}`, requestOptions.body);
        }

        const response = await fetch(url, requestOptions);

        if (enableLogging) {
          this.log(`Response ${response.status} ${response.statusText}`, { url });
        }

        if (!response.ok) {
          lastError = await this.handleHttpError(response);
          
          // Don't retry for client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw lastError;
          }
          
          // Retry for server errors (5xx) and network errors
          if (attempt < retryAttempts) {
            await this.sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
            continue;
          }
          
          throw lastError;
        }

        const data = await this.parseResponse(response);

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = this.createApiError(
            'Request timeout',
            API_ERROR_TYPES.TIMEOUT_ERROR,
            undefined,
            undefined,
            error
          );
        } else if (error instanceof TypeError) {
          lastError = this.createApiError(
            'Network error',
            API_ERROR_TYPES.NETWORK_ERROR,
            undefined,
            undefined,
            error
          );
        } else if (error && typeof error === 'object' && 'type' in error) {
          lastError = error as ApiError;
        } else {
          lastError = this.createApiError(
            'Unknown error occurred',
            API_ERROR_TYPES.UNKNOWN_ERROR,
            undefined,
            undefined,
            error instanceof Error ? error : undefined
          );
        }

        // Don't retry for timeout or network errors on last attempt
        if (attempt < retryAttempts && 
            (lastError.type === API_ERROR_TYPES.SERVER_ERROR || 
             lastError.type === API_ERROR_TYPES.NETWORK_ERROR)) {
          if (enableLogging) {
            this.log(`Request failed, retrying in ${retryDelay * Math.pow(2, attempt)}ms`, lastError);
          }
          await this.sleep(retryDelay * Math.pow(2, attempt));
          continue;
        }

        throw lastError;
      }
    }

    throw lastError || this.createApiError(
      'Maximum retry attempts exceeded',
      API_ERROR_TYPES.UNKNOWN_ERROR
    );
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
export default httpClient;