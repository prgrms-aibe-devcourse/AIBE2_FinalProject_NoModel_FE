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
import { DynamicFontSize } from './common/DynamicFontSize';
import { 
  ArrowLeft, Sparkles, Search, Plus, MoreHorizontal, Eye, Edit, 
  TrendingUp, Users, Coins, Calendar, Award, BarChart3,
  Globe, EyeOff, DollarSign, Activity, Clock, Star, Filter
} from 'lucide-react';
import { UserProfile, UserModel, PointTransaction } from '../App';

interface MyModelsProps {
  userProfile: UserProfile | null;
  userModels: UserModel[];
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
}

// Mock data for user models if none provided
const defaultUserModels: UserModel[] = [
  {
    id: 'user-model-1',
    name: '프로페셔널 한국 여성',
    description: '비즈니스 환경에 적합한 20대 후반 한국 여성 모델입니다.',
    prompt: 'professional korean woman, business attire, confident pose',
    seedValue: '11111',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=400&h=400&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    ],
    category: 'fashion',
    metadata: {
      age: '20대 후반',
      gender: '여성',
      style: '프로페셔널',
      ethnicity: '아시아'
    },
    creatorId: 'user-1',
    creatorName: '홍길동',
    creatorAvatar: undefined,
    price: 75,
    usageCount: 89,
    rating: 4.6,
    ratingCount: 23,
    tags: ['프로페셔널', '한국', '비즈니스', '여성'],
    isPublic: true,
    isForSale: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-10'),
    earnings: 1245
  },
  {
    id: 'user-model-2',
    name: '캐주얼 남성 모델',
    description: '친근하고 자연스러운 20대 남성 모델입니다.',
    prompt: 'casual young man, friendly smile, natural lighting',
    seedValue: '22222',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    ],
    category: 'lifestyle',
    metadata: {
      age: '20대 초반',
      gender: '남성',
      style: '캐주얼',
      ethnicity: '아시아'
    },
    creatorId: 'user-1',
    creatorName: '홍길동',
    creatorAvatar: undefined,
    price: 60,
    usageCount: 42,
    rating: 4.3,
    ratingCount: 12,
    tags: ['캐주얼', '친근함', '자연스러움'],
    isPublic: true,
    isForSale: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
    earnings: 630
  },
  {
    id: 'user-model-3',
    name: '럭셔리 뷰티 모델',
    description: '고급 화장품 브랜드에 특화된 모델입니다.',
    prompt: 'luxury beauty model, elegant makeup, soft studio lighting',
    seedValue: '33333',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    ],
    category: 'beauty',
    metadata: {
      age: '30대 초반',
      gender: '여성',
      style: '럭셔리',
      ethnicity: '서양'
    },
    creatorId: 'user-1',
    creatorName: '홍길동',
    creatorAvatar: undefined,
    price: 100,
    usageCount: 15,
    rating: 4.8,
    ratingCount: 5,
    tags: ['럭셔리', '뷰티', '엘레간트'],
    isPublic: false,
    isForSale: false,
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12'),
    earnings: 210
  }
];

const categoryNames: Record<string, string> = {
  fashion: '패션',
  electronics: '전자제품',
  beauty: '뷰티',
  home: '홈&리빙',
  food: '식품',
  lifestyle: '라이프스타일'
};

export function MyModels({ 
  userProfile, 
  userModels = defaultUserModels, 
  pointTransactions, 
  onBack, 
  onCreateModel, 
  onModelUpdate,
  onLogin,
  onLogout,
  onAdGeneration,
  onMarketplace,
  onMyPage,
  onAdmin
}: MyModelsProps) {
  const [activeTab, setActiveTab] = useState('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'earnings' | 'rating'>('newest');

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

  // Calculate stats
  const modelStats = useMemo(() => {
    const totalUsage = userModels.reduce((sum, model) => sum + model.usageCount, 0);
    const totalEarnings = userModels.reduce((sum, model) => sum + model.earnings, 0);
    const avgRating = userModels.length > 0 ? 
      userModels.reduce((sum, model) => sum + model.rating, 0) / userModels.length : 0;
    const publicModels = userModels.filter(model => model.isPublic).length;

    return {
      totalModels: userModels.length,
      totalUsage,
      totalEarnings,
      avgRating,
      publicModels
    };
  }, [userModels]);

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

  const handleModelEdit = (model: UserModel) => {
    // In real app, this would open edit modal
    console.log('Editing model:', model.id);
  };

  const handleModelToggleVisibility = (model: UserModel) => {
    const updatedModel = { ...model, isPublic: !model.isPublic };
    onModelUpdate(updatedModel);
  };

  const handleModelToggleSale = (model: UserModel) => {
    const updatedModel = { ...model, isForSale: !model.isForSale };
    onModelUpdate(updatedModel);
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
        isAdmin={userProfile?.isAdmin}
        onHome={onBack}
        isLoggedIn={!!userProfile}
        isLandingPage={false}
      />

      {/* Sub Header */}
      <div className="linear-header border-b" style={{ backgroundColor: 'var(--color-background-primary)' }}>
        <div className="linear-container h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2"
              style={{
                color: 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-8)'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로 가기
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <Coins className="w-4 h-4" style={{ color: 'var(--color-semantic-orange)' }} />
                <DynamicFontSize
                  text={`${userProfile.points.toLocaleString()}P`}
                  baseSize="var(--font-size-small)"
                  maxWidth="80px"
                  minSize="10px"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                />
              </div>
            )}
            <Button 
              onClick={onCreateModel}
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-utility-white)',
                borderRadius: 'var(--radius-8)',
                border: 'none'
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              새 모델 생성
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    {modelStats.totalModels}
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
                    {modelStats.totalUsage}
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
                    {modelStats.totalEarnings.toLocaleString()}P
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
                    {modelStats.avgRating > 0 ? modelStats.avgRating.toFixed(1) : '-'}
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
                    {modelStats.publicModels}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

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

                {/* Create Model Button */}
                <Button 
                  onClick={onCreateModel}
                  className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                  style={{ borderRadius: 'var(--radius-8)' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  새 모델 만들기
                </Button>
              </div>
            </div>

            {/* Models List */}
            {filteredModels.length === 0 ? (
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
                  첫 번째 AI 모델을 생성해보세요
                </p>
                <Button 
                  onClick={onCreateModel}
                  style={{
                    backgroundColor: 'var(--color-brand-primary)',
                    color: 'var(--color-utility-white)',
                    borderRadius: 'var(--radius-8)'
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  모델 생성하기
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredModels.map((model) => (
                  <Card 
                    key={model.id}
                    className="p-6"
                    style={{
                      backgroundColor: 'var(--color-background-primary)',
                      borderColor: 'var(--color-border-primary)',
                      borderRadius: 'var(--radius-16)'
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
                                {!model.isPublic && (
                                  <Badge 
                                    className="text-xs"
                                    style={{
                                      backgroundColor: 'var(--color-background-tertiary)',
                                      color: 'var(--color-text-secondary)',
                                      borderRadius: 'var(--radius-4)'
                                    }}
                                  >
                                    <EyeOff className="w-3 h-3 mr-1" />
                                    비공개
                                  </Badge>
                                )}
                                {!model.isForSale && (
                                  <Badge 
                                    className="text-xs"
                                    style={{
                                      backgroundColor: 'var(--color-semantic-red)' + '20',
                                      color: 'var(--color-semantic-red)',
                                      borderRadius: 'var(--radius-4)'
                                    }}
                                  >
                                    판매 중지
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p 
                              className="text-sm mb-2 line-clamp-2"
                              style={{ color: 'var(--color-text-secondary)' }}
                            >
                              {model.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                              <span>{categoryNames[model.category]}</span>
                              <span>•</span>
                              <span>{formatDate(model.createdAt)}</span>
                              <span>•</span>
                              <span>{model.usageCount}회 사용됨</span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0 ml-4">
                            <div className="flex items-center gap-2 mb-1">
                              <StarRating rating={model.rating} readonly size="sm" />
                              <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                ({model.ratingCount})
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              <Coins className="w-4 h-4" style={{ color: 'var(--color-semantic-orange)' }} />
                              <span 
                                style={{
                                  fontSize: 'var(--font-size-regular)',
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: 'var(--color-text-primary)'
                                }}
                              >
                                {model.price}P
                              </span>
                            </div>
                            <p 
                              className="text-xs"
                              style={{ color: 'var(--color-semantic-green)' }}
                            >
                              {model.earnings.toLocaleString()}P 수익
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
                              onClick={() => handleModelEdit(model)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              편집
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleModelToggleVisibility(model)}
                            >
                              {model.isPublic ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                              {model.isPublic ? '비공개' : '공개'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleModelToggleSale(model)}
                            >
                              <DollarSign className="w-4 h-4 mr-2" />
                              {model.isForSale ? '판매 중지' : '판매 시작'}
                            </Button>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleModelEdit(model)}>
                                <Eye className="w-4 h-4 mr-2" />
                                상세 보기
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleModelEdit(model)}>
                                <Edit className="w-4 h-4 mr-2" />
                                편집
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
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
    </div>
  );
}