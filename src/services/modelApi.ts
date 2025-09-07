import { GetAxiosInstance, PostAxiosInstance } from './ApiService';
import type {
  ModelSearchParams,
  AdminModelParams,
  UserModelParams,
  AccessibleModelParams,
  PopularModelParams,
  PartialSearchParams,
  ModelSearchResponse,
  ModelSuggestionsResponse,
  ModelDetailResponse,
  ModelReportRequest,
  ModelReportResponse,
  MyReportsResponse,
  ErrorResponse
} from '../types/model';
import { AxiosError } from 'axios';

/**
 * AI 모델 통합 검색 API
 */
export const searchModels = async (params: ModelSearchParams): Promise<ModelSearchResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    searchParams.append('keyword', params.keyword); // 필수 파라미터
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await GetAxiosInstance<ModelSearchResponse>(
      `/models/search?${searchParams.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error('모델 검색 API 에러:', error);
    throw error;
  }
};

/**
 * 관리자 모델 목록 조회 API
 */
export const getAdminModels = async (params: AdminModelParams = {}): Promise<ModelSearchResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await GetAxiosInstance<ModelSearchResponse>(
      `/models/search/admin?${searchParams.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error('관리자 모델 조회 API 에러:', error);
    throw error;
  }
};

/**
 * 내 모델 목록 조회 API
 */
export const getUserModels = async (params: UserModelParams): Promise<ModelSearchResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    searchParams.append('userId', params.userId.toString());
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await GetAxiosInstance<ModelSearchResponse>(
      `/models/search/my-models?${searchParams.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error('내 모델 조회 API 에러:', error);
    throw error;
  }
};

/**
 * 접근 가능한 모델 검색 API
 */
export const searchAccessibleModels = async (params: AccessibleModelParams): Promise<ModelSearchResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    searchParams.append('userId', params.userId.toString());
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await GetAxiosInstance<ModelSearchResponse>(
      `/models/search/accessible?${searchParams.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error('접근 가능한 모델 검색 API 에러:', error);
    throw error;
  }
};

/**
 * 인기 모델 검색 API
 */
export const getPopularModels = async (params: PopularModelParams = {}): Promise<ModelSearchResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await GetAxiosInstance<ModelSearchResponse>(
      `/models/search/popular?${searchParams.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error('인기 모델 조회 API 에러:', error);
    throw error;
  }
};

/**
 * 모델명 자동완성 API
 */
export const getModelNameSuggestions = async (prefix: string): Promise<ModelSuggestionsResponse> => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('prefix', prefix);

    const response = await GetAxiosInstance<ModelSuggestionsResponse>(
      `/models/search/suggestions?${searchParams.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error('모델명 자동완성 API 에러:', error);
    throw error;
  }
};

/**
 * 부분 모델명 검색 API
 */
export const searchByPartialName = async (params: PartialSearchParams): Promise<ModelSearchResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    searchParams.append('partial', params.partial);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    const response = await GetAxiosInstance<ModelSearchResponse>(
      `/models/search/partial?${searchParams.toString()}`
    );
    
    return response.data;
  } catch (error) {
    console.error('부분 모델명 검색 API 에러:', error);
    throw error;
  }
};

/**
 * 모델 상세 정보 조회 API
 */
export const getModelDetail = async (documentId: string): Promise<ModelDetailResponse> => {
  try {
    const response = await GetAxiosInstance<ModelDetailResponse>(
      `/models/search/${documentId}`
    );
    
    return response.data;
  } catch (error) {
    console.error('모델 상세 조회 API 에러:', error);
    throw error;
  }
};

/**
 * AI 모델 신고 API
 */
export const reportModel = async (
  modelId: number, 
  reportData: ModelReportRequest
): Promise<ModelReportResponse> => {
  try {
    const response = await PostAxiosInstance<ModelReportResponse>(
      `/reports/models/${modelId}`,
      reportData
    );
    
    return response.data;
  } catch (error) {
    console.error('모델 신고 API 에러:', error);
    
    // 에러 처리
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as ErrorResponse;
      
      if (errorData?.error?.errorCode === 'DUPLICATE_REPORT') {
        throw new Error('이미 신고한 모델입니다');
      }
      if (errorData?.error?.errorCode === 'MODEL_NOT_FOUND') {
        throw new Error('모델을 찾을 수 없습니다');
      }
      if (errorData?.error?.errorCode === 'AUTHENTICATION_FAILED') {
        throw new Error('로그인이 필요합니다');
      }
    }
    
    throw new Error('신고 처리 중 오류가 발생했습니다');
  }
};

/**
 * 내 신고 내역 조회 API
 */
export const getMyReports = async (): Promise<MyReportsResponse> => {
  try {
    const response = await GetAxiosInstance<MyReportsResponse>('/reports/my/models');
    return response.data;
  } catch (error) {
    console.error('내 신고 내역 조회 API 에러:', error);
    throw error;
  }
};

/**
 * 신고 상세 조회 API
 */
export const getReportDetail = async (reportId: number): Promise<ModelReportResponse> => {
  try {
    const response = await GetAxiosInstance<ModelReportResponse>(`/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error('신고 상세 조회 API 에러:', error);
    throw error;
  }
};