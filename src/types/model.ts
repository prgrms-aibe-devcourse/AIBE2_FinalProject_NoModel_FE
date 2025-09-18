// AI Model Document types (Elasticsearch 기반)
export interface AIModelDocument {
  id: string; // 문서 ID
  modelId: number; // 실제 모델 ID
  modelName: string;
  suggest: string;
  prompt: string;
  tags: string[];
  ownType: string; // USER, ADMIN
  ownerId: number;
  ownerName: string;
  price: number;
  isPublic: boolean;
  usageCount: number;
  viewCount: number; // 조회수 추가
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  
  // 호환성을 위한 추가 필드들 (프론트엔드에서 사용)
  shortDescription?: string;
  categoryType?: string;
  developer?: string;
  thumbnailUrl?: string;
  downloadCount?: number;
  modelType?: 'ADMIN' | 'USER';
  userId?: number;
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

// Page response structure (Spring Data Page)
export interface PageResponse<T> {
  content: T[];
  pageable?: {
    pageNumber: number;
    pageSize: number;
    sort?: {
      direction: string;
      property: string;
    };
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  number: number; // Spring Data Page의 현재 페이지 번호
  size: number;   // Spring Data Page의 페이지 크기
  numberOfElements: number; // 현재 페이지의 요소 수
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  response: T;
  error?: string;
}

export type ModelSearchResponse = ApiResponse<PageResponse<AIModelDocument>>;
export type ModelSuggestionsResponse = ApiResponse<string[]>;
export type ModelDetailResponse = ApiResponse<AIModelDocument>;

// Model detail types
export interface FileInfo {
  fileId: number;
  fileUrl: string;
  fileName: string;
  isPrimary: boolean;
}

export interface ReviewResponse {
  reviewId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// 새로운 리뷰 API용 타입들
export interface MyReviewResponse {
  reviewId: number;
  modelId: number;
  modelName: string;
  reviewerId: number;
  reviewerName: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 실제 API 응답 타입 (서버에서 받는 데이터)
export interface ApiReviewResponse {
  id: number;
  reviewerId: number;
  modelId: number;
  rating: number;
  content: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewRequest {
  rating: number;
  content: string;
}

export interface AIModelDetailResponse {
  modelId: number;
  modelName: string;
  description: string;
  ownType: string;
  ownerName: string;
  ownerId: number;
  price: number;
  avgRating: number;
  reviewCount: number;
  usageCount: number;
  viewCount: number;
  files: FileInfo[];
  reviews: ReviewResponse[];
  createdAt: string;
  updatedAt: string;
}

export type ModelDetailApiResponse = ApiResponse<AIModelDetailResponse>;

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
  response: null;
  error: {
    status: number;
    errorCode: string;
    message: string;
    timestamp: string;
  };
}