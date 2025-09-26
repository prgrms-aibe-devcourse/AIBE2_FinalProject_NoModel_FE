import axiosInstance from './AxiosInstance';
import { MyReviewResponse, ReviewRequest, ApiReviewResponse } from '../types/model';
import { getMultipleModelsBasicInfo } from './modelApi';

// API 응답 기본 타입
export interface ApiResponse<T> {
  success: boolean;
  response: T;
  error?: {
    message: string;
    status: number;
  };
}

/**
 * API 응답을 UI에서 사용하는 형태로 변환
 */
const transformApiReviewToMyReview = (apiReview: ApiReviewResponse, modelName?: string): MyReviewResponse => {
  return {
    reviewId: apiReview.id,
    modelId: apiReview.modelId,
    modelName: modelName || '알 수 없는 모델', // 실제 모델명 또는 기본값
    reviewerId: apiReview.reviewerId,
    reviewerName: '나', // 내 리뷰이므로 고정값
    rating: apiReview.rating,
    content: apiReview.content,
    createdAt: apiReview.createdAt,
    updatedAt: apiReview.updatedAt || apiReview.createdAt
  };
};

/**
 * 내가 작성한 모든 리뷰 조회
 */
export const getMyAllReviews = async (): Promise<ApiResponse<MyReviewResponse[]>> => {
  try {
    const response = await axiosInstance.get('/me/reviews');
    const apiData = response.data;
    
    if (apiData.success && Array.isArray(apiData.response)) {
      // 리뷰에서 사용된 모든 모델 ID 추출
      const modelIds = [...new Set(apiData.response.map((review: ApiReviewResponse) => review.modelId))];
      
      // 모델 정보 병렬 조회
      const modelNameMap = await getMultipleModelsBasicInfo(modelIds);
      
      // API 응답을 우리 형태로 변환 (실제 모델명 포함)
      const transformedReviews = apiData.response.map((review: ApiReviewResponse) => 
        transformApiReviewToMyReview(review, modelNameMap.get(review.modelId))
      );
      
      return {
        success: true,
        response: transformedReviews
      };
    }
    
    return apiData;
  } catch (error: any) {
    console.error('내 리뷰 조회 실패:', error);
    return {
      success: false,
      response: [],
      error: {
        message: error.response?.data?.error?.message || '리뷰 조회에 실패했습니다.',
        status: error.response?.status || 500
      }
    };
  }
};

/**
 * 내가 작성한 특정 리뷰 조회
 */
export const getMyReview = async (reviewId: number): Promise<ApiResponse<MyReviewResponse>> => {
  try {
    const response = await axiosInstance.get(`/me/reviews/${reviewId}`);
    const apiData = response.data;
    
    if (apiData.success && apiData.response) {
      // 단일 모델 정보 조회
      const modelNameMap = await getMultipleModelsBasicInfo([apiData.response.modelId]);
      const transformedReview = transformApiReviewToMyReview(
        apiData.response,
        modelNameMap.get(apiData.response.modelId)
      );
      
      return {
        success: true,
        response: transformedReview
      };
    }
    
    return apiData;
  } catch (error: any) {
    console.error('내 특정 리뷰 조회 실패:', error);
    return {
      success: false,
      response: {} as MyReviewResponse,
      error: {
        message: error.response?.data?.error?.message || '리뷰 조회에 실패했습니다.',
        status: error.response?.status || 500
      }
    };
  }
};

/**
 * 내가 작성한 리뷰 수정
 */
export const updateMyReview = async (
  reviewId: number, 
  request: ReviewRequest
): Promise<ApiResponse<MyReviewResponse>> => {
  try {
    const response = await axiosInstance.put(`/me/reviews/${reviewId}`, request);
    const apiData = response.data;
    
    if (apiData.success && apiData.response) {
      // 모델 정보 조회
      const modelNameMap = await getMultipleModelsBasicInfo([apiData.response.modelId]);
      const transformedReview = transformApiReviewToMyReview(
        apiData.response,
        modelNameMap.get(apiData.response.modelId)
      );
      
      return {
        success: true,
        response: transformedReview
      };
    }
    
    return apiData;
  } catch (error: any) {
    console.error('내 리뷰 수정 실패:', error);
    return {
      success: false,
      response: {} as MyReviewResponse,
      error: {
        message: error.response?.data?.error?.message || '리뷰 수정에 실패했습니다.',
        status: error.response?.status || 500
      }
    };
  }
};

/**
 * 내가 작성한 리뷰 삭제
 */
export const deleteMyReview = async (reviewId: number): Promise<ApiResponse<void>> => {
  try {
    const response = await axiosInstance.delete(`/me/reviews/${reviewId}`);
    return response.data;
  } catch (error: any) {
    console.error('내 리뷰 삭제 실패:', error);
    return {
      success: false,
      response: undefined,
      error: {
        message: error.response?.data?.error?.message || '리뷰 삭제에 실패했습니다.',
        status: error.response?.status || 500
      }
    };
  }
};

/**
 * 특정 모델의 리뷰 목록 조회
 */
export const getReviewsByModel = async (modelId: number): Promise<ApiResponse<MyReviewResponse[]>> => {
  try {
    const response = await axiosInstance.get(`/models/${modelId}/reviews`);
    const apiData = response.data;
    
    if (apiData.success && Array.isArray(apiData.response)) {
      // 단일 모델의 리뷰이므로 해당 모델 정보만 조회
      const modelNameMap = await getMultipleModelsBasicInfo([modelId]);
      const modelName = modelNameMap.get(modelId);
      
      const transformedReviews = apiData.response.map((review: ApiReviewResponse) => 
        transformApiReviewToMyReview(review, modelName)
      );
      
      return {
        success: true,
        response: transformedReviews
      };
    }
    
    return apiData;
  } catch (error: any) {
    console.error('모델 리뷰 조회 실패:', error);
    return {
      success: false,
      response: [],
      error: {
        message: error.response?.data?.error?.message || '리뷰 조회에 실패했습니다.',
        status: error.response?.status || 500
      }
    };
  }
};

/**
 * 리뷰 작성
 */
export const createReview = async (
  modelId: number,
  request: ReviewRequest
): Promise<ApiResponse<MyReviewResponse>> => {
  try {
    console.log('📤 리뷰 작성 요청 - modelId:', modelId);
    console.log('📤 리뷰 작성 요청 - request:', request);
    console.log('📤 요청 URL:', `/models/${modelId}/reviews`);
    
    const response = await axiosInstance.post(`/models/${modelId}/reviews`, request);
    console.log('📥 리뷰 작성 응답:', response.data);
    const apiData = response.data;
    
    if (apiData.success && apiData.response) {
      // 모델 정보 조회
      const modelNameMap = await getMultipleModelsBasicInfo([modelId]);
      const transformedReview = transformApiReviewToMyReview(
        apiData.response,
        modelNameMap.get(modelId)
      );
      
      return {
        success: true,
        response: transformedReview
      };
    }
    
    return apiData;
  } catch (error: any) {
    console.error('리뷰 작성 실패:', error);
    console.error('에러 응답 전체:', error.response);
    console.error('에러 응답 데이터:', error.response?.data);
    console.error('에러 메시지:', error.response?.data?.message || error.response?.data?.error);
    console.error('HTTP 상태:', error.response?.status);
    
    return {
      success: false,
      response: {} as MyReviewResponse,
      error: {
        message: error.response?.data?.message || 
                error.response?.data?.error?.message || 
                error.response?.data?.error || 
                error.message || 
                '리뷰 작성에 실패했습니다.',
        status: error.response?.status || 500
      }
    };
  }
};
