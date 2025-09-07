// AI Model Document types (Elasticsearch 기반)
export interface AIModelDocument {
  id: string; // 문서 ID
  modelId: number; // 실제 모델 ID
  modelName: string;
  shortDescription: string;
  categoryType: string;
  developer: string;
  thumbnailUrl?: string;
  rating: number;
  downloadCount: number;
  tags: string[];
  isPublic: boolean;
  modelType: 'ADMIN' | 'USER'; // 관리자/사용자 모델 구분
  userId?: number; // 사용자 모델인 경우 생성자 ID
  createdAt: string;
  updatedAt: string;
}

// Search request parameters
export interface ModelSearchParams {
  keyword: string; // 필수 파라미터
  page?: number;
  size?: number;
}

export interface AdminModelParams {
  page?: number;
  size?: number;
}

export interface UserModelParams {
  userId: number;
  page?: number;
  size?: number;
}

export interface AccessibleModelParams {
  keyword?: string; // 선택적
  userId: number;
  page?: number;
  size?: number;
}

export interface PopularModelParams {
  page?: number;
  size?: number;
}

export interface PartialSearchParams {
  partial: string;
  page?: number;
  size?: number;
}

// Page response structure
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      direction: string;
      property: string;
    };
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  response: T;
  error?: string;
}

export type ModelSearchResponse = ApiResponse<PageResponse<AIModelDocument>>;
export type ModelSuggestionsResponse = ApiResponse<AIModelDocument[]>;
export type ModelDetailResponse = ApiResponse<AIModelDocument>;

// Model report types
export interface ModelReportRequest {
  reasonDetail: string;
}

export interface ModelReportResponse {
  success: boolean;
  response: {
    reportId: number;
    targetType: string;
    targetId: number;
    reporterId: number;
    reasonDetail: string;
    reportStatus: string;
    reportStatusDescription: string;
    adminNote?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MyReportsResponse {
  success: boolean;
  response: ModelReportResponse['response'][];
}

export interface ErrorResponse {
  success: false;
  error: {
    errorCode: string;
    status: number;
    message: string;
  };
}