import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DefaultAvatar } from './common/DefaultAvatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { StarRating } from './StarRating';
import { NavigationBar } from './NavigationBar';
import { Skeleton } from './ui/skeleton';
import { ModelDetailDialog } from './ModelDetailDialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import {
  Search, MoreHorizontal, Eye,
  Users, Coins, BarChart3,
  Globe, EyeOff, Activity, Star, Filter
} from 'lucide-react';
import { UserProfile, UserModel, PointTransaction } from '../App';
import type { UserModelStatsResponse } from '@/types/model';
import { updateMyModel } from '@/services/modelApi';
import { toast } from 'sonner';

interface MyModelsProps {
  userProfile: UserProfile | null;
  userModels: UserModel[];
  modelStats?: UserModelStatsResponse | null;
  isLoading?: boolean;
  fetchError?: string | null;
  pointTransactions: PointTransaction[];
  onBack: () => void;
  onCreateModel: () => void;
  onModelUpdate: (model: UserModel) => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  onAdmin?: () => void;
  onPointsSubscription?: () => void;
}


const categoryNames: Record<string, string> = {
  admin: '관리자 모델',
  user: '사용자 모델'
};

export function MyModels({ 
  userProfile, 
  userModels = [], 
  modelStats: modelStatsData,
  isLoading = false,
  fetchError,
  pointTransactions, 
  onBack, 
  onCreateModel, 
  onModelUpdate,
  onLogin,
  onLogout,
  onAdGeneration,
  onMarketplace,
  onMyPage,
  onAdmin,
  onPointsSubscription
}: MyModelsProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'earnings' | 'rating'>('newest');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedModelIdForDetail, setSelectedModelIdForDetail] = useState<number | null>(null);
  const [updatingModelIds, setUpdatingModelIds] = useState<Record<string, boolean>>({});
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceEditingModel, setPriceEditingModel] = useState<UserModel | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [priceSubmitting, setPriceSubmitting] = useState(false);

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let filtered = userModels.filter(model => {
      if (selectedCategory !== 'all' && model.category !== selectedCategory) return false;
      if (searchQuery && !model.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'popular':
          return b.usageCount - a.usageCount;
        case 'earnings':
          return b.earnings - a.earnings;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [userModels, searchQuery, selectedCategory, sortBy]);

  const totalEarnings = useMemo(() => {
    return userModels.reduce((sum, model) => sum + (model.earnings ?? 0), 0);
  }, [userModels]);

  const aggregatedStats = useMemo(() => {
    if (userModels.length === 0 && modelStatsData) {
      return {
        totalModels: modelStatsData.totalModelCount ?? 0,
        totalUsage: modelStatsData.totalUsageCount ?? 0,
        totalEarnings,
        avgRating: modelStatsData.averageRating ?? 0,
        publicModels: modelStatsData.publicModelCount ?? 0
      };
    }

    const totalUsage = userModels.reduce((sum, model) => sum + model.usageCount, 0);
    const avgRating = userModels.length > 0
      ? userModels.reduce((sum, model) => sum + model.rating, 0) / userModels.length
      : 0;
    const publicModels = userModels.filter(model => model.isPublic).length;

    return {
      totalModels: userModels.length,
      totalUsage,
      totalEarnings,
      avgRating,
      publicModels
    };
  }, [modelStatsData, totalEarnings, userModels]);

  // Filter earnings transactions
  const earningsTransactions = useMemo(() => {
    return pointTransactions
      .filter(t => t.type === 'earned' && t.relatedModelId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }, [pointTransactions]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const setModelUpdating = (modelId: string, value: boolean) => {
    setUpdatingModelIds(prev => {
      if (value) {
        return { ...prev, [modelId]: true };
      }
      const { [modelId]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const openPriceDialog = (model: UserModel) => {
    setPriceEditingModel(model);
    setPriceInput(model.price > 0 ? model.price.toString() : '0');
    setPriceDialogOpen(true);
  };

  const closePriceDialog = () => {
    setPriceDialogOpen(false);
    setPriceEditingModel(null);
    setPriceInput('');
    setPriceSubmitting(false);
  };

  const handlePriceSubmit = async () => {
    if (!priceEditingModel) return;

    const numericId = Number(priceEditingModel.id);
    if (Number.isNaN(numericId)) {
      toast.error('모델 ID가 올바르지 않습니다.');
      return;
    }

    const parsed = Number(priceInput);
    if (!Number.isFinite(parsed) || parsed < 0) {
      toast.error('0 이상 숫자를 입력해주세요.');
      return;
    }

    const modelId = priceEditingModel.id;
    setPriceSubmitting(true);
    setModelUpdating(modelId, true);

    try {
      await updateMyModel({ updateType: 'PRICE', modelId: numericId, newPrice: parsed });
      onModelUpdate({
        ...priceEditingModel,
        price: parsed,
        isForSale: parsed > 0,
        updatedAt: new Date()
      });
      toast.success('모델 가격이 업데이트되었습니다.');
      closePriceDialog();
    } catch (error) {
      console.error('모델 가격 업데이트 실패:', error);
      toast.error('모델 가격을 업데이트하지 못했습니다.');
    } finally {
      setModelUpdating(modelId, false);
      setPriceSubmitting(false);
    }
  };

  const handleModelToggleVisibility = async (model: UserModel) => {
    const numericId = Number(model.id);
    if (Number.isNaN(numericId)) {
      toast.error('모델 ID가 올바르지 않습니다.');
      return;
    }

    const nextVisibility = !model.isPublic;
    setModelUpdating(model.id, true);

    try {
      await updateMyModel({ updateType: 'VISIBILITY', modelId: numericId, isPublic: nextVisibility });
      onModelUpdate({ ...model, isPublic: nextVisibility });
      toast.success(nextVisibility ? '모델이 공개 상태로 변경되었습니다.' : '모델이 비공개로 변경되었습니다.');
    } catch (error) {
      console.error('모델 공개 상태 변경 실패:', error);
      toast.error('모델 공개 상태를 변경하지 못했습니다.');
    } finally {
      setModelUpdating(model.id, false);
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

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
        userPoints={userProfile?.points}
        currentPage="modelCreation"
      />

      {/* Main Content */}
      <main className="page-container">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <DefaultAvatar 
              name={userProfile.name}
              className="w-12 h-12"
            />
            <div>
              <h1 
                style={{
                  fontSize: 'var(--font-size-title1)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                {userProfile.name}의 AI 모델
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                생성한 모델을 관리하고 수익을 확인하세요
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-brand-accent-tint)' }}
                >
                  <Users 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-brand-primary)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    총 모델
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {isLoading ? '...' : aggregatedStats.totalModels.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-blue)' + '20' }}
                >
                  <Activity 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-blue)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    총 사용
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {isLoading ? '...' : aggregatedStats.totalUsage.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-green)' + '20' }}
                >
                  <Coins 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-green)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    총 수익
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {isLoading ? '...' : `${aggregatedStats.totalEarnings.toLocaleString()}P`}
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-orange)' + '20' }}
                >
                  <Star 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-orange)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    평균 평점
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {isLoading ? '...' : aggregatedStats.avgRating > 0 ? aggregatedStats.avgRating.toFixed(1) : '-'}
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-12)'
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-semantic-indigo)' + '20' }}
                >
                  <Globe 
                    className="w-5 h-5"
                    style={{ color: 'var(--color-semantic-indigo)' }}
                  />
                </div>
                <div>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    공개 모델
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title3)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {isLoading ? '...' : aggregatedStats.publicModels.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {fetchError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm" style={{ color: 'var(--color-semantic-red)' }}>
            {fetchError}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList 
            className="grid w-full max-w-md grid-cols-2"
            style={{
              backgroundColor: 'var(--color-background-secondary)',
              borderRadius: 'var(--radius-12)',
              padding: '4px'
            }}
          >
            <TabsTrigger 
              value="models"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '8px 16px'
              }}
            >
              <Users className="w-4 h-4" />
              모델 관리
            </TabsTrigger>
            <TabsTrigger 
              value="earnings"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '8px 16px'
              }}
            >
              <BarChart3 className="w-4 h-4" />
              수익 내역
            </TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            {/* Search and Filters Section */}
            <div className="mb-8">
              {/* Search Bar with Integrated Filters */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex-1 max-w-xl">
                  <div className="relative">
                    <Search 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    />
                    <Input
                      placeholder="내 모델 검색..."
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
                  
                  {/* Filter Row - Close to Search */}
                  <div className="flex flex-wrap gap-3 mt-3 items-center">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    
                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="카테고리" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 카테고리</SelectItem>
                        {Object.entries(categoryNames).map(([key, name]) => (
                          <SelectItem key={key} value={key}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as typeof sortBy)}>
                      <SelectTrigger className="w-28 h-9">
                        <SelectValue placeholder="정렬" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">최신순</SelectItem>
                        <SelectItem value="popular">인기순</SelectItem>
                        <SelectItem value="earnings">수익순</SelectItem>
                        <SelectItem value="rating">평점순</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <span className="text-sm text-muted-foreground">
                      {filteredModels.length}개 모델
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Models List */}
            {isLoading && userModels.length === 0 ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Card 
                    key={index}
                    className="p-6"
                    style={{
                      backgroundColor: 'var(--color-background-primary)',
                      borderColor: 'var(--color-border-primary)',
                      borderRadius: 'var(--radius-16)'
                    }}
                  >
                    <div className="flex items-center gap-6">
                      <Skeleton className="h-20 w-20 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-20" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="text-center py-12">
                <Users 
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
                  모델이 없습니다
                </h3>
                <p
                  className="mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  상단의 "모델 제작" 버튼을 클릭해서 첫 번째 AI 모델을 생성해보세요
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredModels.map((model) => {
                  const isUpdating = !!updatingModelIds[model.id];

                  return (
                  <Card 
                    key={model.id}
                    className="p-6 cursor-pointer transition-transform hover:translate-y-[-2px]"
                    style={{
                      backgroundColor: 'var(--color-background-primary)',
                      borderColor: 'var(--color-border-primary)',
                      borderRadius: 'var(--radius-16)'
                    }}
                    onClick={() => {
                      if (isUpdating) {
                        return;
                      }
                      const numericId = Number(model.id);
                      if (Number.isNaN(numericId)) {
                        console.warn('모델 상세를 열 수 없습니다. 숫자 ID가 아닙니다:', model.id);
                        return;
                      }
                      setSelectedModelIdForDetail(numericId);
                      setDetailDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-6">
                      {/* Model Image */}
                      <div 
                        className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-background-secondary)' }}
                      >
                        <img 
                          src={model.imageUrl} 
                          alt={model.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Model Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 
                                className="truncate"
                                style={{
                                  fontSize: 'var(--font-size-regular)',
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: 'var(--color-text-primary)'
                                }}
                              >
                                {model.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className="text-xs"
                                  style={model.isPublic ? {
                                    backgroundColor: 'var(--color-semantic-green)' + '20',
                                    color: 'var(--color-semantic-green)',
                                    borderRadius: 'var(--radius-4)'
                                  } : {
                                    backgroundColor: 'var(--color-background-tertiary)',
                                    color: 'var(--color-text-secondary)',
                                    borderRadius: 'var(--radius-4)'
                                  }}
                                >
                                  {model.isPublic ? (
                                    <>
                                      <Eye className="w-3 h-3 mr-1" />
                                      공개
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="w-3 h-3 mr-1" />
                                      비공개
                                    </>
                                  )}
                                </Badge>
                              </div>
                            </div>
                            <p 
                              className="text-sm mb-2 line-clamp-2"
                              style={{ color: 'var(--color-text-secondary)' }}
                            >
                              {model.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                              <span>{categoryNames[model.category] ?? '분류 없음'}</span>
                              <span>•</span>
                              <span>{formatDate(model.createdAt)}</span>
                              <span>•</span>
                              <span>{model.usageCount}회 사용됨</span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 ml-4 space-y-2">
                            <div>
                              <p className="text-xs text-muted-foreground">가격</p>
                              <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                {model.price.toLocaleString()}P
                              </p>
                            </div>
                            <div className="flex items-center justify-end gap-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                              <StarRating rating={model.rating} readonly size="sm" />
                              <span>({model.ratingCount})</span>
                            </div>
                            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                              최근 수정: {formatDate(model.updatedAt)}
                            </p>
                          </div>
                        </div>

                        {/* Tags */}
                        {model.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {model.tags.slice(0, 5).map((tag) => (
                              <Badge 
                                key={tag}
                                className="text-xs"
                                style={{
                                  backgroundColor: 'var(--color-brand-accent-tint)',
                                  color: 'var(--color-brand-primary)',
                                  borderRadius: 'var(--radius-4)',
                                  fontSize: '10px',
                                  padding: '2px 6px'
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                            {model.tags.length > 5 && (
                              <span 
                                className="text-xs"
                                style={{ color: 'var(--color-text-quaternary)' }}
                              >
                                +{model.tags.length - 5}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdating}
                              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                handleModelToggleVisibility(model);
                              }}
                            >
                              {model.isPublic ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                              {model.isPublic ? '비공개' : '공개'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isUpdating}
                              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                                event.stopPropagation();
                                openPriceDialog(model);
                              }}
                            >
                              <Coins className="w-4 h-4 mr-2" />
                              가격 변경
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              {model.updatedAt.toLocaleDateString()}
                            </span>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                                disabled={isUpdating}
                                onClick={(event: React.MouseEvent<HTMLButtonElement>) => event.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                                  if (isUpdating) {
                                    event.preventDefault();
                                    return;
                                  }
                                  event.stopPropagation();
                                  const numericId = Number(model.id);
                                  if (Number.isNaN(numericId)) {
                                    console.warn('모델 상세를 열 수 없습니다. 숫자 ID가 아닙니다:', model.id);
                                    return;
                                  }
                                  setSelectedModelIdForDetail(numericId);
                                  setDetailDialogOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                상세 보기
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}
                              >
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                최근 수익 내역
              </h3>

              {earningsTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  />
                  <p style={{ color: 'var(--color-text-secondary)' }}>
                    아직 수익 내역이 없습니다
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {earningsTransactions.map((transaction) => {
                    const relatedModel = userModels.find(m => m.id === transaction.relatedModelId);
                    return (
                      <div 
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg"
                        style={{ backgroundColor: 'var(--color-background-secondary)' }}
                      >
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-semantic-green)' + '20' }}
                          >
                            <Coins 
                              className="w-5 h-5"
                              style={{ color: 'var(--color-semantic-green)' }}
                            />
                          </div>
                          <div>
                            <p 
                              style={{
                                fontSize: 'var(--font-size-regular)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-text-primary)'
                              }}
                            >
                              {transaction.description}
                            </p>
                            <p 
                              className="text-sm"
                              style={{ color: 'var(--color-text-tertiary)' }}
                            >
                              {relatedModel?.name || '알 수 없는 모델'} • {formatDate(transaction.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p 
                            style={{
                              fontSize: 'var(--font-size-regular)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-semantic-green)'
                            }}
                          >
                            +{transaction.amount}P
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Monthly Summary */}
            <Card 
              className="p-6"
              style={{
                backgroundColor: 'var(--color-background-primary)',
                borderColor: 'var(--color-border-primary)',
                borderRadius: 'var(--radius-16)'
              }}
            >
              <h3 
                className="mb-6"
                style={{
                  fontSize: 'var(--font-size-title3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                이번 달 요약
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                  <p 
                    className="text-sm mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    모델 사용
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title2)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    146
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                  <p 
                    className="text-sm mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    수익
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title2)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-semantic-green)'
                    }}
                  >
                    1,245P
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                  <p 
                    className="text-sm mb-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    평균 평점
                  </p>
                  <p 
                    style={{
                      fontSize: 'var(--font-size-title2)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    4.6
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <ModelDetailDialog
        modelId={selectedModelIdForDetail}
        open={detailDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDetailDialogOpen(false);
            setSelectedModelIdForDetail(null);
          } else {
            setDetailDialogOpen(true);
          }
        }}
      />

      <Dialog
        open={priceDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closePriceDialog();
          }
        }}
      >
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <DialogTitle>가격 변경</DialogTitle>
            <DialogDescription>
              {priceEditingModel?.name ?? '모델'}의 판매 가격을 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">가격 (포인트)</p>
              <Input
                type="number"
                min={0}
                value={priceInput}
                onChange={(event) => setPriceInput(event.target.value)}
                placeholder="0"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              0을 입력하면 무료 모델로 전환됩니다.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closePriceDialog}
              disabled={priceSubmitting}
            >
              취소
            </Button>
            <Button
              onClick={handlePriceSubmit}
              disabled={priceSubmitting}
            >
              {priceSubmitting ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
