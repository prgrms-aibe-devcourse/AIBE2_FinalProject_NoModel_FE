import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Search, Crown, User, X, Coins, Globe, DollarSign, Gift, Filter, ChevronDown
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { getModelNameSuggestions } from '../services/modelApi';

export interface ModelFilters {
  keyword: string;
  modelType: 'ALL' | 'ADMIN' | 'USER';
  priceType: 'ALL' | 'FREE' | 'PAID';
  userId?: number;
}

interface ModelFiltersProps {
  filters: ModelFilters;
  onFiltersChange: (filters: ModelFilters) => void;
  onSearch: () => void;
  userProfile?: { id: string | number; points?: number } | null;
  className?: string;
  onSuggestionSelect?: (suggestion: string) => void;
}

const MODEL_TYPE_OPTIONS = [
  { value: 'ALL' as const, label: '모든 모델', icon: Globe },
  { value: 'ADMIN' as const, label: '자체 모델', icon: Crown },
  { value: 'USER' as const, label: '내 모델', icon: User },
];

const PRICE_TYPE_OPTIONS = [
  { value: 'ALL' as const, label: '모든 가격', icon: Globe },
  { value: 'FREE' as const, label: '무료', icon: Gift },
  { value: 'PAID' as const, label: '유료', icon: DollarSign },
];

export const ModelFilters: React.FC<ModelFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  userProfile,
  className = '',
  onSuggestionSelect
}) => {
  // 자동완성 상태
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout>();
  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 자동완성 검색
  const fetchSuggestions = useCallback(async (prefix: string) => {
    if (prefix.length < 2) {
      setShowSuggestions(false);
      // 애니메이션 후 suggestions 클리어
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setSuggestions([]);
      }, 300);
      return;
    }

    try {
      const response = await getModelNameSuggestions(prefix);
      if (response.success) {
        setSuggestions(response.response.slice(0, 10)); // 최대 10개
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('자동완성 검색 에러:', error);
    }
  }, []);

  // 자동완성 디바운싱
  useEffect(() => {
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    if (filters.keyword.trim()) {
      suggestionTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(filters.keyword);
      }, 300);
    } else {
      setShowSuggestions(false);
      // 애니메이션 후 suggestions 클리어
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setSuggestions([]);
      }, 300);
    }

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [filters.keyword, fetchSuggestions]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeywordChange = (keyword: string) => {
    onFiltersChange({ ...filters, keyword });
  };

  const handleModelTypeChange = (modelType: ModelFilters['modelType']) => {
    onFiltersChange({ ...filters, modelType });
  };

  const handlePriceTypeChange = (priceType: ModelFilters['priceType']) => {
    onFiltersChange({ ...filters, priceType });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      keyword: '',
      modelType: 'ALL',
      priceType: 'ALL'
    });
    setShowSuggestions(false);
  };

  // 자동완성 선택 핸들러
  const handleSuggestionClick = (suggestion: string) => {
    const newFilters = { ...filters, keyword: suggestion };
    onFiltersChange(newFilters);
    setShowSuggestions(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const hasActiveFilters = filters.keyword || filters.modelType !== 'ALL' || filters.priceType !== 'ALL';
  const selectedTypeOption = MODEL_TYPE_OPTIONS.find(opt => opt.value === filters.modelType);
  const selectedPriceOption = PRICE_TYPE_OPTIONS.find(opt => opt.value === filters.priceType);

  const ActiveFilterTag = ({ label, onClear }: { label: string; onClear: () => void }) => (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
    >
      <span>{label}</span>
      <X className="h-3 w-3" />
    </button>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 필터 및 보유 코인 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {/* 모델 타입 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-4 h-9 gap-2">
                {selectedTypeOption && <selectedTypeOption.icon className="h-4 w-4" />}
                {selectedTypeOption?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {MODEL_TYPE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleModelTypeChange(option.value)}
                  className="gap-2"
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 가격 필터 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-4 h-9 gap-2">
                {selectedPriceOption && <selectedPriceOption.icon className="h-4 w-4" />}
                {selectedPriceOption?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              {PRICE_TYPE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handlePriceTypeChange(option.value)}
                  className="gap-2"
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 필터 초기화 버튼 */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-3 text-gray-500">
              <X className="h-4 w-4 mr-1" />
              초기화
            </Button>
          )}
        </div>

        {/* 보유 코인 표시 */}
        {userProfile && typeof userProfile.points === 'number' && (
          <Badge
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1.5 h-9 shrink-0"
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

      {/* 활성 필터 표시 */}
      {(filters.keyword || filters.modelType !== 'ALL' || filters.priceType !== 'ALL') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Filter className="h-4 w-4" />
            활성 필터:
          </span>

          {filters.keyword && (
            <ActiveFilterTag
              label={`검색: "${filters.keyword}"`}
              onClear={() => handleKeywordChange('')}
            />
          )}

          {filters.modelType !== 'ALL' && selectedTypeOption && (
            <ActiveFilterTag
              label={selectedTypeOption.label}
              onClear={() => handleModelTypeChange('ALL')}
            />
          )}

          {filters.priceType !== 'ALL' && selectedPriceOption && (
            <ActiveFilterTag
              label={selectedPriceOption.label}
              onClear={() => handlePriceTypeChange('ALL')}
            />
          )}
        </div>
      )}

      {/* 검색 입력 */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative" ref={searchContainerRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="모델명, 설명으로 검색... (Enter로 검색)"
            value={filters.keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => {
              if (suggestions.length > 0 && filters.keyword.trim().length >= 2) {
                setShowSuggestions(true);
              }
            }}
            className="pl-10 h-12"
          />

          {/* 자동완성 드롭다운 - 검색창 바로 아래에 절대 위치 */}
          <div
            className={`absolute top-full left-0 right-0 z-[60] mt-1 overflow-hidden transition-all duration-300 ease-out ${
              showSuggestions && suggestions.length > 0
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="bg-white border rounded-lg shadow-lg">
              {/* 3개 항목 표시하는 스크롤 가능한 컨테이너 */}
              <div
                className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                style={{ maxHeight: '180px' }} // 3개 항목 높이 (60px * 3)
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-all duration-200 ${
                      showSuggestions
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-1'
                    }`}
                    style={{
                      transitionDelay: showSuggestions ? `${Math.min(index, 2) * 50}ms` : '0ms',
                      minHeight: '60px'
                    }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-sm text-gray-800">{suggestion}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 스크롤 힌트 (4개 이상일 때만 표시) */}
              {suggestions.length > 3 && (
                <div className="px-4 py-2 bg-gray-50 border-t text-center">
                  <span className="text-xs text-gray-500">
                    {suggestions.length}개 결과 • 스크롤하여 더 보기
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 검색 버튼 */}
        <Button onClick={onSearch} className="h-12 px-6">
          검색
        </Button>
      </div>

      {/* 자동완성으로 인한 레이아웃 시프트 방지 */}
      <div
        className="transition-all duration-300 ease-out"
        style={{
          height: showSuggestions && suggestions.length > 0
            ? suggestions.length > 3
              ? '220px' // 3개 항목 + 스크롤 힌트 영역 (180px + 40px)
              : `${suggestions.length * 60}px` // 실제 항목 수만큼
            : '0px'
        }}
      />

      {/* 사용자 알림 */}
      {filters.modelType === 'USER' && !userProfile && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            내 모델을 보려면 로그인이 필요합니다.
          </p>
        </div>
      )}
    </div>
  );
};
