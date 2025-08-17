/**
 * API Hooks
 * React hooks for API operations with loading states and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import type { ApiError, ApiResponse } from '../services/httpClient';

// ===== Types =====

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

// ===== Generic API Hook =====

/**
 * Generic hook for API calls with loading states
 */
export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const { immediate = false, onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction();
      setState(prev => ({ ...prev, data: response.data, loading: false }));
      onSuccess?.(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({ ...prev, error: apiError, loading: false }));
      onError?.(apiError);
    }
  }, [apiFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    refetch: execute,
  };
}

// ===== Mutation Hook =====

/**
 * Hook for API mutations (POST, PUT, DELETE) with manual execution
 */
export function useMutation<T, TArgs extends any[]>(
  apiFunction: (...args: TArgs) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
): UseMutationState<T> {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: TArgs) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      setState(prev => ({ ...prev, data: response.data, loading: false }));
      onSuccess?.(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({ ...prev, error: apiError, loading: false }));
      onError?.(apiError);
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// ===== Paginated Data Hook =====

export interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UsePaginatedApiState<T> extends UseApiState<PaginatedData<T>> {
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  refetch: () => Promise<void>;
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T>(
  apiFunction: (page: number, limit?: number) => Promise<ApiResponse<PaginatedData<T>>>,
  limit: number = 10,
  options: UseApiOptions = {}
): UsePaginatedApiState<T> {
  const { immediate = true, onSuccess, onError } = options;
  
  const [page, setPage] = useState(1);
  const [state, setState] = useState<UseApiState<PaginatedData<T>>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (currentPage: number = page) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(currentPage, limit);
      setState(prev => ({ ...prev, data: response.data, loading: false }));
      onSuccess?.(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({ ...prev, error: apiError, loading: false }));
      onError?.(apiError);
    }
  }, [apiFunction, page, limit, onSuccess, onError]);

  const nextPage = useCallback(() => {
    if (state.data?.pagination.hasNext) {
      const newPage = page + 1;
      setPage(newPage);
      execute(newPage);
    }
  }, [state.data?.pagination.hasNext, page, execute]);

  const prevPage = useCallback(() => {
    if (state.data?.pagination.hasPrev) {
      const newPage = page - 1;
      setPage(newPage);
      execute(newPage);
    }
  }, [state.data?.pagination.hasPrev, page, execute]);

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= (state.data?.pagination.totalPages || 1)) {
      setPage(newPage);
      execute(newPage);
    }
  }, [state.data?.pagination.totalPages, execute]);

  const refetch = useCallback(() => execute(page), [execute, page]);

  useEffect(() => {
    if (immediate) {
      execute(page);
    }
  }, [immediate]); // Only run on mount or when immediate changes

  return {
    ...state,
    page,
    hasNext: state.data?.pagination.hasNext || false,
    hasPrev: state.data?.pagination.hasPrev || false,
    nextPage,
    prevPage,
    goToPage,
    refetch,
  };
}

// ===== Optimistic Update Hook =====

export interface UseOptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  rollback?: boolean;
}

/**
 * Hook for optimistic updates with rollback capability
 */
export function useOptimisticUpdate<T, TArgs extends any[]>(
  currentData: T | null,
  updateFunction: (...args: TArgs) => Promise<ApiResponse<T>>,
  optimisticUpdate: (currentData: T | null, ...args: TArgs) => T,
  options: UseOptimisticUpdateOptions<T> = {}
): {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: TArgs) => Promise<void>;
} {
  const { onSuccess, onError, rollback = true } = options;
  
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: ApiError | null;
  }>({
    data: currentData,
    loading: false,
    error: null,
  });

  // Update local state when external data changes
  useEffect(() => {
    setState(prev => ({ ...prev, data: currentData }));
  }, [currentData]);

  const execute = useCallback(async (...args: TArgs) => {
    const previousData = state.data;
    
    // Apply optimistic update
    const optimisticData = optimisticUpdate(state.data, ...args);
    setState(prev => ({ 
      ...prev, 
      data: optimisticData, 
      loading: true, 
      error: null 
    }));

    try {
      const response = await updateFunction(...args);
      setState(prev => ({ 
        ...prev, 
        data: response.data, 
        loading: false 
      }));
      onSuccess?.(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      
      // Rollback on error if enabled
      if (rollback) {
        setState(prev => ({ 
          ...prev, 
          data: previousData, 
          loading: false, 
          error: apiError 
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: apiError 
        }));
      }
      
      onError?.(apiError);
    }
  }, [state.data, updateFunction, optimisticUpdate, rollback, onSuccess, onError]);

  return {
    ...state,
    execute,
  };
}