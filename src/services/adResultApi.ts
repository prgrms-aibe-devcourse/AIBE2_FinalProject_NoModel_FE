import { GetAxiosInstance } from './ApiService';
import { GeneratedProject, SelectedModel } from '../App';

// AdResult API Response Types
export interface AdResultCountResponse {
  success: boolean;
  response: {
    totalProjects: number;
  };
  error: null;
}

export interface AdResultAverageRatingResponse {
  success: boolean;
  response: {
    averageRating: number | null;
  };
  error: null;
}

export interface AdResultResponse {
  id: number;
  modelId: number;
  memberId: number;
  prompt: string;
  adResultName: string;
  memberRating: number | null;
  resultImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdResultListResponse {
  success: boolean;
  response: {
    content: AdResultResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  };
  error: null;
}

// AdResult API functions
export const getMyProjectCount = async (): Promise<AdResultCountResponse> => {
  const response = await GetAxiosInstance<AdResultCountResponse>('/api/ad-results/my/count');
  return response.data;
};

export const getMyAverageRating = async (): Promise<AdResultAverageRatingResponse> => {
  const response = await GetAxiosInstance<AdResultAverageRatingResponse>('/api/ad-results/my/average-rating');
  return response.data;
};

export const getMyAdResults = async (page: number = 0, size: number = 20): Promise<AdResultListResponse> => {
  const response = await GetAxiosInstance<AdResultListResponse>(
    `/api/ad-results/my?page=${page}&size=${size}&sort=createdAt,desc`
  );
  return response.data;
};

export const getMyAdResult = async (adResultId: number): Promise<{ success: boolean; response: AdResultResponse; error: null }> => {
  const response = await GetAxiosInstance<{ success: boolean; response: AdResultResponse; error: null }>(
    `/api/ad-results/my/${adResultId}`
  );
  return response.data;
};

// Helper function to convert API response to GeneratedProject

export const convertAdResultToProject = (adResult: AdResultResponse): GeneratedProject => {
  // Create a basic SelectedModel from API data (limited info available)
  const model: SelectedModel = {
    id: adResult.modelId.toString(),
    name: `Model ${adResult.modelId}`, // API doesn't provide model name
    prompt: adResult.prompt,
    seedValue: '12345', // API doesn't provide seed value
    imageUrl: adResult.resultImageUrl, // Use result image as model image
    category: 'fashion', // Default category, API doesn't provide this
    isCustom: false, // API doesn't provide this info
    metadata: {
      age: '20대',
      gender: '여성',
      style: '일반',
      ethnicity: '아시아'
    }
  };

  return {
    id: adResult.id.toString(),
    title: adResult.adResultName || `프로젝트 ${adResult.id}`,
    thumbnail: adResult.resultImageUrl,
    category: 'fashion', // API doesn't provide category
    model,
    originalPrompt: adResult.prompt,
    finalPrompt: adResult.prompt,
    generatedImages: [adResult.resultImageUrl],
    productImages: [], // API doesn't provide product images
    createdAt: new Date(adResult.createdAt),
    status: 'completed' as const, // Assume completed if it has a result
    settings: {
      background: '기본',
      style: '일반',
      lighting: '자동'
    },
    downloadCount: 0, // API doesn't provide download count
    isPublic: false, // Default to private
    rating: adResult.memberRating ? {
      overallRating: adResult.memberRating,
      categoryRatings: {
        quality: adResult.memberRating,
        accuracy: adResult.memberRating,
        creativity: adResult.memberRating,
        usefulness: adResult.memberRating
      },
      feedback: '',
      pros: [],
      cons: [],
      ratedAt: new Date(adResult.updatedAt),
      wouldRecommend: adResult.memberRating >= 4
    } : undefined
  };
};