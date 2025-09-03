import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, ShoppingBag, Shirt, Utensils, Home, Gamepad2, Heart, ChevronRight } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (category: string) => void;
  onBack: () => void;
}

const productCategories = [
  {
    id: 'fashion',
    name: '패션',
    icon: Shirt,
    description: '의류, 신발, 액세서리',
    color: '#eb5757'
  },
  {
    id: 'electronics',
    name: '전자제품',
    icon: Gamepad2,
    description: '스마트폰, 노트북, 가전제품',
    color: '#4ea7fc'
  },
  {
    id: 'beauty',
    name: '뷰티',
    icon: Heart,
    description: '화장품, 스킨케어, 향수',
    color: '#5e6ad2'
  },
  {
    id: 'home',
    name: '홈&리빙',
    icon: Home,
    description: '가구, 데코, 생활용품',
    color: '#4cb782'
  },
  {
    id: 'food',
    name: '식품',
    icon: Utensils,
    description: '식료품, 음료, 건강식품',
    color: '#fc7840'
  },
  {
    id: 'lifestyle',
    name: '라이프스타일',
    icon: ShoppingBag,
    description: '스포츠, 취미, 기타 제품',
    color: '#f2c94c'
  }
];

export function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep(2);
  };

  const handleComplete = () => {
    onComplete(selectedCategory);
  };

  const selectedCategoryData = productCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)' }}>
      {/* Header */}
      <header 
        className="linear-header sticky top-0 z-50"
        style={{
          borderBottom: `1px solid var(--color-border-primary)`
        }}
      >
        <div className="linear-container h-full flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="p-2"
            style={{
              color: 'var(--color-text-secondary)',
              borderRadius: 'var(--radius-8)'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 max-w-md mx-8">
            <Progress 
              value={(currentStep / 2) * 100} 
              className="h-2"
              style={{
                backgroundColor: 'var(--color-background-tertiary)',
                borderRadius: 'var(--radius-rounded)'
              }}
            />
          </div>
          <div 
            className="text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            {currentStep}/2
          </div>
        </div>
      </header>

      <main 
        className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {currentStep === 1 && (
          <div className="text-center mb-12">
            <h1 
              className="mb-4"
              style={{
                fontSize: '2rem',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: '1.125',
                letterSpacing: '-0.022em',
                color: 'var(--color-text-primary)'
              }}
            >
              어떤 제품을 촬영하고 싶으신가요?
            </h1>
            <p 
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-regular)'
              }}
            >
              제품 카테고리를 선택하면 맞춤형 스타일과 배경을 추천해드려요
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center mb-12">
            <h1 
              className="mb-4"
              style={{
                fontSize: '2rem',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: '1.125',
                letterSpacing: '-0.022em',
                color: 'var(--color-text-primary)'
              }}
            >
              준비 완료!
            </h1>
            <p 
              className="mb-6"
              style={{ 
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-regular)'
              }}
            >
              {selectedCategoryData?.name} 제품을 위한 맞춤 설정이 준비되었어요
            </p>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div 
                className="w-12 h-12 flex items-center justify-center"
                style={{
                  borderRadius: 'var(--radius-circle)',
                  backgroundColor: selectedCategoryData?.color + '20',
                  color: selectedCategoryData?.color
                }}
              >
                {selectedCategoryData && <selectedCategoryData.icon className="w-6 h-6" />}
              </div>
              <div className="text-left">
                <h3 
                  style={{
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)'
                  }}
                >
                  {selectedCategoryData?.name}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {selectedCategoryData?.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="p-6 cursor-pointer group transition-all"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)',
                    boxShadow: 'var(--shadow-tiny)',
                    transition: 'all var(--animation-quick-transition) ease'
                  }}
                  onClick={() => handleCategorySelect(category.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-medium)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-tiny)';
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 flex items-center justify-center"
                      style={{
                        borderRadius: 'var(--radius-circle)',
                        backgroundColor: category.color + '20',
                        color: category.color
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <ChevronRight 
                      className="w-5 h-5 transition-colors group-hover:text-foreground"
                      style={{ color: 'var(--color-text-tertiary)' }}
                    />
                  </div>
                  <h3 
                    className="mb-2"
                    style={{
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {category.name}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {category.description}
                  </p>
                </Card>
              );
            })}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "AI 모델 준비", desc: `${selectedCategoryData?.name}에 최적화된 모델` },
                { title: "배경 세팅", desc: "브랜드에 맞는 배경 템플릿" },
                { title: "스타일 가이드", desc: "카테고리별 스타일 옵션" }
              ].map((item, index) => (
                <Card 
                  key={index}
                  className="p-4 text-center"
                  style={{
                    backgroundColor: 'var(--color-background-secondary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-12)'
                  }}
                >
                  <div 
                    className="w-8 h-8 flex items-center justify-center mx-auto mb-2"
                    style={{
                      borderRadius: 'var(--radius-circle)',
                      backgroundColor: 'var(--color-semantic-green)',
                      color: 'var(--color-utility-white)'
                    }}
                  >
                    ✓
                  </div>
                  <h4 
                    className="mb-1"
                    style={{
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-small)'
                    }}
                  >
                    {item.title}
                  </h4>
                  <p 
                    className="text-xs"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {item.desc}
                  </p>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Badge 
                variant="secondary" 
                className="mb-4"
                style={{
                  backgroundColor: 'var(--color-brand-accent-tint)',
                  color: 'var(--color-brand-primary)',
                  borderRadius: 'var(--radius-rounded)',
                  fontSize: 'var(--font-size-small)',
                  fontWeight: 'var(--font-weight-medium)',
                  padding: '8px 16px'
                }}
              >
                🎉 첫 번째 이미지 생성 무료!
              </Badge>
              <br />
              <Button 
                size="lg" 
                onClick={handleComplete} 
                className="min-w-48"
                style={{
                  backgroundColor: 'var(--color-brand-primary)',
                  color: 'var(--color-utility-white)',
                  borderRadius: 'var(--radius-rounded)',
                  fontSize: '16px',
                  fontWeight: 'var(--font-weight-medium)',
                  height: '48px',
                  padding: '0 24px',
                  border: 'none',
                  boxShadow: 'var(--shadow-low)',
                  transition: 'all var(--animation-quick-transition) ease'
                }}
              >
                이미지 생성 시작하기
              </Button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="text-center mt-12">
            <p 
              className="text-sm"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              원하는 카테고리가 없나요? 
              <Button 
                variant="link" 
                className="p-0 ml-1"
                style={{
                  color: 'var(--color-link-primary)',
                  textDecoration: 'none',
                  fontSize: 'var(--font-size-small)'
                }}
              >
                기타 카테고리 선택하기
              </Button>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}