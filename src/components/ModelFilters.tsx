import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Search, Crown, User, X, Coins
} from 'lucide-react';
import { getModelNameSuggestions } from '../services/modelApi';

export interface ModelFilters {
  keyword: string;
  modelType: 'ALL' | 'ADMIN' | 'USER';
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
  { value: 'ALL' as const, label: '전체 모델', icon: Search },
  { value: 'ADMIN' as const, label: '관리자 모델', icon: Crown },
  { value: 'USER' as const, label: '내 모델', icon: User },
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
        setSuggestions(response.response.slice(0, 5)); // 최대 5개만
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

  const handleKeywordChange = (keyword: string) => {
    onFiltersChange({ ...filters, keyword });
  };

  const handleModelTypeChange = (modelType: ModelFilters['modelType']) => {
    const newFilters = { ...filters, modelType };

    // USER 모델 선택 시 userId 설정
    if (modelType === 'USER' && userProfile) {
      newFilters.userId = typeof userProfile.id === 'string' ? parseInt(userProfile.id) : userProfile.id;
    } else if (modelType !== 'USER') {
      delete newFilters.userId;
    }

    onFiltersChange(newFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const clearFilters = () => {
    onFiltersChange({
      keyword: '',
      modelType: 'ALL'
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

  const hasActiveFilters = filters.keyword || filters.modelType !== 'ALL';
  const selectedTypeOption = MODEL_TYPE_OPTIONS.find(opt => opt.value === filters.modelType);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 모델 타입 필터 및 보유 코인 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {MODEL_TYPE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={filters.modelType === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModelTypeChange(option.value)}
              className="px-4 h-9 gap-2"
            >
              <option.icon className="h-4 w-4" />
              {option.label}
            </Button>
          ))}
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
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">활성 필터:</span>

          {filters.keyword && (
            <Badge variant="secondary" className="gap-1">
              검색: "{filters.keyword}"
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => handleKeywordChange('')}
              />
            </Badge>
          )}

          {filters.modelType !== 'ALL' && (
            <Badge variant="secondary" className="gap-1">
              {selectedTypeOption?.label}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-500"
                onClick={() => handleModelTypeChange('ALL')}
              />
            </Badge>
          )}

          {/* 전체 초기화 버튼 */}
          <Button variant="outline" onClick={clearFilters} className="h-7 px-3 text-xs">
            <X className="h-3 w-3 mr-1" />
            전체 초기화
          </Button>
        </div>
      )}

      {/* 검색 입력 */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
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
            onBlur={() => {
              // 부드러운 사라짐을 위한 지연
              setTimeout(() => setShowSuggestions(false), 150);
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
            <div className="bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-all duration-200 ${
                    showSuggestions
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-1'
                  }`}
                  style={{
                    transitionDelay: showSuggestions ? `${index * 50}ms` : '0ms'
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
          </div>
        </div>

        {/* 검색 버튼 */}
        <Button onClick={onSearch} className="h-12 px-6">
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>
      </div>

      {/* 자동완성으로 인한 레이아웃 시프트 방지 */}
      <div
        className="transition-all duration-300 ease-out"
        style={{
          height: showSuggestions && suggestions.length > 0
            ? Math.min(suggestions.length * 60, 240) + 'px'
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