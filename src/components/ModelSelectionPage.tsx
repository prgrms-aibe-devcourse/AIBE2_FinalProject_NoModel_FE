import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DefaultAvatar } from './common/DefaultAvatar';
import { NavigationBar } from './NavigationBar';
import { 
  ArrowLeft, Sparkles, Search, Users, ShoppingCart, Plus, 
  Crown, Wand2, Star, Eye, Coins, Filter
} from 'lucide-react';
import { SelectedModel, UserProfile } from '../App';

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
}

// Mock data for pre-made models
const mockPreMadeModels = [
  {
    id: 'premade-1',
    name: '지민 - 젊은 아시아 여성',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1ff?w=300&h=300&fit=crop&crop=face',
    category: 'fashion',
    description: '20대 초반의 젊고 활기찬 아시아 여성 모델입니다.',
    metadata: {
      age: '20대 초반',
      gender: '여성',
      style: '프로페셔널',
      ethnicity: '아시아'
    },
    prompt: 'young asian woman, professional headshot, natural lighting, clean background',
    seedValue: '12345',
    isCustom: false,
    rating: 4.8,
    usageCount: 1247
  },
  {
    id: 'premade-2',
    name: '알렉스 - 비즈니스맨',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    category: 'electronics',
    description: '신뢰감을 주는 30대 서양 남성 비즈니스 모델입니다.',
    metadata: {
      age: '30대 초반',
      gender: '남성',
      style: '프로페셔널',
      ethnicity: '서양'
    },
    prompt: 'professional businessman, confident pose, business suit, studio lighting',
    seedValue: '23456',
    isCustom: false,
    rating: 4.6,
    usageCount: 892
  },
  {
    id: 'premade-3',
    name: '소피아 - 럭셔리 모델',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    category: 'beauty',
    description: '고급스럽고 우아한 30대 서양 여성 모델입니다.',
    metadata: {
      age: '30대 중반',
      gender: '여성',
      style: '럭셔리',
      ethnicity: '서양'
    },
    prompt: 'elegant woman, luxury portrait, soft lighting, sophisticated background',
    seedValue: '34567',
    isCustom: false,
    rating: 4.9,
    usageCount: 634
  },
  {
    id: 'premade-4',
    name: '케이 - 캐주얼 모델',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face',
    category: 'lifestyle',
    description: '자연스럽고 친근한 20대 후반 서양 여성 모델입니다.',
    metadata: {
      age: '20대 후반',
      gender: '여성',
      style: '캐주얼',
      ethnicity: '서양'
    },
    prompt: 'casual young woman, natural smile, lifestyle photography, bright lighting',
    seedValue: '45678',
    isCustom: false,
    rating: 4.7,
    usageCount: 1089
  }
];

// Mock marketplace models preview
const mockMarketplacePreview = [
  {
    id: 'marketplace-preview-1',
    name: '엘레간트 아시아 여성',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
    price: 80,
    rating: 4.8,
    creator: ' 김미영',
    usageCount: 247
  },
  {
    id: 'marketplace-preview-2',
    name: '프로페셔널 남성',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
    price: 120,
    rating: 4.6,
    creator: 'Alex Johnson',
    usageCount: 189
  },
  {
    id: 'marketplace-preview-3',
    name: '럭셔리 패션 모델',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop&crop=face',
    price: 150,
    rating: 4.7,
    creator: '박지수',
    usageCount: 156
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
  onAdmin
}: ModelSelectionPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('premade');

  // Filter models based on category and search
  const filteredPreMadeModels = mockPreMadeModels.filter(model => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch = !searchQuery || model.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleModelSelect = (model: any, isPaid = false) => {
    const selectedModel: SelectedModel = {
      id: model.id,
      name: model.name,
      prompt: model.prompt || '',
      seedValue: model.seedValue || '',
      imageUrl: model.imageUrl,
      category: model.category || selectedCategory,
      isCustom: false,
      metadata: model.metadata || {
        age: '알 수 없음',
        gender: '알 수 없음',
        style: '알 수 없음',
        ethnicity: '알 수 없음'
      },
      creator: isPaid ? {
        id: 'creator-' + model.id,
        name: model.creator,
        avatar: model.creatorAvatar
      } : undefined,
      price: isPaid ? model.price : undefined
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
                <span style={{ color: 'var(--color-text-primary)', fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)' }}>
                  {userProfile.points.toLocaleString()}P
                </span>
              </div>
            )}
            <Badge 
              style={{
                backgroundColor: 'var(--color-brand-accent-tint)',
                color: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-rounded)',
                fontSize: 'var(--font-size-small)',
                fontWeight: 'var(--font-weight-medium)',
                padding: '8px 16px'
              }}
            >
              {categoryNames[selectedCategory] || '모든 카테고리'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
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

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--color-text-tertiary)' }}
            />
            <Input
              placeholder="모델 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{
                borderRadius: 'var(--radius-8)',
                borderColor: 'var(--color-border-primary)',
                backgroundColor: 'var(--color-input-background)',
                fontSize: 'var(--font-size-regular)',
                height: '48px'
              }}
            />
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
              value="premade"
              className="flex items-center gap-2"
              style={{
                borderRadius: 'var(--radius-8)',
                fontSize: 'var(--font-size-small)',
                padding: '12px 16px'
              }}
            >
              <Users className="w-4 h-4" />
              무료 모델
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

          {/* Pre-made Models Tab */}
          <TabsContent value="premade" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 
                style={{
                  fontSize: 'var(--font-size-title2)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)'
                }}
              >
                무료 모델 ({filteredPreMadeModels.length})
              </h2>
            </div>

            {filteredPreMadeModels.length === 0 ? (
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
                  검색 결과가 없습니다
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  다른 검색어를 시도하거나 마켓플레이스를 확인해보세요
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPreMadeModels.map((model) => (
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
                    onClick={() => handleModelSelect(model)}
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
                      <img 
                        src={model.imageUrl} 
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Free Badge */}
                      <div 
                        className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: 'var(--color-semantic-green)',
                          color: 'var(--color-utility-white)',
                          fontWeight: 'var(--font-weight-medium)'
                        }}
                      >
                        FREE
                      </div>

                      {/* Stats */}
                      <div 
                        className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'var(--color-utility-white)'
                        }}
                      >
                        <Star className="w-3 h-3" />
                        {model.rating}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          style={{
                            backgroundColor: 'var(--color-utility-white)',
                            color: 'var(--color-text-primary)',
                            borderRadius: 'var(--radius-8)'
                          }}
                        >
                          선택하기
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
                        {model.name}
                      </h3>
                      <p 
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {model.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                        <span>{model.usageCount.toLocaleString()}회 사용됨</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3" style={{ color: 'var(--color-semantic-orange)' }} />
                          {model.rating}
                        </div>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMarketplacePreview.map((model) => (
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
                  onClick={() => handleModelSelect(model, true)}
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
                    <img 
                      src={model.imageUrl} 
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Price Badge */}
                    <div 
                      className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: 'var(--color-semantic-orange)',
                        color: 'var(--color-utility-white)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      <Coins className="w-3 h-3" />
                      {model.price}P
                    </div>

                    {/* Rating */}
                    <div 
                      className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'var(--color-utility-white)'
                      }}
                    >
                      <Star className="w-3 h-3" />
                      {model.rating}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        style={{
                          backgroundColor: 'var(--color-utility-white)',
                          color: 'var(--color-text-primary)',
                          borderRadius: 'var(--radius-8)'
                        }}
                      >
                        {userProfile && userProfile.points >= model.price ? '구매하기' : '포인트 부족'}
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
                      {model.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <DefaultAvatar 
                        name={model.creator}
                        className="h-5 w-5"
                        fallbackClassName="text-xs"
                      />
                      <span 
                        className="text-sm"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {model.creator}
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