import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { StarRating } from './StarRating';
import { Skeleton } from './ui/skeleton';
import { 
  Search, Star, Users, Coins, MoreHorizontal, Flag, 
  AlertCircle, Loader2, ChevronDown, SortAsc, TrendingUp, Clock
} from 'lucide-react';
import { searchModels } from '../services/modelApi';
import { AIModel } from '../types/model';
import { toast } from 'sonner';
import { UserProfile } from '../App';

interface ModelSearchProps {
  userProfile: UserProfile | null;
  onModelSelect?: (model: AIModel) => void;
  onModelReport: (model: AIModel) => void;
  onLogin: () => void;
  className?: string;
}

interface SearchState {
  models: AIModel[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  page: number;
  totalElements: number;
}

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'downloadCount,desc', label: '인기순' },
  { value: 'rating,desc', label: '평점순' },
  { value: 'modelName,asc', label: '이름순' }
];

export const ModelSearch: React.FC<ModelSearchProps> = ({
  userProfile,
  onModelSelect,
  onModelReport,
  onLogin,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [searchState, setSearchState] = useState<SearchState>({
    models: [],
    hasMore: true,
    isLoading: false,
    isLoadingMore: false,
    page: 0,
    totalElements: 0
  });

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 검색 실행
  const performSearch = useCallback(async (
    keyword: string = searchTerm,
    sort: string = sortBy,
    page: number = 0,
    isLoadMore: boolean = false
  ) => {
    try {
      if (!isLoadMore) {
        setSearchState(prev => ({ ...prev, isLoading: true }));
      } else {
        setSearchState(prev => ({ ...prev, isLoadingMore: true }));
      }

      const response = await searchModels({
        keyword: keyword.trim() || undefined,
        page,
        size: 20,
        sort
      });

      setSearchState(prev => ({
        ...prev,
        models: isLoadMore ? [...prev.models, ...response.response.content] : response.response.content,
        hasMore: !response.response.last,
        page: response.response.pageable.pageNumber,
        totalElements: response.response.totalElements,
        isLoading: false,
        isLoadingMore: false
      }));

    } catch (error) {
      console.error('모델 검색 에러:', error);
      toast.error('검색 중 오류가 발생했습니다.');
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        isLoadingMore: false
      }));
    }
  }, [searchTerm, sortBy]);

  // 무한 스크롤 콜백
  const loadMoreCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && searchState.hasMore && !searchState.isLoadingMore) {
      performSearch(searchTerm, sortBy, searchState.page + 1, true);
    }
  }, [searchState.hasMore, searchState.isLoadingMore, searchState.page, searchTerm, sortBy, performSearch]);

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

  // 검색어 변경 시 디바운스 처리
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchTerm, sortBy, 0, false);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, sortBy, performSearch]);

  // 초기 로드
  useEffect(() => {
    performSearch('', sortBy, 0, false);
  }, []);

  const handleModelReport = (model: AIModel) => {
    if (!userProfile) {
      toast.error('로그인이 필요합니다.');
      onLogin();
      return;
    }
    onModelReport(model);
  };

  const ModelCard = ({ model }: { model: AIModel }) => (
    <Card className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div className="relative">
        <img
          src={model.thumbnailUrl || '/api/placeholder/300/300'}
          alt={model.modelName}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
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
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {model.categoryType}
          </Badge>
          {model.isPublic && (
            <Badge variant="outline" className="text-xs">
              공개
            </Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {model.modelName}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {model.shortDescription}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{model.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Users className="h-4 w-4" />
            <span className="text-sm">{model.downloadCount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            by {model.developer}
          </div>
          {onModelSelect && (
            <Button 
              size="sm" 
              onClick={() => onModelSelect(model)}
              className="h-8"
            >
              선택
            </Button>
          )}
        </div>
        
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {model.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {model.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{model.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 검색 헤더 */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="AI 모델 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {searchState.totalElements > 0 && (
              <>총 {searchState.totalElements.toLocaleString()}개 모델</>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SortAsc className="h-4 w-4 mr-2" />
                {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 검색 결과 */}
      {searchState.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : searchState.models.length === 0 ? (
        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-gray-600">
            다른 키워드로 다시 검색해보세요.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchState.models.map((model) => (
              <ModelCard key={model.modelId} model={model} />
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
  );
};