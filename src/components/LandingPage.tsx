import * as React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Zap, Target, TrendingUp, Camera, Users, CheckCircle, Star, Menu, X, UserCheck, LogOut, ShoppingBag, User, Palette } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onAdGeneration: () => void;
  onModelCreation: () => void;
  onMarketplace: () => void;
  onMyPage: () => void;
  isLoggedIn: boolean;
}

export function LandingPage({ 
  onGetStarted, 
  onLogin, 
  onLogout, 
  onAdGeneration, 
  onModelCreation, 
  onMarketplace, 
  onMyPage, 
  isLoggedIn 
}: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background" style={{ scrollBehavior: 'smooth' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b bg-background">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary shadow-sm">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              NoModel
            </h1>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {!isLoggedIn ? (
              // 로그인 전 네비게이션
              <>
{[
                  { label: '홈', href: '#home' },
                  { label: '기능', href: '#features' },
                  { label: '가격책정', href: '#pricing' },
                  { label: '고객사례', href: '#testimonials' },
                  { label: '가격', href: '#pricing' }
                ].map((item, index) => (
                  <a 
                    key={index}
                    href={item.href} 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={onLogin}
                  className="rounded-full px-6"
                >
                  로그인
                </Button>
              </>
            ) : (
              // 로그인 후 네비게이션
              <>
                <button 
                  onClick={onAdGeneration}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  광고 생성
                </button>
                <button 
                  onClick={onModelCreation}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  모델 제작
                </button>
                <button 
                  onClick={onMarketplace}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  마켓플레이스
                </button>
                <button 
                  onClick={onMyPage}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  마이 페이지
                </button>
                <Button 
                  variant="outline" 
                  size="default"
                  onClick={onLogout}
                  className="rounded-full px-6"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background backdrop-blur-lg">
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {!isLoggedIn ? (
                // 로그인 전 모바일 메뉴
                <>
{[
                    { label: '홈', href: '#home' },
                    { label: '기능', href: '#features' },
                    { label: '가격책정', href: '#pricing' },
                    { label: '고객사례', href: '#testimonials' },
                    { label: '가격', href: '#pricing' }
                  ].map((item, index) => (
                    <a 
                      key={index}
                      href={item.href} 
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <Button 
                    variant="outline" 
                    size="default"
                    onClick={() => {
                      onLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-full w-fit px-6"
                  >
                    로그인
                  </Button>
                </>
              ) : (
                // 로그인 후 모바일 메뉴
                <>
                  <button 
                    onClick={() => {
                      onAdGeneration();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    광고 생성
                  </button>
                  <button 
                    onClick={() => {
                      onModelCreation();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 flex items-center gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    모델 제작
                  </button>
                  <button 
                    onClick={() => {
                      onMarketplace();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    마켓플레이스
                  </button>
                  <button 
                    onClick={() => {
                      onMyPage();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    마이 페이지
                  </button>
                  <Button 
                    variant="outline" 
                    size="default"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-full w-fit px-6"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge 
              variant="secondary" 
              className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-primary/10 text-primary border border-primary/20"
            >
              <Zap className="w-4 h-4" />
              AI 기반 제품 촬영 혁신
            </Badge>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 sm:mb-8">
              모델 없이도{' '}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                완벽한 제품 광고
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              전통적인 모델 고용과 스튜디오 촬영의 복잡함을 AI로 해결하세요. 
              몇 번의 클릭만으로 브랜드에 완벽하게 맞는 전문 제품 이미지를 생성합니다.
            </p>
            
            <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center mb-16 flex-wrap">
              <Button 
                size="lg" 
                onClick={onGetStarted} 
                className="w-auto px-8 h-12 text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                무료로 시작하기
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={onLogin}
                className="w-auto px-8 h-12 text-base rounded-full border-2 hover:bg-muted/50 transition-all duration-300"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                회원가입
              </Button>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { value: '90%', label: '비용 절감', desc: '기존 촬영 대비' },
                { value: '5분', label: '생성 시간', desc: '이미지 당 평균' },
                { value: '4.9★', label: '고객 만족도', desc: '1,200+ 리뷰 기준' }
              ].map((stat, index) => (
                <div key={index} className="text-center p-10 rounded-2xl bg-card border">
                  <div className="text-6xl font-bold text-primary mb-4">
                    {stat.value}
                  </div>
                  <div className="text-2xl font-semibold mb-2">
                    {stat.label}
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {stat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center py-20 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              핵심 기능
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              전문가 수준의 제품 이미지를 
              <span className="text-primary"> AI로</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              복잡한 스튜디오 촬영 없이도 브랜드에 완벽하게 맞는 고품질 이미지를 생성하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: Target,
                title: "AI 배경 처리",
                description: "자동 배경 제거와 완벽한 품질 최적화로 전문가 수준의 결과물 제공",
                highlight: "자동 배경 제거"
              },
              {
                icon: Users,
                title: "다양한 AI 모델",
                description: "연령, 성별, 인종, 스타일을 자유롭게 선택할 수 있는 가상 모델 라이브러리",
                highlight: "500+ 모델 선택"
              },
              {
                icon: Sparkles,
                title: "전문 배경 & 조명",
                description: "스튜디오, 라이프스타일, 자연경 등 20+ 배경과 전문가 레벨의 조명 설정",
                highlight: "20+ 전문 배경"
              },
              {
                icon: Zap,
                title: "초고속 생성",
                description: "기존 수 시간에서 며칠의 작업을 단 5분 만에 완료하는 초고속 AI 엔진",
                highlight: "95% 시간 단축"
              },
              {
                icon: TrendingUp,
                title: "무제한 확장성",
                description: "모든 제품군과 브랜드 스타일에 대응하는 유연한 AI 시스템",
                highlight: "모든 제품군 대응"
              },
              {
                icon: Camera,
                title: "상업용 고품질",
                description: "4K 이상 해상도와 인쇄 품질의 이미지를 상업적 라이선스로 제공",
                highlight: "4K 상업용 품질"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-12 hover:shadow-xl transition-all duration-300 group border-0 bg-card/50 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-background flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-300">
                      <IconComponent className="w-10 h-10 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-semibold">
                          {feature.title}
                        </h3>
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {feature.highlight}
                        </Badge>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="min-h-screen flex items-center py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              작동 방식
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              3단계로 완성하는 <span className="text-primary">전문 제품 이미지</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "제품 이미지 업로드",
                description: "제품 사진을 업로드하면 AI가 자동으로 배경을 제거하고 최적화합니다",
                icon: Target
              },
              {
                step: "02",
                title: "모델 & 스타일 선택",
                description: "브랜드에 맞는 모델과 배경, 조명 스타일을 선택하세요",
                icon: Users
              },
              {
                step: "03",
                title: "완벽한 결과 다운로드",
                description: "AI가 생성한 전문가 수준의 제품 광고 이미지를 다운로드하세요",
                icon: CheckCircle
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 right-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent transform translate-x-1/2" />
                  )}
                  
                  <div className="relative mb-6">
                    <div className="w-40 h-40 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
                      <IconComponent className="w-16 h-16 text-primary" />
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                        {step.step}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="min-h-screen flex items-center py-20 sm:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              고객 후기
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-primary">1,000+</span> 브랜드가 선택한 이유
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "김민수",
                  role: "마케팅 디렉터, 패션브랜드 A",
                  rating: 5,
                  comment: "기존 모델 촬영비 90% 절약하면서도 더 높은 품질의 결과를 얻었습니다. 이제 매주 새로운 컨텐츠를 만들 수 있어요."
                },
                {
                  name: "이혜진",
                  role: "브랜드 매니저, 코스메틱 B",
                  comment: "다양한 모델과 배경으로 글로벌 마케팅이 가능해졌습니다. A/B 테스트도 쉽고 ROI가 300% 향상됐어요.",
                  rating: 5
                },
                {
                  name: "박정호",
                  role: "CEO, 스타트업 C",
                  comment: "스타트업에게는 정말 게임체인저입니다. 적은 예산으로도 대기업 수준의 마케팅 자료를 만들 수 있어요.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 bg-card border shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <div className="text-sm font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Subscription Plans Section */}
      <section id="about pricing" className="min-h-screen flex items-center py-20 sm:py-32 bg-gradient-to-br from-muted/50 via-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              구독 플랜
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-primary">완벽한</span> 플랜을 선택하세요
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              프로젝트 규모에 맞는 플랜으로 AI 제품 이미지 생성을 시작하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "무료",
                price: "₩0",
                period: "/월",
                description: "개인 사용자를 위한 무료 체험",
                features: [
                  "3장의 이미지 생성",
                  "기본 AI 모델 접근",
                  "표준 해상도 (1080p)",
                  "5개 배경 템플릿",
                  "이메일 지원"
                ],
                buttonText: "무료로 시작",
                popular: false,
                color: "green"
              },
              {
                name: "프로",
                price: "₩29,000",
                period: "/월",
                description: "소상공인과 프리랜서를 위한 플랜",
                features: [
                  "50장의 이미지 생성",
                  "프리미엄 AI 모델 접근",
                  "4K 고해상도",
                  "20+ 배경 템플릿",
                  "우선순위 지원",
                  "상업적 라이선스",
                  "배치 처리"
                ],
                buttonText: "프로 시작",
                popular: true,
                color: "blue"
              },
              {
                name: "비즈니스",
                price: "₩99,000",
                period: "/월",
                description: "기업과 대형 프로젝트를 위한 플랜",
                features: [
                  "무제한 이미지 생성",
                  "모든 프리미엄 AI 모델",
                  "8K 초고해상도",
                  "모든 배경 & 스타일",
                  "24/7 전담 지원",
                  "API 접근 권한",
                  "팀 협업 도구",
                  "커스텀 모델 학습"
                ],
                buttonText: "비즈니스 시작",
                popular: false,
                color: "purple"
              }
            ].map((plan, index) => {
              const colorClasses = {
                green: "border-green-200 bg-green-50/50",
                blue: "border-blue-200 bg-blue-50/50",
                purple: "border-purple-200 bg-purple-50/50"
              };
              const buttonColorClasses = {
                green: "bg-green-500 hover:bg-green-600 text-white",
                blue: "bg-blue-500 hover:bg-blue-600 text-white",
                purple: "bg-purple-500 hover:bg-purple-600 text-white"
              };
              
              return (
                <div key={index} className="flex items-center">
                  <Card className={`relative p-8 h-full w-full ${colorClasses[plan.color]} hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer`}>
                    <div className="p-6">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-3">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-lg text-muted-foreground">{plan.period}</span>
                        </div>
                        <p className="text-muted-foreground">{plan.description}</p>
                      </div>
                      
                      <div className="space-y-5 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-4">
                            <CheckCircle className={`w-5 h-5 text-${plan.color}-500 flex-shrink-0 mt-0.5`} />
                            <span className="text-base leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        className={`w-full ${buttonColorClasses[plan.color]}`}
                        size="lg"
                        onClick={plan.name === "무료" ? onGetStarted : onLogin}
                      >
                        {plan.buttonText}
                      </Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              모든 플랜에는 30일 무료 환불 보장이 포함되어 있습니다
            </p>
            <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                신용카드 불필요
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                언제든 업그레이드 가능
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                24시간 고객지원
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-card">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 items-center">
            {/* Logo - Left */}
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">
                NoModel
              </span>
            </div>

            {/* Navigation Links - Center */}
            <nav className="flex items-center justify-center gap-4 md:gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                서비스 소개
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                가격
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                고객지원
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                API 문서
              </a>
            </nav>

            {/* Copyright - Right */}
            <div className="flex justify-center md:justify-end">
              <p className="text-sm text-muted-foreground">
                © 2024 NoModel. 모든 권리 보유.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}