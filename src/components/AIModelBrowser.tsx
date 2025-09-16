import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import {
  Star, Download, MoreHorizontal, Flag,
  AlertCircle, Loader2, Crown, Eye, Coins
} from 'lucide-react';
import {
  searchModelsWithFilters,
  FilteredSearchParams
} from '../services/modelApi';
import { AIModelDocument } from '../types/model';
import { toast } from 'sonner';
import { UserProfile } from '../App';
import { ModelDetailDialog } from './ModelDetailDialog';
import { ModelFilters, ModelFilters as ModelFiltersType } from './ModelFilters';

interface AIModelBrowserProps {
  userProfile: UserProfile | null;
  onModelSelect?: (model: AIModelDocument) => void;
  onModelReport: (model: AIModelDocument) => void;
  onLogin: () => void;
  className?: string;
}

interface SearchState {
  models: AIModelDocument[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  page: number;
  totalElements: number;
}

// ModelCard 컴포넌트를 바깥으로 분리하고 React.memo 적용
const ModelCard = memo(({
  model,
  onModelReport,
  onModelSelect,
  onModelCardClick
}: {
  model: AIModelDocument;
  onModelReport: (model: AIModelDocument) => void;
  onModelSelect?: (model: AIModelDocument) => void;
  onModelCardClick: (model: AIModelDocument) => void;
}) => {
  // 백엔드 데이터 구조에 맞게 필드 매핑
  const displayData = {
    thumbnailUrl: model.thumbnailUrl || '/api/placeholder/300/300',
    modelName: model.modelName,
    shortDescription: model.shortDescription || model.prompt || '',
    categoryType: model.categoryType || model.ownType,
    developer: model.developer || model.ownerName,
    rating: model.rating || 0,
    downloadCount: model.downloadCount || model.usageCount || 0,
    viewCount: model.viewCount || 0,
    isAdmin: model.modelType === 'ADMIN' || model.ownType === 'ADMIN',
    isPublic: model.isPublic,
    tags: model.tags || [],
  };

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="relative" onClick={() => onModelCardClick(model)}>
        <img
          src={displayData.thumbnailUrl}
          alt={displayData.modelName}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          {displayData.isAdmin && (
            <Badge className="bg-yellow-500 text-white">
              <Crown className="h-3 w-3 mr-1" />
              관리자
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onModelReport(model)}>
                <Flag className="h-4 w-4 mr-2" />
                신고하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-4" onClick={() => onModelCardClick(model)}>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {displayData.categoryType}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {displayData.modelName}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{displayData.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {displayData.shortDescription}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            by {displayData.developer}
          </div>
          {onModelSelect && (
            <Button
              size="sm"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onModelSelect(model);
              }}
              className="h-8"
            >
              선택
            </Button>
          )}
        </div>

        {displayData.tags && displayData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {displayData.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {displayData.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{displayData.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* 가격 및 통계 정보 */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="text-sm text-green-600 font-medium">
            {model.price && model.price > 0 ? `${model.price.toLocaleString()}원` : '무료'}
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{displayData.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{displayData.downloadCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

export const AIModelBrowser: React.FC<AIModelBrowserProps> = ({
  userProfile,
  onModelSelect,
  onModelReport,
  onLogin,
  className = ''
}) => {
  // 필터 상태
  const [filters, setFilters] = useState<ModelFiltersType>({
    keyword: '',
    modelType: 'ALL'
  });

  const [searchState, setSearchState] = useState<SearchState>({
    models: [],
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    page: 0,
    totalElements: 0
  });

  // 모델 상세 다이얼로그 상태
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 메인 검색/로드 함수
  const performSearch = useCallback(async (
    searchFilters: ModelFiltersType,
    page: number = 0,
    isLoadMore: boolean = false
  ) => {
    try {
      if (!isLoadMore) {
        setSearchState(prev => ({ ...prev, isLoading: true }));
      } else {
        setSearchState(prev => ({ ...prev, isLoadingMore: true }));
      }

      // 필터 파라미터 구성
      const searchParams: FilteredSearchParams = {
        modelType: searchFilters.modelType,
        keyword: searchFilters.keyword || undefined,
        page,
        size: 20
      };

      // USER 모델 타입이고 사용자가 로그인되어 있지 않은 경우
      if (searchFilters.modelType === 'USER' && !userProfile) {
        toast.error('로그인이 필요합니다.');
        onLogin();
        setSearchState(prev => ({
          ...prev,
          isLoading: false,
          isLoadingMore: false
        }));
        return;
      }

      // USER 모델 타입인 경우 userId 추가
      if (searchFilters.modelType === 'USER' && userProfile) {
        searchParams.userId = typeof userProfile.id === 'string' ? parseInt(userProfile.id) : userProfile.id;
      }

      const response = await searchModelsWithFilters(searchParams);

      if (response.success) {
        setSearchState(prev => ({
          ...prev,
          models: isLoadMore ? [...prev.models, ...response.response.content] : response.response.content,
          hasMore: !response.response.last,
          page: response.response.number || response.response.pageable?.pageNumber || page,
          totalElements: response.response.totalElements,
          isLoading: false,
          isLoadingMore: false
        }));
      } else {
        throw new Error('API response not successful');
      }

    } catch (error) {
      console.error('검색 에러:', error);
      toast.error('검색 중 오류가 발생했습니다.');
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        isLoadingMore: false
      }));
    }
  }, [userProfile, onLogin]);

  // 무한 스크롤 콜백
  const loadMoreCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && searchState.hasMore && !searchState.isLoadingMore) {
      performSearch(filters, searchState.page + 1, true);
    }
  }, [searchState.hasMore, searchState.isLoadingMore, searchState.page, filters, performSearch]);

  // 무한 스크롤 설정
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(loadMoreCallback, {
      threshold: 0.1
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreCallback]);


  // 초기 로드 (빈 키워드로 인기 모델 표시)
  useEffect(() => {
    performSearch(filters, 0, false);
  }, [performSearch]);

  // 필터 변경 핸들러
  const handleFiltersChange = (newFilters: ModelFiltersType) => {
    setFilters(newFilters);
  };

  // 검색 실행 핸들러
  const handleSearch = () => {
    performSearch(filters, 0, false);
  };

  // 자동완성 선택 핸들러
  const handleSuggestionSelect = (suggestion: string) => {
    const newFilters = { ...filters, keyword: suggestion };
    setFilters(newFilters);
    performSearch(newFilters, 0, false);
  };

  const handleModelReport = (model: AIModelDocument) => {
    if (!userProfile) {
      toast.error('로그인이 필요합니다.');
      onLogin();
      return;
    }
    onModelReport(model);
  };

  const handleModelCardClick = (model: AIModelDocument) => {
    setSelectedModelId(model.modelId);
    setDetailDialogOpen(true);
  };

  const handleDetailDialogModelSelect = (modelId: number) => {
    const model = searchState.models.find(m => m.modelId === modelId);
    if (model && onModelSelect) {
      onModelSelect(model);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 필터 컴포넌트 */}
      <ModelFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onSuggestionSelect={handleSuggestionSelect}
        userProfile={userProfile}
      />

      {/* 결과 카운트 */}
      <div className="text-sm text-gray-600">
        {searchState.totalElements > 0 && (
          <span>총 {searchState.totalElements.toLocaleString()}개의 모델</span>
        )}
        {userProfile && typeof userProfile.points === 'number' && (
          <Badge
            variant="secondary"
            className="ml-4 flex items-center gap-2 px-3 py-1.5"
            style={{
              backgroundColor: '#FFF7ED',
              borderColor: '#FED7AA',
              color: '#C2410C'
            }}
          >
            <Coins className="w-4 h-4" style={{ color: '#F97316' }} />
            <span className="text-sm font-semibold" style={{ color: '#F97316' }}>
              {userProfile.points.toLocaleString()}P
            </span>
          </Badge>
        )}
      </div>

      {/* 검색 결과 */}
      <div>
        {searchState.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        ) : searchState.models.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.keyword
                ? '검색 결과가 없습니다'
                : filters.modelType === 'USER'
                ? '생성한 모델이 없습니다'
                : '모델이 없습니다'
              }
            </h3>
            <p className="text-gray-600">
              {filters.keyword
                ? '다른 키워드로 다시 검색해보세요.'
                : filters.modelType === 'USER'
                ? '새 모델을 생성해보세요.'
                : '나중에 다시 확인해보세요.'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchState.models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onModelReport={handleModelReport}
                  onModelSelect={onModelSelect}
                  onModelCardClick={handleModelCardClick}
                />
              ))}
            </div>

            {/* 무한 스크롤 트리거 */}
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {searchState.isLoadingMore && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  더 많은 모델을 불러오는 중...
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 모델 상세 다이얼로그 */}
      <ModelDetailDialog
        modelId={selectedModelId}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onModelSelect={onModelSelect ? handleDetailDialogModelSelect : undefined}
      />
    </div>
  );
};