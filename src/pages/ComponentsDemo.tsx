import React, { useState } from 'react';
import { Button, Input, Card, Badge, Carousel } from '../components';
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
        <section className="demo-section">
          <h2 className="title-3">디자인 토큰</h2>
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
        <section className="demo-section">
          <h2 className="title-3">타이포그래피</h2>
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
        <section className="demo-section">
          <h2 className="title-3">버튼</h2>
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
        <section className="demo-section">
          <h2 className="title-3">입력 필드</h2>
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
        <section className="demo-section">
          <h2 className="title-3">카드</h2>
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
        <section className="demo-section">
          <h2 className="title-3">배지</h2>
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
        <section className="demo-section">
          <h2 className="title-3">캐러셀</h2>
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
        <section className="demo-section">
          <h2 className="title-3">이미지 카드</h2>
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
        <section className="demo-section">
          <h2 className="title-3">실제 사용 예시</h2>
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
      </div>
    </div>
  );
};