import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DefaultAvatar } from './common/DefaultAvatar';
import { NavigationBar } from './NavigationBar';
import { 
  Search, ShoppingCart, Plus, 
  Crown, Wand2, Star, Coins, History
} from 'lucide-react';
import { SelectedModel, UserProfile } from '../App';
import axiosInstance from '../services/AxiosInstance';
import { AIModelDocument, PageResponse } from '../types/model';

interface ModelSelectionPageProps {
  selectedCategory: string;
  onModelSelect: (model: SelectedModel) => void;
  onBack: () => void;
  userProfile: UserProfile | null;
  onCreateModel: () => void;
  onBrowseMarketplace: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onAdmin?: () => void;
  onPointsSubscription?: () => void;
}

// API 타입 정의
interface ModelUsageHistoryResponse {
  adResultId: number;
  modelId: number;
  modelName: string;
  prompt: string;
  modelImageUrl: string;
  createdAt: string;
}

interface ModelUsageHistoryPageResponse {
  content: ModelUsageHistoryResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 사용한 모델 내역을 가져오는 API 함수
const fetchModelUsageHistory = async (page = 0, size = 20): Promise<ModelUsageHistoryPageResponse> => {
  try {
    const response = await axiosInstance.get(`/members/me/models/usage?page=${page}&size=${size}`);
    
    if (response.data.success) {
      return response.data.response;
    } else {
      throw new Error(response.data.error || 'Failed to fetch model usage history');
    }
  } catch (error) {
    console.error('Error fetching model usage history:', error);
    return {
      content: [],
      pageNumber: 0,
      pageSize: 20,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false
    };
  }
};

// 관리자 추천 모델을 가져오는 API 함수
const fetchRecommendedModels = async (page = 0, size = 10): Promise<PageResponse<AIModelDocument>> => {
  try {
    const response = await axiosInstance.get(`/models/search/recommended?page=${page}&size=${size}`);
    
    if (response.data.success) {
      return response.data.response;
    } else {
      throw new Error(response.data.error || 'Failed to fetch recommended models');
    }
  } catch (error) {
    console.error('Error fetching recommended models:', error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      number: 0,
      size: size,
      numberOfElements: 0
    };
  }
};



export function ModelSelectionPage({ 
  selectedCategory, 
  onModelSelect, 
  onBack, 
  userProfile, 
  onCreateModel, 
  onBrowseMarketplace,
  onLogin,
  onLogout,
  onAdGeneration,
  onMarketplace,
  onMyPage,
  onAdmin,
  onPointsSubscription
}: ModelSelectionPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('used-models');
  const [usedModels, setUsedModels] = useState<ModelUsageHistoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  
  // 추천 모델 상태
  const [recommendedModels, setRecommendedModels] = useState<AIModelDocument[]>([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  // API에서 사용한 모델 내역 가져오기
  useEffect(() => {
    if (activeTab === 'used-models' && userProfile) {
      loadUsedModels();
    }
  }, [activeTab, userProfile, currentPage]);

  // 마켓플레이스 탭에서 추천 모델 로드
  useEffect(() => {
    if (activeTab === 'marketplace') {
      loadRecommendedModels();
    }
  }, [activeTab]);

  const loadUsedModels = async () => {
    setLoading(true);
    try {
      const response = await fetchModelUsageHistory(currentPage, 20);
      setUsedModels(response.content);
      setHasNext(response.hasNext);
    } catch (error) {
      console.error('Failed to load used models:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedModels = async () => {
    setRecommendedLoading(true);
    try {
      const response = await fetchRecommendedModels(0, 3); // 3개만 한 줄로 표시
      setRecommendedModels(response.content);
    } catch (error) {
      console.error('Failed to load recommended models:', error);
    } finally {
      setRecommendedLoading(false);
    }
  };

  // 사용한 모델 필터링
  const filteredUsedModels = usedModels.filter(model => {
    const matchesSearch = !searchQuery || 
      model.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleUsedModelSelect = (model: ModelUsageHistoryResponse) => {
    const selectedModel: SelectedModel = {
      id: model.modelId.toString(),
      name: model.modelName,
      prompt: model.prompt,
      seedValue: '',
      imageUrl: model.modelImageUrl,
      category: selectedCategory,
      isCustom: false,
      metadata: {
        age: '알 수 없음',
        gender: '알 수 없음',
        style: '이전 사용',
        ethnicity: '알 수 없음'
      }
    };
    
    onModelSelect(selectedModel);
  };

  const handleMarketplaceModelSelect = (model: AIModelDocument) => {
    const selectedModel: SelectedModel = {
      id: model.id,
      name: model.modelName,
      prompt: model.prompt || '',
      seedValue: '',
      imageUrl: model.thumbnailUrl || '',
      category: selectedCategory,
      isCustom: false,
      metadata: {
        age: '알 수 없음',
        gender: '알 수 없음',
        style: model.categoryType || '알 수 없음',
        ethnicity: '알 수 없음'
      },
      creator: {
        id: model.ownerId.toString(),
        name: model.ownerName,
        avatar: undefined
      },
      price: model.price
    };
    
    onModelSelect(selectedModel);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      <NavigationBar
        onLogin={onLogin}
        onLogout={onLogout}
        onAdGeneration={onAdGeneration}
        onModelCreation={onCreateModel}
        onMarketplace={onMarketplace}
        onMyPage={onMyPage}
        onAdmin={onAdmin}
        isAdmin={userProfile?.role === 'ADMIN'}
        onHome={onBack}
        onBack={onBack}
        showBackButton={true}
        isLoggedIn={!!userProfile}
        isLandingPage={false}
        onPointsSubscription={onPointsSubscription}
        currentPage="adGeneration"
      />

      {/* Main Content */}
      <main className="page-container">
        {/* Page Header */}
        <div className="mb-8">
          <h1 
            className="mb-2"
            style={{
              fontSize: 'var(--font-size-title1)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}
          >
            AI 모델 선택
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            프로젝트에 사용할 AI 모델을 선택하세요. 무료 모델을 사용하거나 마켓플레이스에서 구매할 수 있습니다.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--color-text-tertiary)' }}
              />
              <Input
                placeholder="모델명 또는 프롬프트 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
                style={{
                  borderRadius: 'var(--radius-8)',
                  borderColor: 'var(--color-border-primary)',
                  backgroundColor: 'var(--color-input-background)',
                  fontSize: 'var(--font-size-regular)'
                }}
              />
            </div>
            
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList 
            className="grid w-full max-w-2xl grid-cols-3"
            style={{
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: 'var(--radius-12)',
              padding: '4px'
            }}
          >
            <TabsTrigger 
              value="used-models"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '12px 16px'
              }}
            >
              <History className="w-4 h-4" />
              사용한 모델
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '12px 16px'
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              마켓플레이스
            </TabsTrigger>
            <TabsTrigger 
              value="create"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '12px 16px'
              }}
            >
              <Wand2 className="w-4 h-4" />
              모델 생성
            </TabsTrigger>
          </TabsList>

          {/* Used Models Tab */}
          <TabsContent value="used-models" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 
                style={{
                  fontSize: 'var(--font-size-title2)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                사용한 모델 ({filteredUsedModels.length})
              </h2>
              {hasNext && (
                <Button 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  variant="outline"
                  disabled={loading}
                  style={{
                    borderRadius: 'var(--radius-8)',
                    borderColor: 'var(--color-border-primary)'
                  }}
                >
                  더 보기
                </Button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  사용한 모델을 불러오는 중...
                </p>
              </div>
            ) : filteredUsedModels.length === 0 ? (
              <div className="text-center py-12">
                <History 
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: 'var(--color-text-tertiary)' }}
                />
                <h3 
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-title3)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  사용한 모델이 없습니다
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  마켓플레이스에서 모델을 선택하거나 새로운 모델을 생성해보세요
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsedModels.map((model) => (
                  <Card 
                    key={model.adResultId}
                    className="group cursor-pointer transition-all hover:shadow-lg p-4"
                    style={{
                      backgroundColor: 'var(--color-background-primary)',
                      borderColor: 'var(--color-border-primary)',
                      borderRadius: 'var(--radius-16)',
                      boxShadow: 'var(--shadow-tiny)',
                      transition: 'all var(--animation-quick-transition) ease'
                    }}
                    onClick={() => handleUsedModelSelect(model)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
                    }}
                  >
                    {/* Model Thumbnail */}
                    <div 
                      className="relative w-full aspect-square mb-4 overflow-hidden"
                      style={{ borderRadius: 'var(--radius-12)' }}
                    >
                      {model.modelImageUrl ? (
                        <img 
                          src={model.modelImageUrl} 
                          alt={model.modelName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-background-secondary)' }}
                        >
                          <div className="text-center">
                            <Wand2 
                              className="w-8 h-8 mx-auto mb-2"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            />
                            <span 
                              className="text-xs"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            >
                              이미지 없음
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Used Badge */}
                      <div 
                        className="absolute top-2 right-2 text-xs"
                        style={{
                          backgroundColor: 'var(--color-semantic-blue)',
                          color: 'var(--color-utility-white)',
                          borderRadius: 'var(--radius-4)',
                          fontSize: 'var(--font-size-micro)',
                          padding: '2px 6px'
                        }}
                      >
                        사용함
                      </div>
                    </div>

                    {/* Model Info */}
                    <div>
                      <h3 
                        className="mb-1 line-clamp-1"
                        style={{
                          fontSize: 'var(--font-size-regular)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        {model.modelName}
                      </h3>
                      <p 
                        className="text-sm mb-2 line-clamp-2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {model.prompt}
                      </p>
                      
                      <div className="flex items-center justify-end text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Marketplace Preview Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 
                style={{
                  fontSize: 'var(--font-size-title2)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                인기 유료 모델
              </h2>
              <Button 
                onClick={onBrowseMarketplace}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)'
                }}
              >
                전체 보기
              </Button>
            </div>

            {recommendedLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  추천 모델을 불러오는 중...
                </p>
              </div>
            ) : recommendedModels.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart 
                  className="w-12 h-12 mx-auto mb-4"
                  style={{ color: 'var(--color-text-tertiary)' }}
                />
                <h3 
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-title3)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  추천 모델이 없습니다
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  현재 추천 가능한 모델이 없습니다
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedModels.map((model) => (
                <Card 
                  key={model.id}
                  className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)',
                    boxShadow: 'var(--shadow-tiny)',
                    transition: 'all var(--animation-quick-transition) ease'
                  }}
                  onClick={() => handleMarketplaceModelSelect(model)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
                  }}
                >
                    {/* Model Image */}
                    <div className="relative aspect-square overflow-hidden">
                      {model.thumbnailUrl ? (
                        <img 
                          src={model.thumbnailUrl} 
                          alt={model.modelName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-background-secondary)' }}
                        >
                          <div className="text-center">
                            <Wand2 
                              className="w-8 h-8 mx-auto mb-2"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            />
                            <span 
                              className="text-xs"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            >
                              이미지 없음
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Rating */}
                      {model.rating > 0 && (
                        <div 
                          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'var(--color-utility-white)'
                          }}
                        >
                          <Star className="w-3 h-3" />
                          {model.rating.toFixed(1)}
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          style={{
                            backgroundColor: 'var(--color-utility-white)',
                            color: 'var(--color-text-primary)',
                            borderRadius: 'var(--radius-8)'
                          }}
                        >
                          {userProfile && userProfile.points >= model.price ? '선택하기' : '포인트 부족'}
                        </Button>
                      </div>
                    </div>

                    {/* Model Info */}
                    <div className="p-4">
                      <h3 
                        className="mb-2 line-clamp-1"
                        style={{
                          fontSize: 'var(--font-size-regular)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        {model.modelName}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <DefaultAvatar 
                          name={model.ownerName}
                          className="h-5 w-5"
                          fallbackClassName="text-xs"
                        />
                        <span 
                          className="text-sm"
                          style={{ color: 'var(--color-text-tertiary)' }}
                        >
                          {model.ownerName}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        <span>{model.usageCount}회 사용됨</span>
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3" style={{ color: 'var(--color-semantic-orange)' }} />
                          {model.price}P
                        </div>
                      </div>
                    </div>
                </Card>
                ))}
              </div>
            )}

            {/* CTA Section */}
            <Card 
              className="p-8 text-center"
              style={{
                backgroundColor: 'var(--color-brand-accent-tint)',
                borderColor: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <ShoppingCart 
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: 'var(--color-brand-primary)' }}
              />
              <h3 
                className="mb-2"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                더 많은 모델을 찾고 계신가요?
              </h3>
              <p 
                className="mb-4"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                마켓플레이스에서 전문 크리에이터들이 만든 고품질 AI 모델을 만나보세요
              </p>
              <Button 
                onClick={onBrowseMarketplace}
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)'
                }}
              >
                마켓플레이스 둘러보기
              </Button>
            </Card>
          </TabsContent>

          {/* Create Model Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="text-center py-12">
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
              >
                <Wand2 
                  className="w-8 h-8"
                  style={{ color: 'var(--color-brand-primary)' }}
                />
              </div>
              
              <h2 
                className="mb-4"
                style={{
                  fontSize: 'var(--font-size-title2)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                나만의 AI 모델 만들기
              </h2>
              
              <p 
                className="mb-8 max-w-2xl mx-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                원하는 스타일의 AI 모델을 직접 생성하세요. 
                생성한 모델은 마켓플레이스에 판매하여 수익을 얻을 수도 있습니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
                <Card 
                  className="p-6 text-center"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)'
                  }}
                >
                  <div 
                    className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-semantic-blue)' + '20' }}
                  >
                    <Wand2 
                      className="w-6 h-6"
                      style={{ color: 'var(--color-semantic-blue)' }}
                    />
                  </div>
                  <h3 
                    className="mb-2"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    쉬운 생성
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    간단한 설정만으로 AI 모델을 생성할 수 있습니다
                  </p>
                </Card>

                <Card 
                  className="p-6 text-center"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)'
                  }}
                >
                  <div 
                    className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-semantic-green)' + '20' }}
                  >
                    <Coins 
                      className="w-6 h-6"
                      style={{ color: 'var(--color-semantic-green)' }}
                    />
                  </div>
                  <h3 
                    className="mb-2"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    수익 창출
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    마켓플레이스에 판매하여 포인트를 획득하세요
                  </p>
                </Card>

                <Card 
                  className="p-6 text-center"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)'
                  }}
                >
                  <div 
                    className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-semantic-orange)' + '20' }}
                  >
                    <Crown 
                      className="w-6 h-6"
                      style={{ color: 'var(--color-semantic-orange)' }}
                    />
                  </div>
                  <h3 
                    className="mb-2"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    고품질 결과
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    전문가 수준의 AI 모델을 생성할 수 있습니다
                  </p>
                </Card>
              </div>

              <Button 
                onClick={onCreateModel}
                size="lg"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-8)',
                  fontSize: 'var(--font-size-regular)',
                  padding: '16px 32px',
                  height: 'auto'
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                AI 모델 생성하기
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}