import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { StarRating } from './StarRating';
import { NavigationBar } from './NavigationBar';
import { 
  ArrowLeft, Sparkles, Search, Filter, Grid3X3, List, 
  Coins, Users, Star, Eye, Plus, Heart, ShoppingCart,
  TrendingUp, Clock, Award, Tag, Flag, MoreHorizontal
} from 'lucide-react';
import { UserProfile, SelectedModel, UserModel } from '../App';

interface ModelMarketplaceProps {
  userProfile: UserProfile | null;
  onBack: () => void;
  onModelPurchase: (model: SelectedModel) => void;
  onCreateModel: () => void;
  onModelReport: (model: UserModel) => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onMyPage: () => void;
}

// Mock marketplace models
const mockMarketplaceModels = [
  {
    id: 'marketplace-1',
    name: '엘레간트 아시아 여성',
    description: '고급스럽고 우아한 분위기의 젊은 아시아 여성 모델입니다. 뷰티, 패션, 럭셔리 브랜드에 적합합니다.',
    prompt: 'elegant young asian woman, professional portrait, luxury style, soft lighting',
    seedValue: '54321',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=400&h=400&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    ],
    category: 'beauty',
    metadata: {
      age: '20대 후반',
      gender: '여성',
      style: '럭셔리',
      ethnicity: '아시아'
    },
    creatorId: 'creator-1',
    creatorName: '김미영',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    price: 80,
    usageCount: 247,
    rating: 4.8,
    ratingCount: 52,
    tags: ['우아함', '럭셔리', '뷰티', '아시아', '젊은'],
    isPublic: true,
    isForSale: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-10'),
    earnings: 1380
  },
  {
    id: 'marketplace-2',
    name: '프로페셔널 비즈니스맨',
    description: '신뢰감을 주는 30대 비즈니스맨 모델입니다. B2B 서비스, 금융, 컨설팅 업계에 최적화되어 있습니다.',
    prompt: 'professional businessman, confident pose, business suit, corporate background',
    seedValue: '67890',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
    ],
    category: 'electronics',
    metadata: {
      age: '30대 초반',
      gender: '남성',
      style: '프로페셔널',
      ethnicity: '서양'
    },
    creatorId: 'creator-2',
    creatorName: 'Alex Johnson',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    price: 120,
    usageCount: 189,
    rating: 4.6,
    ratingCount: 31,
    tags: ['비즈니스', '신뢰감', '프로페셔널', '30대', '서양'],
    isPublic: true,
    isForSale: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-05'),
    earnings: 980
  },
  {
    id: 'marketplace-3',
    name: '캐주얼 라이프스타일 모델',
    description: '자연스럽고 친근한 느낌의 20대 모델입니다. 일상 제품, 캐주얼 브랜드, SNS 콘텐츠에 적합합니다.',
    prompt: 'casual young person, natural smile, lifestyle photography, bright lighting',
    seedValue: '13579',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop'
    ],
    category: 'lifestyle',
    metadata: {
      age: '20대 초반',
      gender: '여성',
      style: '캐주얼',
      ethnicity: '서양'
    },
    creatorId: 'creator-3',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    price: 60,
    usageCount: 324,
    rating: 4.9,
    ratingCount: 89,
    tags: ['캐주얼', '자연스러움', '친근함', '라이프스타일', '20대'],
    isPublic: true,
    isForSale: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-12'),
    earnings: 1240
  },
  {
    id: 'marketplace-4',
    name: '럭셔리 패션 모델',
    description: '하이엔드 패션과 럭셔리 브랜드에 특화된 모델입니다. 세련되고 고급스러운 이미지 연출이 가능합니다.',
    prompt: 'luxury fashion model, high-end style, sophisticated pose, editorial lighting',
    seedValue: '24680',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    previewImages: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'
    ],
    category: 'fashion',
    metadata: {
      age: '30대 중반',
      gender: '여성',
      style: '럭셔리',
      ethnicity: '서양'
    },
    creatorId: 'creator-4',
    creatorName: '박지수',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    price: 150,
    usageCount: 156,
    rating: 4.7,
    ratingCount: 23,
    tags: ['럭셔리', '하이엔드', '패션', '세련됨', '30대'],
    isPublic: true,
    isForSale: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-08'),
    earnings: 720
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

export function ModelMarketplace({ 
  userProfile, 
  onBack, 
  onModelPurchase, 
  onCreateModel, 
  onModelReport,
  onLogin,
  onLogout,
  onAdGeneration,
  onMyPage
}: ModelMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating' | 'price_low' | 'price_high'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<string>('all');

  // Filter and sort models
  const filteredModels = useMemo(() => {
    let filtered = mockMarketplaceModels.filter(model => {
      if (selectedCategory !== 'all' && model.category !== selectedCategory) return false;
      if (searchQuery && !model.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
      
      // Price filter
      if (priceRange === 'low' && model.price > 50) return false;
      if (priceRange === 'mid' && (model.price <= 50 || model.price > 100)) return false;
      if (priceRange === 'high' && model.price <= 100) return false;
      
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'popular':
          return b.usageCount - a.usageCount;
        case 'rating':
          return b.rating - a.rating;
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, sortBy, priceRange]);

  const handleModelSelect = (model: any) => {
    const selectedModel: SelectedModel = {
      id: model.id,
      name: model.name,
      prompt: model.prompt,
      seedValue: model.seedValue,
      imageUrl: model.imageUrl,
      category: model.category,
      isCustom: false,
      metadata: model.metadata,
      creator: {
        id: model.creatorId,
        name: model.creatorName,
        avatar: model.creatorAvatar
      },
      price: model.price
    };
    
    onModelPurchase(selectedModel);
  };

  const handleModelReport = (model: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('신고 버튼 클릭됨:', model.name);
    console.log('onModelReport 함수 존재 여부:', typeof onModelReport);
    
    const userModel: UserModel = {
      id: model.id,
      name: model.name,
      description: model.description,
      prompt: model.prompt,
      seedValue: model.seedValue,
      imageUrl: model.imageUrl,
      previewImages: model.previewImages,
      category: model.category,
      metadata: model.metadata,
      creatorId: model.creatorId,
      creatorName: model.creatorName,
      creatorAvatar: model.creatorAvatar,
      price: model.price,
      usageCount: model.usageCount,
      rating: model.rating,
      ratingCount: model.ratingCount,
      tags: model.tags,
      isPublic: model.isPublic,
      isForSale: model.isForSale,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      earnings: model.earnings
    };
    
    console.log('UserModel 변환 완료:', userModel.name);
    console.log('onModelReport 호출 시작...');
    
    try {
      onModelReport(userModel);
      console.log('onModelReport 호출 성공');
    } catch (error) {
      console.error('onModelReport 호출 실패:', error);
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
        onMarketplace={() => {}}
        onMyPage={onMyPage}
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
            >
              <ArrowLeft className="w-4 h-4" />
              뒤로 가기
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {userProfile && (
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--color-background-secondary)' }}>
                <Coins className="w-4 h-4" style={{ color: 'var(--color-semantic-orange)' }} />
                <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)' }}>
                  {userProfile.points.toLocaleString()}P
                </span>
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
              모델 생성
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart 
              className="w-8 h-8"
              style={{ color: 'var(--color-brand-primary)' }}
            />
            <div>
              <h1 style={{
                fontSize: 'var(--font-size-title1)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}>
                모델 마켓플레이스
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                다른 크리에이터가 만든 AI 모델을 탐색하고 구매하세요
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8">
          {/* Search Bar with Integrated Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--color-text-tertiary)' }}
                />
                <Input
                  placeholder="모델 검색... (이름, 태그로 검색)"
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
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-28 h-9">
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">인기순</SelectItem>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="rating">평점순</SelectItem>
                    <SelectItem value="price_low">낮은 가격순</SelectItem>
                    <SelectItem value="price_high">높은 가격순</SelectItem>
                  </SelectContent>
                </Select>
                
                <span className="text-sm text-muted-foreground">
                  {filteredModels.length}개 모델
                </span>
              </div>
            </div>

            {/* View Mode */}
            <div className="flex gap-1 bg-muted/30 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3 h-9"
                style={{ borderRadius: 'var(--radius-6)' }}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3 h-9"
                style={{ borderRadius: 'var(--radius-6)' }}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        {filteredModels.length === 0 ? (
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
              검색 결과가 없습니다
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              다른 검색어나 필터를 시도해보세요
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModels.map((model) => (
              <Card 
                key={model.id}
                className="group cursor-pointer transition-all hover:shadow-lg p-4"
                style={{
                  backgroundColor: 'var(--color-background-primary)',
                  borderColor: 'var(--color-border-primary)',
                  borderRadius: 'var(--radius-16)',
                  boxShadow: 'var(--shadow-tiny)',
                  transition: 'all var(--animation-quick-transition) ease'
                }}
                onClick={() => handleModelSelect(model)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
                }}
              >
                {/* Model Image */}
                <div 
                  className="relative overflow-hidden w-full aspect-square mb-4"
                  style={{ borderRadius: 'var(--radius-12)' }}
                >
                  <img 
                    src={model.imageUrl} 
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Price Badge */}
                  <div 
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: 'var(--color-utility-white)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}
                  >
                    <Coins className="w-3 h-3" />
                    {model.price}P
                  </div>

                  {/* Report Button */}
                  <div className="absolute top-2 left-2 z-10">
                    {/* Direct Report Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-90 hover:opacity-100 transition-all rounded-full hover:scale-110"
                      style={{
                        backgroundColor: 'rgba(220, 38, 38, 0.9)',
                        color: 'var(--color-utility-white)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                      onClick={(e) => {
                        console.log('=== 신고 버튼 클릭 이벤트 시작 ===');
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('직접 신고 버튼 클릭됨 - 모델:', model.name);
                        handleModelReport(model, e);
                      }}
                      title="신고하기"
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick View */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Model Info */}
                <div>
                  <h3 
                    className="mb-2 line-clamp-1"
                    style={{
                      fontSize: 'var(--font-size-regular)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {model.name}
                  </h3>

                  {/* Creator Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={model.creatorAvatar} alt={model.creatorName} />
                      <AvatarFallback style={{ fontSize: 'var(--font-size-micro)' }}>
                        {model.creatorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span 
                      className="text-xs"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    >
                      {model.creatorName}
                    </span>
                  </div>

                  <div className="flex gap-2 mb-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs"
                      style={{
                        backgroundColor: 'var(--color-background-tertiary)',
                        color: 'var(--color-text-secondary)',
                        borderRadius: 'var(--radius-4)',
                        fontSize: 'var(--font-size-micro)',
                        padding: '2px 6px'
                      }}
                    >
                      {categoryNames[model.category]}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StarRating rating={model.rating} readonly size="sm" />
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        ({model.ratingCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                      <Users className="w-3 h-3" />
                      {model.usageCount}회 사용
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}