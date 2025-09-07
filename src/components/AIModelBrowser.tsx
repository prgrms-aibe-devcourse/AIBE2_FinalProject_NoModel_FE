import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';
import { 
  Search, Star, Users, MoreHorizontal, Flag, 
  AlertCircle, Loader2, Crown, Sparkles, TrendingUp
} from 'lucide-react';
import { 
  searchModels, 
  getAdminModels, 
  getUserModels, 
  getPopularModels,
  getModelNameSuggestions
} from '../services/modelApi';
import { AIModelDocument, ModelSearchResponse } from '../types/model';
import { toast } from 'sonner';
import { UserProfile } from '../App';
import { ModelDetailDialog } from './ModelDetailDialog';

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

type TabType = 'search' | 'admin' | 'mymodels';

const TAB_CONFIG = {
  search: {
    label: '모델 검색',
    icon: Search,
    description: '키워드로 AI 모델 검색'
  },
  admin: {
    label: '관리자 모델',
    icon: Crown,
    description: '검증된 관리자 모델들'
  },
  mymodels: {
    label: '내 모델',
    icon: Sparkles,
    description: '내가 생성한 모델들'
  }
};

export const AIModelBrowser: React.FC<AIModelBrowserProps> = ({
  userProfile,
  onModelSelect,
  onModelReport,
  onLogin,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<AIModelDocument[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const suggestionTimeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 자동완성 검색
  const fetchSuggestions = useCallback(async (prefix: string) => {
    if (prefix.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await getModelNameSuggestions(prefix);
      if (response.success) {
        setSuggestions(response.response.slice(0, 5)); // 최대 5개만
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('자동완성 검색 에러:', error);
    }
  }, []);

  // 메인 검색/로드 함수
  const performSearch = useCallback(async (
    tab: TabType,
    keyword: string = '',
    page: number = 0,
    isLoadMore: boolean = false
  ) => {
    try {
      if (!isLoadMore) {
        setSearchState(prev => ({ ...prev, isLoading: true }));
      } else {
        setSearchState(prev => ({ ...prev, isLoadingMore: true }));
      }

      let response: ModelSearchResponse;

      switch (tab) {
        case 'search':
          if (!keyword.trim()) {
            // 검색어가 없으면 인기 모델 표시
            response = await getPopularModels({ page, size: 20 });
          } else {
            response = await searchModels({ keyword: keyword.trim(), page, size: 20 });
          }
          break;
        
        case 'admin':
          response = await getAdminModels({ page, size: 20 });
          break;
        
        case 'mymodels':
          if (!userProfile) {
            toast.error('로그인이 필요합니다.');
            onLogin();
            return;
          }
          response = await getUserModels({ 
            userId: parseInt(userProfile.id), 
            page, 
            size: 20 
          });
          break;
        
        default:
          throw new Error('Invalid tab type');
      }

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
      performSearch(activeTab, searchTerm, searchState.page + 1, true);
    }
  }, [searchState.hasMore, searchState.isLoadingMore, searchState.page, activeTab, searchTerm, performSearch]);

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

  // 검색어 변경 시 자동완성
  useEffect(() => {
    if (activeTab !== 'search') return;

    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    suggestionTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(searchTerm);
    }, 300);

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [searchTerm, activeTab, fetchSuggestions]);

  // 검색어 변경 시 디바운스 검색
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(activeTab, searchTerm, 0, false);
    }, activeTab === 'search' && searchTerm ? 500 : 0);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, activeTab, performSearch]);

  // 탭 변경 시 초기 로드
  useEffect(() => {
    performSearch(activeTab, searchTerm, 0, false);
  }, [activeTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: AIModelDocument) => {
    setSearchTerm(suggestion.modelName);
    setShowSuggestions(false);
    performSearch('search', suggestion.modelName, 0, false);
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

  const ModelCard = ({ model }: { model: AIModelDocument }) => {
    // 백엔드 데이터 구조에 맞게 필드 매핑
    const displayData = {
      thumbnailUrl: model.thumbnailUrl || '/api/placeholder/300/300',
      modelName: model.modelName,
      shortDescription: model.shortDescription || model.prompt || '',
      categoryType: model.categoryType || model.ownType,
      developer: model.developer || model.ownerName,
      rating: model.rating || 0,
      downloadCount: model.downloadCount || model.usageCount || 0,
      isAdmin: model.modelType === 'ADMIN' || model.ownType === 'ADMIN',
      isPublic: model.isPublic,
      tags: model.tags || [],
    };

    return (
      <Card className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="relative" onClick={() => handleModelCardClick(model)}>
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
                <DropdownMenuItem onClick={() => handleModelReport(model)}>
                  <Flag className="h-4 w-4 mr-2" />
                  신고하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="p-4" onClick={() => handleModelCardClick(model)}>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {displayData.categoryType}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {displayData.modelName}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {displayData.shortDescription}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{displayData.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="h-4 w-4" />
              <span className="text-sm">{displayData.downloadCount.toLocaleString()}</span>
            </div>
          </div>
          
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
          
          {/* 가격 정보 추가 */}
          {model.price && model.price > 0 && (
            <div className="mt-2 text-sm text-green-600 font-medium">
              {model.price.toLocaleString()}원
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 탭 네비게이션 */}
      <div className="flex gap-1 bg-muted/30 rounded-lg p-1 w-fit">
        {Object.entries(TAB_CONFIG).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Button
              key={key}
              variant={activeTab === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleTabChange(key as TabType)}
              className="px-4 h-9"
            >
              <Icon className="w-4 h-4 mr-2" />
              {config.label}
            </Button>
          );
        })}
      </div>

      {/* 탭 설명 */}
      <div className="text-sm text-gray-600">
        {TAB_CONFIG[activeTab].description}
        {searchState.totalElements > 0 && (
          <span className="ml-2">
            (총 {searchState.totalElements.toLocaleString()}개)
          </span>
        )}
      </div>

      {/* 검색 입력 - 검색 탭에서만 표시 */}
      {activeTab === 'search' && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              ref={inputRef}
              placeholder="AI 모델 검색... (빈 칸이면 인기 모델 표시)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 h-12"
            />
          </div>
          
          {/* 자동완성 목록 */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={suggestion.thumbnailUrl || '/api/placeholder/40/40'}
                      alt={suggestion.modelName}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-sm">{suggestion.modelName}</div>
                      <div className="text-xs text-gray-500">{suggestion.developer}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 검색 결과 */}
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
            {activeTab === 'search' && searchTerm 
              ? '검색 결과가 없습니다' 
              : activeTab === 'mymodels' 
                ? '생성한 모델이 없습니다'
                : '모델이 없습니다'
            }
          </h3>
          <p className="text-gray-600">
            {activeTab === 'search' && searchTerm 
              ? '다른 키워드로 다시 검색해보세요.' 
              : activeTab === 'mymodels' 
                ? '새 모델을 생성해보세요.'
                : '나중에 다시 확인해보세요.'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchState.models.map((model) => (
              <ModelCard key={model.id} model={model} />
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