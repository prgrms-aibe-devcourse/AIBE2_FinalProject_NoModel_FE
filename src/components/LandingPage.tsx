import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Zap, Target, TrendingUp, Camera, Users } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function LandingPage({ onGetStarted, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-family-regular)' }}>
      {/* Header */}
      <header className="linear-header sticky top-0 z-50">
        <div className="linear-container h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                borderRadius: 'var(--radius-8)'
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: 'var(--color-utility-white)' }} />
            </div>
            <h1 
              className="text-xl"
              style={{ 
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}
            >
              NoModel
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="transition-colors"
              style={{ 
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--font-size-regular)',
                fontWeight: 'var(--font-weight-normal)'
              }}
            >
              기능
            </a>
            <a 
              href="#pricing" 
              className="transition-colors"
              style={{ 
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--font-size-regular)',
                fontWeight: 'var(--font-weight-normal)'
              }}
            >
              가격
            </a>
            <a 
              href="#about" 
              className="transition-colors"
              style={{ 
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--font-size-regular)',
                fontWeight: 'var(--font-weight-normal)'
              }}
            >
              소개
            </a>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLogin}
              style={{
                borderRadius: 'var(--radius-rounded)',
                borderColor: 'var(--color-border-primary)',
                fontSize: 'var(--font-size-regular)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              로그인
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-20"
        style={{ 
          paddingInline: 'var(--spacing-page-padding-inline)',
          paddingBlock: 'var(--spacing-page-padding-block)'
        }}
      >
        <div className="linear-container text-center">
          <Badge 
            variant="secondary" 
            className="mb-6 inline-flex items-center gap-2"
            style={{
              backgroundColor: 'var(--color-brand-accent-tint)',
              color: 'var(--color-brand-primary)',
              borderRadius: 'var(--radius-rounded)',
              fontSize: 'var(--font-size-small)',
              fontWeight: 'var(--font-weight-medium)',
              padding: '8px 16px'
            }}
          >
            <Zap className="w-4 h-4" />
            AI 기반 이미지 생성
          </Badge>
          
          <h1 
            className="mb-6 tracking-tight"
            style={{
              fontSize: '4rem',
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: '1.06',
              letterSpacing: '-0.022em',
              color: 'var(--color-text-primary)'
            }}
          >
            모델 없이도 <br />
            <span style={{ color: 'var(--color-brand-primary)' }}>완벽한 제품 광고</span>
          </h1>
          
          <p 
            className="mb-12 max-w-2xl mx-auto"
            style={{
              fontSize: 'var(--font-size-large)',
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: '1.6',
              color: 'var(--color-text-secondary)'
            }}
          >
            모델 고용 비용과 촬영 복잡성을 제거하여, 
            누구나 쉽고 빠르게 전문적인 제품 광고 이미지를 생성하세요
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={onGetStarted} 
              className="linear-button linear-button-primary min-w-48"
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
              무료로 시작하기
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              style={{
                borderRadius: 'var(--radius-rounded)',
                borderColor: 'var(--color-border-primary)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-primary)',
                fontSize: '16px',
                fontWeight: 'var(--font-weight-medium)',
                height: '48px',
                padding: '0 24px',
                transition: 'all var(--animation-quick-transition) ease'
              }}
            >
              <Camera className="w-4 h-4 mr-2" />
              데모 보기
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div 
                className="text-3xl mb-1"
                style={{
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-brand-primary)'
                }}
              >
                90%
              </div>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                비용 절감
              </p>
            </div>
            <div className="text-center">
              <div 
                className="text-3xl mb-1"
                style={{
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-brand-primary)'
                }}
              >
                10분
              </div>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                생성 시간
              </p>
            </div>
            <div className="text-center">
              <div 
                className="text-3xl mb-1"
                style={{
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-brand-primary)'
                }}
              >
                1000+
              </div>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                활용 기업
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        id="features" 
        className="py-20"
        style={{ 
          backgroundColor: 'var(--color-background-secondary)',
          paddingInline: 'var(--spacing-page-padding-inline)'
        }}
      >
        <div className="linear-container">
          <div className="text-center mb-16">
            <h2 
              className="mb-4"
              style={{
                fontSize: '2rem',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: '1.125',
                letterSpacing: '-0.022em',
                color: 'var(--color-text-primary)'
              }}
            >
              핵심 기능
            </h2>
            <p 
              className="max-w-2xl mx-auto"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-regular)'
              }}
            >
              전문적인 제품 이미지 생성을 위한 모든 도구가 하나로
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "AI 배경 제거",
                description: "제품 이미지에서 자동으로 배경을 분리하고 품질을 최적화합니다"
              },
              {
                icon: Users,
                title: "가상 모델 생성",
                description: "다양한 연령, 성별, 인종의 AI 모델을 활용한 자연스러운 포즈"
              },
              {
                icon: Sparkles,
                title: "배경 & 스타일",
                description: "스튜디오, 자연, 라이프스타일 배경과 다양한 스타일 옵션"
              },
              {
                icon: Zap,
                title: "빠른 생성",
                description: "기존 며칠의 작업을 몇 분 만에 완료하는 초고속 처리"
              },
              {
                icon: TrendingUp,
                title: "확장성",
                description: "다양한 제품군과 브랜드 스타일에 맞는 무제한 생성"
              },
              {
                icon: Camera,
                title: "고품질 출력",
                description: "상업적 사용 가능한 고해상도 이미지로 바로 활용 가능"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow"
                  style={{
                    backgroundColor: 'var(--color-background-primary)',
                    borderColor: 'var(--color-border-primary)',
                    borderRadius: 'var(--radius-16)',
                    boxShadow: 'var(--shadow-tiny)',
                    transition: 'box-shadow var(--animation-regular-transition) ease'
                  }}
                >
                  <div 
                    className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{
                      borderRadius: 'var(--radius-12)',
                      backgroundColor: 'var(--color-brand-accent-tint)'
                    }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: 'var(--color-brand-primary)' }}
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
                    {feature.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 text-center"
        style={{ paddingInline: 'var(--spacing-page-padding-inline)' }}
      >
        <div className="linear-container max-w-2xl">
          <h2 
            className="mb-4"
            style={{
              fontSize: '2rem',
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: '1.125',
              letterSpacing: '-0.022em',
              color: 'var(--color-text-primary)'
            }}
          >
            지금 바로 시작하세요
          </h2>
          <p 
            className="mb-8"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-regular)'
            }}
          >
            첫 번째 이미지는 무료로 생성해보고, 
            완벽한 제품 광고의 새로운 경험을 시작하세요
          </p>
          <Button 
            size="lg" 
            onClick={onGetStarted} 
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
            무료 체험하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 text-center"
        style={{
          borderTop: `1px solid var(--color-border-primary)`,
          paddingInline: 'var(--spacing-page-padding-inline)'
        }}
      >
        <div className="linear-container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div 
              className="w-6 h-6 flex items-center justify-center"
              style={{
                borderRadius: 'var(--radius-6)',
                backgroundColor: 'var(--color-brand-primary)'
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'var(--color-utility-white)' }} />
            </div>
            <span 
              style={{
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)'
              }}
            >
              NoModel
            </span>
          </div>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            © 2024 NoModel. 모든 권리 보유.
          </p>
        </div>
      </footer>
    </div>
  );
}