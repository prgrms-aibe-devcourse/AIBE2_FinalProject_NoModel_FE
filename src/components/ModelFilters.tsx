import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import {
  Search, Filter, Crown, User, X, ChevronDown
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
  userProfile?: { id: string | number } | null;
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
  const suggestionTimeoutRef = useRef<NodeJS.Timeout>();

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
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
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
      {/* 검색 및 필터 컨트롤 */}
      <div className="flex gap-3 items-center">
        {/* 검색 입력 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="모델명, 설명으로 검색... (Enter로 검색)"
            value={filters.keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 h-12"
          />

          {/* 자동완성 드롭다운 - 검색창 바로 아래에 절대 위치 */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-sm text-gray-800">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 모델 타입 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 px-4 gap-2 min-w-[140px]">
              {selectedTypeOption && (
                <selectedTypeOption.icon className="h-4 w-4" />
              )}
              <span>{selectedTypeOption?.label || '모델 타입'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {MODEL_TYPE_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleModelTypeChange(option.value)}
                className="flex items-center gap-2"
              >
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
                {filters.modelType === option.value && (
                  <Badge variant="secondary" className="ml-auto text-xs">선택됨</Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 검색 버튼 */}
        <Button onClick={onSearch} className="h-12 px-6">
          <Search className="h-4 w-4 mr-2" />
          검색
        </Button>

        {/* 필터 초기화 버튼 */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="h-12 px-4">
            <X className="h-4 w-4 mr-2" />
            초기화
          </Button>
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
        </div>
      )}

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