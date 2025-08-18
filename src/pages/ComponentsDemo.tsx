import React, { useState } from 'react';
import { Button, Input, Card, Badge, Carousel, Navbar, Footer, Hero } from '../components';
import type { CarouselItem } from '../components';
import { theme } from '../styles/theme';
import './ComponentsDemo.css';

// Simple icons for demonstration
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <Path d="21 21l-4.35-4.35"/>
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <Path d="12 5v14M5 12h14"/>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <Path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const Path = (props: any) => <path {...props} />;

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12.5 3.5C11.8 3.9 11 4.1 10.2 4.1C9.4 3.4 8.3 3 7.1 3C4.8 3 3 4.8 3 7.1C3 7.4 3 7.7 3.1 8C5.5 7.9 7.7 6.7 9.1 4.9C9.5 5.6 9.5 6.5 9.1 7.2C8.7 7.9 8 8.3 7.1 8.3H6.5C6.5 9.3 7.3 10.1 8.3 10.1C9.6 10.1 10.7 9.2 11.1 7.9C11.4 7 11.3 6 10.9 5.1C12.1 4.7 12.9 3.6 12.5 3.5Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1C4.1 1 1 4.1 1 8C1 11.1 3 13.7 5.9 14.7C6.3 14.8 6.5 14.5 6.5 14.3V13C4.8 13.4 4.4 12.2 4.4 12.2C4.1 11.4 3.6 11.2 3.6 11.2C2.9 10.8 3.6 10.8 3.6 10.8C4.3 10.9 4.7 11.5 4.7 11.5C5.4 12.6 6.5 12.3 6.5 12.1C6.6 11.6 6.8 11.3 7 11.1C5.4 10.9 3.7 10.3 3.7 7.6C3.7 6.8 4 6.2 4.7 5.7C4.6 5.5 4.4 4.8 4.8 3.8C4.8 3.8 5.4 3.6 6.5 4.3C7.1 4.1 7.8 4 8.5 4C9.2 4 9.9 4.1 10.5 4.3C11.6 3.6 12.2 3.8 12.2 3.8C12.6 4.8 12.4 5.5 12.3 5.7C13 6.2 13.3 6.8 13.3 7.6C13.3 10.3 11.6 10.9 10 11.1C10.3 11.3 10.5 11.8 10.5 12.5V14.3C10.5 14.5 10.7 14.8 11.1 14.7C14 13.7 16 11.1 16 8C16 4.1 12.9 1 8 1Z" fill="currentColor"/>
  </svg>
);

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13.5 3C12.5 2.5 11.4 2.1 10.2 1.9C10.1 2.1 9.9 2.4 9.8 2.6C8.5 2.4 7.2 2.4 6 2.6C5.9 2.4 5.7 2.1 5.6 1.9C4.4 2.1 3.3 2.5 2.3 3C0.3 6.1 -0.2 9.1 0.1 12C1.4 12.9 2.7 13.5 4 13.9C4.3 13.5 4.6 13 4.8 12.5C4.4 12.3 4 12.1 3.6 11.8C3.7 11.7 3.8 11.6 3.9 11.5C6.6 12.7 9.6 12.7 12.3 11.5C12.4 11.6 12.5 11.7 12.6 11.8C12.2 12.1 11.8 12.3 11.4 12.5C11.6 13 11.9 13.5 12.2 13.9C13.5 13.5 14.8 12.9 16.1 12C16.5 8.5 15.6 5.5 13.5 3ZM5.4 10.2C4.6 10.2 3.9 9.4 3.9 8.5C3.9 7.6 4.5 6.8 5.4 6.8C6.3 6.8 6.9 7.6 6.9 8.5C6.9 9.4 6.3 10.2 5.4 10.2ZM10.8 10.2C10 10.2 9.3 9.4 9.3 8.5C9.3 7.6 9.9 6.8 10.8 6.8C11.7 6.8 12.3 7.6 12.3 8.5C12.3 9.4 11.7 10.2 10.8 10.2Z" fill="currentColor"/>
  </svg>
);

export const ComponentsDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.length < 3 && e.target.value.length > 0) {
      setInputError('최소 3글자 이상 입력해주세요');
    } else {
      setInputError('');
    }
  };

  // Carousel 데이터
  const carouselItems: CarouselItem[] = [
    {
      id: '1',
      alt: 'Linear Design System 소개',
      content: (
        <div className="carousel-slide-content carousel-slide--primary">
          <h3 className="title-3">Linear Design System</h3>
          <p className="text-large">모던하고 일관된 사용자 경험을 위한 디자인 시스템</p>
        </div>
      )
    },
    {
      id: '2', 
      alt: '재사용 가능한 컴포넌트',
      content: (
        <div className="carousel-slide-content carousel-slide--secondary">
          <h3 className="title-3">재사용 가능한 컴포넌트</h3>
          <p className="text-large">Button, Input, Card, Badge, Carousel 등 완전한 컴포넌트 세트</p>
        </div>
      )
    },
    {
      id: '3',
      alt: 'TypeScript 지원',
      content: (
        <div className="carousel-slide-content carousel-slide--accent">
          <h3 className="title-3">완전한 TypeScript 지원</h3>
          <p className="text-large">타입 안전성과 최고의 개발자 경험</p>
        </div>
      )
    },
    {
      id: '4',
      alt: '접근성 우선',
      content: (
        <div className="carousel-slide-content carousel-slide--success">
          <h3 className="title-3">접근성 우선</h3>
          <p className="text-large">WCAG 2.1 AA 준수, 키보드 네비게이션, 스크린 리더 지원</p>
        </div>
      )
    }
  ];

  const featureCarouselItems: CarouselItem[] = [
    {
      id: 'feature-1',
      alt: '다크 모드',
      content: (
        <Card padding="large" className="feature-card">
          <div className="feature-icon">🌙</div>
          <h4 className="title-2">다크 모드</h4>
          <p className="text-regular">자동으로 시스템 설정을 따라 다크 모드가 적용됩니다</p>
        </Card>
      )
    },
    {
      id: 'feature-2',
      alt: '반응형 디자인',
      content: (
        <Card padding="large" className="feature-card">
          <div className="feature-icon">📱</div>
          <h4 className="title-2">반응형 디자인</h4>
          <p className="text-regular">모든 디바이스에서 완벽한 사용자 경험을 제공합니다</p>
        </Card>
      )
    },
    {
      id: 'feature-3',
      alt: '성능 최적화',
      content: (
        <Card padding="large" className="feature-card">
          <div className="feature-icon">⚡</div>
          <h4 className="title-2">성능 최적화</h4>
          <p className="text-regular">빠른 로딩과 부드러운 애니메이션으로 최적화된 성능</p>
        </Card>
      )
    }
  ];

  return (
    <div className="components-demo">
      <div className="demo-container">
        <header className="demo-header">
          <h1 className="title-6">Linear Design System</h1>
          <p className="text-large">프로젝트 전반에서 사용할 재사용 가능한 컴포넌트들의 데모입니다.</p>
        </header>

        {/* Theme Overview */}
        <section className="component-section">
          <h2 className="title-1 mb-6">디자인 토큰</h2>
          <div className="theme-grid">
            <Card padding="medium" shadow="low">
              <h3 className="title-1">브랜드 컬러</h3>
              <div className="color-palette">
                <div className="color-swatch" style={{ backgroundColor: theme.colors.brand.primary }}>
                  <span>Primary</span>
                  <code>{theme.colors.brand.primary}</code>
                </div>
                <div className="color-swatch" style={{ backgroundColor: theme.colors.brand.secondary }}>
                  <span>Secondary</span>
                  <code>{theme.colors.brand.secondary}</code>
                </div>
                <div className="color-swatch" style={{ backgroundColor: theme.colors.brand.accentTint }}>
                  <span>Accent Tint</span>
                  <code>{theme.colors.brand.accentTint}</code>
                </div>
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1">시맨틱 컬러</h3>
              <div className="color-palette">
                <div className="color-swatch" style={{ backgroundColor: theme.colors.semantic.blue }}>
                  <span>Blue</span>
                  <code>{theme.colors.semantic.blue}</code>
                </div>
                <div className="color-swatch" style={{ backgroundColor: theme.colors.semantic.green }}>
                  <span>Green</span>
                  <code>{theme.colors.semantic.green}</code>
                </div>
                <div className="color-swatch" style={{ backgroundColor: theme.colors.semantic.red }}>
                  <span>Red</span>
                  <code>{theme.colors.semantic.red}</code>
                </div>
                <div className="color-swatch" style={{ backgroundColor: theme.colors.semantic.orange }}>
                  <span>Orange</span>
                  <code>{theme.colors.semantic.orange}</code>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="component-section">
          <h2 className="title-1 mb-6">타이포그래피</h2>
          <Card padding="large" shadow="low">
            <div className="typography-showcase">
              <h1 className="title-6">Title 6 - 대형 제목</h1>
              <h2 className="title-4">Title 4 - 섹션 제목</h2>
              <h3 className="title-3">Title 3 - 서브 섹션</h3>
              <h4 className="title-1">Title 1 - 소제목</h4>
              <p className="text-large">Large Text - 중요한 본문</p>
              <p className="text-regular">Regular Text - 일반 본문 텍스트입니다. Linear.app의 디자인 시스템을 기반으로 만들어졌습니다.</p>
              <p className="text-small">Small Text - 보조 정보나 메타데이터</p>
              <p className="text-mini">Mini Text - 캡션이나 라벨</p>
            </div>
          </Card>
        </section>

        {/* Buttons */}
        <section className="component-section">
          <h2 className="title-1 mb-6">버튼</h2>
          <div className="component-grid">
            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">기본 버튼</h3>
              <div className="button-showcase">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="tertiary">Tertiary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">상태별 버튼</h3>
              <div className="button-showcase">
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" loading>Loading</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">사이즈별 버튼</h3>
              <div className="button-showcase">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">아이콘 버튼</h3>
              <div className="button-showcase">
                <Button icon={<PlusIcon />}>Add Item</Button>
                <Button icon={<HeartIcon />} iconPosition="right">Like</Button>
                <Button variant="ghost" icon={<SearchIcon />}>Search</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Inputs */}
        <section className="component-section">
          <h2 className="title-1 mb-6">입력 필드</h2>
          <div className="component-grid">
            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">기본 입력</h3>
              <div className="input-showcase">
                <Input 
                  label="이름" 
                  placeholder="이름을 입력하세요"
                  required
                />
                <Input 
                  label="이메일" 
                  type="email"
                  placeholder="example@email.com"
                  helperText="유효한 이메일 주소를 입력해주세요"
                />
                <Input 
                  label="테스트 입력"
                  value={inputValue}
                  onChange={handleInputChange}
                  error={inputError}
                  placeholder="최소 3글자 이상 입력해보세요"
                />
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">상태별 입력</h3>
              <div className="input-showcase">
                <Input 
                  label="비활성화됨" 
                  placeholder="입력할 수 없습니다"
                  disabled
                />
                <Input 
                  label="에러 상태" 
                  placeholder="에러가 있는 입력"
                  error="잘못된 형식입니다"
                />
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">아이콘 입력</h3>
              <div className="input-showcase">
                <Input 
                  label="검색" 
                  placeholder="검색어를 입력하세요"
                  leftIcon={<SearchIcon />}
                />
                <Input 
                  label="좋아요" 
                  placeholder="좋아하는 것을 입력하세요"
                  rightIcon={<HeartIcon />}
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Cards */}
        <section className="component-section">
          <h2 className="title-1 mb-6">카드</h2>
          <div className="component-grid">
            <Card variant="default" padding="medium" shadow="low">
              <h3 className="title-1 mb-2">기본 카드</h3>
              <p className="text-regular">기본 스타일의 카드입니다. 가장 일반적으로 사용됩니다.</p>
            </Card>

            <Card variant="elevated" padding="medium" shadow="medium">
              <h3 className="title-1 mb-2">엘리베이티드 카드</h3>
              <p className="text-regular">더 높은 elevation을 가진 카드입니다.</p>
            </Card>

            <Card variant="outlined" padding="medium" shadow="none">
              <h3 className="title-1 mb-2">아웃라인 카드</h3>
              <p className="text-regular">테두리가 강조된 카드입니다.</p>
            </Card>

            <Card 
              variant="default" 
              padding="medium" 
              shadow="low"
              interactive
              onClick={() => alert('카드가 클릭되었습니다!')}
            >
              <h3 className="title-1 mb-2">인터랙티브 카드</h3>
              <p className="text-regular">클릭할 수 있는 카드입니다. 호버 효과가 있습니다.</p>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section className="component-section">
          <h2 className="title-1 mb-6">배지</h2>
          <div className="component-grid">
            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">기본 배지</h3>
              <div className="badge-showcase">
                <Badge>Default</Badge>
                <Badge variant="filled">Filled</Badge>
                <Badge variant="outlined">Outlined</Badge>
                <Badge variant="ghost">Ghost</Badge>
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">컬러 배지</h3>
              <div className="badge-showcase">
                <Badge color="blue">Blue</Badge>
                <Badge color="green">Green</Badge>
                <Badge color="red">Red</Badge>
                <Badge color="orange">Orange</Badge>
                <Badge color="yellow">Yellow</Badge>
                <Badge color="indigo">Indigo</Badge>
                <Badge color="purple">Purple</Badge>
                <Badge color="gray">Gray</Badge>
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">사이즈별 배지</h3>
              <div className="badge-showcase">
                <Badge size="small" color="blue">Small</Badge>
                <Badge size="medium" color="green">Medium</Badge>
                <Badge size="large" color="red">Large</Badge>
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">상태 배지 예시</h3>
              <div className="badge-showcase">
                <Badge variant="filled" color="green">활성</Badge>
                <Badge variant="filled" color="red">비활성</Badge>
                <Badge variant="filled" color="orange">대기</Badge>
                <Badge variant="outlined" color="blue">진행중</Badge>
                <Badge variant="ghost" color="gray">완료</Badge>
              </div>
            </Card>
          </div>
        </section>

        {/* Carousel */}
        <section className="component-section">
          <h2 className="title-1 mb-6">캐러셀</h2>
          <div className="component-grid">
            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">기본 캐러셀</h3>
              <div className="carousel-demo">
                <Carousel
                  items={carouselItems}
                  className="carousel--medium"
                  onSlideChange={setCurrentSlide}
                  aria-label="Linear Design System 소개 캐러셀"
                />
                <p className="text-small carousel-info">
                  현재 슬라이드: {currentSlide + 1} / {carouselItems.length}
                </p>
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">자동 재생 캐러셀</h3>
              <div className="carousel-demo">
                <Carousel
                  items={featureCarouselItems}
                  className="carousel--medium"
                  autoPlay
                  autoPlayInterval={3000}
                  indicatorStyle="lines"
                  aria-label="기능 소개 캐러셀"
                />
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">숫자 인디케이터</h3>
              <div className="carousel-demo">
                <Carousel
                  items={carouselItems}
                  className="carousel--small"
                  indicatorStyle="numbers"
                  autoPlay={false}
                  aria-label="숫자 인디케이터 캐러셀"
                />
              </div>
            </Card>

            <Card padding="medium" shadow="low">
              <h3 className="title-1 mb-4">세로 캐러셀</h3>
              <div className="carousel-demo">
                <Carousel
                  items={featureCarouselItems}
                  className="carousel--medium"
                  orientation="vertical"
                  aria-label="세로 방향 캐러셀"
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Cards with Images */}
        <section className="component-section">
          <h2 className="title-1 mb-6">이미지 카드</h2>
          <div className="component-grid">
            <Card padding="none" shadow="medium" className="image-card">
              <div className="card-image">
                <div className="placeholder-image placeholder-image--gradient">
                  <span>🎨</span>
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="title-1">디자인 시스템</h3>
                  <Badge color="blue" size="small">New</Badge>
                </div>
                <p className="text-regular">Linear.app에서 영감을 받은 완전한 디자인 시스템</p>
                <div className="card-tags">
                  <Badge variant="ghost" color="purple" size="small">React</Badge>
                  <Badge variant="ghost" color="blue" size="small">TypeScript</Badge>
                </div>
              </div>
            </Card>

            <Card padding="none" shadow="medium" className="image-card" interactive>
              <div className="card-image">
                <div className="placeholder-image placeholder-image--geometric">
                  <span>📱</span>
                </div>
              </div>
              <div className="card-content">
                <div className="card-header">
                  <h3 className="title-1">모바일 앱</h3>
                  <Badge color="green" size="small">Live</Badge>
                </div>
                <p className="text-regular">모든 디바이스에서 완벽하게 작동하는 반응형 인터페이스</p>
                <div className="card-actions">
                  <Button size="small" variant="primary">
                    자세히 보기
                  </Button>
                  <Button size="small" variant="ghost" icon={<HeartIcon />}>
                    좋아요
                  </Button>
                </div>
              </div>
            </Card>

            <Card padding="none" shadow="medium" className="image-card">
              <div className="card-image">
                <div className="placeholder-image placeholder-image--pattern">
                  <span>⚡</span>
                </div>
              </div>
              <div className="card-content">
                <h3 className="title-1">성능 최적화</h3>
                <p className="text-regular">빠른 로딩과 부드러운 애니메이션으로 최적화된 사용자 경험</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="progress-text">
                  <span className="text-small">로딩 속도</span>
                  <span className="text-small">85%</span>
                </div>
              </div>
            </Card>

            <Card padding="large" shadow="high" className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <div className="avatar-placeholder">
                    👤
                  </div>
                </div>
                <div className="profile-info">
                  <h3 className="title-2">김개발자</h3>
                  <p className="text-regular">Frontend Developer</p>
                  <Badge color="green" variant="ghost" size="small">온라인</Badge>
                </div>
              </div>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number title-2">127</span>
                  <span className="stat-label text-small">프로젝트</span>
                </div>
                <div className="stat">
                  <span className="stat-number title-2">2.4K</span>
                  <span className="stat-label text-small">팔로워</span>
                </div>
                <div className="stat">
                  <span className="stat-number title-2">89</span>
                  <span className="stat-label text-small">팔로잉</span>
                </div>
              </div>
              <Button variant="primary" fullWidth>
                팔로우
              </Button>
            </Card>
          </div>
        </section>

        {/* Component Usage Examples */}
        <section className="component-section">
          <h2 className="title-1 mb-6">실제 사용 예시</h2>
          <div className="usage-examples">
            <Card padding="large" shadow="medium">
              <div className="example-header">
                <div>
                  <h3 className="title-2">사용자 프로필</h3>
                  <Badge color="green" size="small">온라인</Badge>
                </div>
                <Button variant="ghost" icon={<HeartIcon />}>
                  좋아요
                </Button>
              </div>
              
              <div className="example-content">
                <Input 
                  label="사용자명"
                  value="john_doe"
                  fullWidth
                />
                <Input 
                  label="이메일"
                  type="email"
                  value="john@example.com"
                  fullWidth
                />
                
                <div className="example-actions">
                  <Button variant="primary" fullWidth>
                    프로필 저장
                  </Button>
                  <Button variant="secondary" fullWidth>
                    취소
                  </Button>
                </div>
              </div>
            </Card>

            <Card padding="large" shadow="medium">
              <h3 className="title-2 mb-4">검색 인터페이스</h3>
              <div className="search-example">
                <Input 
                  placeholder="프로젝트 검색..."
                  leftIcon={<SearchIcon />}
                  fullWidth
                />
                
                <div className="search-filters">
                  <Badge variant="outlined" color="blue">React</Badge>
                  <Badge variant="outlined" color="green">TypeScript</Badge>
                  <Badge variant="outlined" color="orange">Design</Badge>
                </div>
                
                <div className="search-results">
                  <Card variant="outlined" padding="medium" interactive>
                    <div className="result-item">
                      <h4 className="title-1">Linear Design System</h4>
                      <p className="text-small">모던하고 일관된 UI 컴포넌트 라이브러리</p>
                      <div className="result-badges">
                        <Badge size="small" color="blue">React</Badge>
                        <Badge size="small" color="green">TypeScript</Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Hero Component */}
        <section className="component-section">
          <h2 className="title-1 mb-6">Hero 컴포넌트</h2>
          
          <div className="grid grid-2 gap-6">
            {/* Hero with Background Pattern */}
            <Card padding="none" className="demo-hero-container">
              <Hero
                size="small"
                title="혁신적인 디자인 시스템"
                subtitle="Modern UI Components"
                description="Linear.app에서 영감을 받은 현대적이고 일관된 사용자 인터페이스 컴포넌트 라이브러리입니다."
                actions={[
                  {
                    id: 'start',
                    label: '시작하기',
                    variant: 'primary',
                    onClick: () => alert('시작하기 클릭!'),
                  },
                  {
                    id: 'docs',
                    label: '문서 보기',
                    variant: 'secondary',
                    href: '#docs',
                  },
                ]}
                layout="center"
                animation="fade-up"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 50%, rgba(113, 112, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(113, 112, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 40% 80%, rgba(137, 137, 240, 0.08) 0%, transparent 50%)
                  `
                }}
                overlayOpacity={0}
              />
            </Card>

            {/* Hero with Abstract Background */}
            <Card padding="none" className="demo-hero-container">
              <Hero
                size="small"
                title="디자인의 새로운 기준"
                description="프로덕션 준비가 완료된 컴포넌트로 더 빠르게 개발하세요."
                actions={[
                  {
                    id: 'explore',
                    label: '살펴보기',
                    variant: 'primary',
                    icon: <SearchIcon />,
                    onClick: () => alert('살펴보기!'),
                  },
                ]}
                layout="center"
                textColor="light"
                animation="slide-up"
                style={{
                  background: `
                    linear-gradient(135deg, #667eea 0%, #764ba2 100%),
                    url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20zm20 0c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")
                  `,
                  backgroundSize: 'cover, 40px 40px'
                }}
                overlayOpacity={0}
              />
            </Card>
          </div>

          {/* More Hero Examples */}
          <div className="mt-6">
            <h3 className="title-2 mb-4">배경 이미지와 패턴 예제</h3>
            <div className="grid grid-3 gap-4">
              {/* Geometric Pattern Hero */}
              <Card padding="none" className="demo-hero-container" style={{ minHeight: '240px' }}>
                <Hero
                  size="small"
                  title="기하학적 패턴"
                  description="모던한 기하학적 패턴 배경"
                  actions={[
                    {
                      id: 'view',
                      label: '보기',
                      variant: 'primary',
                      size: 'small',
                      onClick: () => alert('기하학적 패턴!'),
                    },
                  ]}
                  layout="center"
                  textColor="light"
                  style={{
                    background: `
                      linear-gradient(45deg, #ff6b6b, #4ecdc4),
                      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='30,0 60,30 30,60 0,30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                    `,
                    backgroundSize: 'cover, 60px 60px'
                  }}
                  overlayOpacity={0}
                />
              </Card>

              {/* Dots Pattern Hero */}
              <Card padding="none" className="demo-hero-container" style={{ minHeight: '240px' }}>
                <Hero
                  size="small"
                  title="도트 패턴"
                  description="클래식한 도트 패턴 배경"
                  actions={[
                    {
                      id: 'explore',
                      label: '탐색',
                      variant: 'secondary',
                      size: 'small',
                      onClick: () => alert('도트 패턴!'),
                    },
                  ]}
                  layout="center"
                  style={{
                    background: `
                      linear-gradient(135deg, #a8edea 0%, #fed6e3 100%),
                      radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: 'cover, 20px 20px'
                  }}
                  overlayOpacity={0}
                />
              </Card>

              {/* Mesh Gradient Hero */}
              <Card padding="none" className="demo-hero-container" style={{ minHeight: '240px' }}>
                <Hero
                  size="small"
                  title="메시 그라디언트"
                  description="부드러운 메시 그라디언트"
                  actions={[
                    {
                      id: 'start',
                      label: '시작',
                      variant: 'primary',
                      size: 'small',
                      onClick: () => alert('메시 그라디언트!'),
                    },
                  ]}
                  layout="center"
                  textColor="light"
                  style={{
                    background: `
                      radial-gradient(ellipse at top left, #ff7b7b 0%, transparent 50%),
                      radial-gradient(ellipse at top right, #4ecdc4 0%, transparent 50%),
                      radial-gradient(ellipse at bottom left, #45b7d1 0%, transparent 50%),
                      radial-gradient(ellipse at bottom right, #f39c12 0%, transparent 50%),
                      linear-gradient(135deg, #667eea 0%, #764ba2 100%)
                    `
                  }}
                  overlayOpacity={0}
                />
              </Card>
            </div>
          </div>
        </section>

        {/* Navbar Component */}
        <section className="component-section">
          <h2 className="title-1 mb-6">Navbar 컴포넌트</h2>
          
          <div className="demo-navbar-container">
            <Card 
              padding="none" 
              className="navbar-demo navbar-demo--with-bg"
              style={{
                background: `
                  linear-gradient(135deg, rgba(113, 112, 255, 0.05) 0%, rgba(137, 137, 240, 0.05) 100%),
                  url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3Cpath d='M10 0v20'/%3E%3Cpath d='M0 10h20'/%3E%3C/g%3E%3C/svg%3E")
                `,
                backgroundSize: 'cover, 20px 20px'
              }}
            >
              <Navbar
                logo={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-brand-primary)', borderRadius: '4px' }} />
                    <span>Linear</span>
                  </div>
                }
                items={[
                  {
                    id: 'products',
                    label: '제품',
                    children: [
                      { id: 'linear', label: 'Linear', href: '#linear' },
                      { id: 'api', label: 'API', href: '#api' },
                      { id: 'sdk', label: 'SDK', href: '#sdk' },
                    ],
                  },
                  { id: 'pricing', label: '요금제', href: '#pricing' },
                  { id: 'docs', label: '문서', href: '#docs' },
                  { id: 'blog', label: '블로그', href: '#blog' },
                  {
                    id: 'company',
                    label: '회사',
                    children: [
                      { id: 'about', label: '회사 소개', href: '#about' },
                      { id: 'careers', label: '채용', href: '#careers', badge: '3' },
                      { id: 'contact', label: '연락처', href: '#contact' },
                    ],
                  },
                ]}
                rightContent={
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="small">로그인</Button>
                    <Button variant="primary" size="small">회원가입</Button>
                  </div>
                }
                activeItem="pricing"
              />
            </Card>
          </div>

          <div className="mt-4">
            <h3 className="title-2 mb-3">다양한 변형 및 배경</h3>
            <div className="grid grid-3 gap-4">
              {/* Transparent with Gradient Background */}
              <Card 
                padding="none"
                style={{
                  background: `linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)`,
                  borderRadius: 'var(--border-radius-lg)',
                  overflow: 'hidden'
                }}
              >
                <Navbar
                  variant="transparent"
                  logo="Brand"
                  items={[
                    { id: 'home', label: '홈', href: '#' },
                    { id: 'about', label: '소개', href: '#' },
                  ]}
                />
              </Card>
              
              {/* Filled with Pattern Background */}
              <Card 
                padding="none"
                style={{
                  background: `
                    linear-gradient(135deg, #667eea 0%, #764ba2 100%),
                    url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M15 0l15 15-15 15L0 15z'/%3E%3C/g%3E%3C/svg%3E")
                  `,
                  backgroundSize: 'cover, 30px 30px',
                  borderRadius: 'var(--border-radius-lg)',
                  overflow: 'hidden'
                }}
              >
                <Navbar
                  variant="filled"
                  logo="Brand"
                  items={[
                    { id: 'home', label: '홈', href: '#' },
                    { id: 'about', label: '소개', href: '#' },
                  ]}
                />
              </Card>
              
              {/* Default with Subtle Pattern */}
              <Card 
                padding="none"
                style={{
                  background: `
                    linear-gradient(135deg, #a8edea 0%, #fed6e3 100%),
                    url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Ccircle cx='6' cy='6' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
                  `,
                  backgroundSize: 'cover, 12px 12px',
                  borderRadius: 'var(--border-radius-lg)',
                  overflow: 'hidden'
                }}
              >
                <Navbar
                  logo="Mobile"
                  items={[
                    { id: 'menu1', label: '메뉴 1', href: '#' },
                    { id: 'menu2', label: '메뉴 2', href: '#' },
                    { id: 'menu3', label: '메뉴 3', href: '#' },
                  ]}
                />
              </Card>
            </div>
          </div>
        </section>

        {/* Footer Component */}
        <section className="component-section">
          <h2 className="title-1 mb-6">Footer 컴포넌트</h2>
          
          <Card padding="none" className="demo-footer-container">
            <Footer
              logo={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-brand-primary)', borderRadius: '6px' }} />
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Linear</span>
                </div>
              }
              description="Linear.app에서 영감을 받은 현대적인 디자인 시스템으로 일관되고 아름다운 사용자 인터페이스를 구축하세요."
              sections={[
                {
                  id: 'product',
                  title: '제품',
                  links: [
                    { id: 'features', label: '기능', href: '#features' },
                    { id: 'pricing', label: '요금제', href: '#pricing' },
                    { id: 'changelog', label: '변경사항', href: '#changelog', external: true },
                    { id: 'roadmap', label: '로드맵', href: '#roadmap' },
                  ],
                },
                {
                  id: 'developers',
                  title: '개발자',
                  links: [
                    { id: 'docs', label: '문서', href: '#docs' },
                    { id: 'api', label: 'API', href: '#api' },
                    { id: 'sdk', label: 'SDK', href: '#sdk' },
                    { id: 'github', label: 'GitHub', href: '#github', external: true },
                  ],
                },
                {
                  id: 'company',
                  title: '회사',
                  links: [
                    { id: 'about', label: '회사 소개', href: '#about' },
                    { id: 'careers', label: '채용', href: '#careers' },
                    { id: 'blog', label: '블로그', href: '#blog' },
                    { id: 'contact', label: '연락처', href: '#contact' },
                  ],
                },
              ]}
              socialLinks={[
                {
                  id: 'twitter',
                  platform: 'Twitter',
                  href: 'https://twitter.com',
                  label: 'Twitter에서 팔로우하기',
                  icon: <TwitterIcon />,
                },
                {
                  id: 'github',
                  platform: 'GitHub',
                  href: 'https://github.com',
                  label: 'GitHub에서 보기',
                  icon: <GitHubIcon />,
                },
                {
                  id: 'discord',
                  platform: 'Discord',
                  href: 'https://discord.com',
                  label: 'Discord 참여하기',
                  icon: <DiscordIcon />,
                },
              ]}
              newsletter={{
                title: '뉴스레터 구독',
                description: '최신 업데이트와 디자인 인사이트를 받아보세요.',
                placeholder: '이메일 주소를 입력하세요',
                buttonText: '구독하기',
                onSubmit: (email) => {
                  alert(`뉴스레터 구독: ${email}`);
                  return Promise.resolve();
                },
              }}
              copyright="© 2024 Linear Design System. All rights reserved."
              bottomLinks={[
                { id: 'privacy', label: '개인정보처리방침', href: '#privacy' },
                { id: 'terms', label: '서비스 약관', href: '#terms' },
                { id: 'cookies', label: '쿠키 설정', onClick: () => alert('쿠키 설정') },
              ]}
            />
          </Card>

          <div className="mt-6">
            <h3 className="title-2 mb-3">간단한 푸터</h3>
            <Card padding="none">
              <Footer
                variant="minimal"
                copyright="© 2024 Simple Company"
                bottomLinks={[
                  { id: 'privacy', label: '개인정보처리방침', href: '#' },
                  { id: 'terms', label: '약관', href: '#' },
                ]}
              />
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};