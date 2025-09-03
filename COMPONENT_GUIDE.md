# NoModel AI 컴포넌트 & 스타일 가이드

## 📚 목차
1. [디자인 시스템 개요](#디자인-시스템-개요)
2. [CSS 변수 시스템](#css-변수-시스템)
3. [컴포넌트 라이브러리](#컴포넌트-라이브러리)
4. [페이지 컴포넌트](#페이지-컴포넌트)
5. [레이아웃 패턴](#레이아웃-패턴)
6. [사용 예시](#사용-예시)

---

## 디자인 시스템 개요

NoModel AI는 일관된 디자인 시스템을 기반으로 구축되었습니다. CSS 변수를 활용한 테마 시스템과 shadcn/ui 컴포넌트를 사용합니다.

### 핵심 원칙
- **일관성**: 모든 컴포넌트는 동일한 디자인 토큰 사용
- **반응형**: 모바일 퍼스트 접근 방식
- **접근성**: WCAG 2.1 AA 기준 준수
- **성능**: 최적화된 번들 크기와 로딩 속도

---

## CSS 변수 시스템

### 색상 시스템 (Color System)

```css
/* 브랜드 색상 */
--color-brand-primary: /* 주요 브랜드 색상 */
--color-brand-secondary: /* 보조 브랜드 색상 */

/* 텍스트 색상 */
--color-text-primary: /* 주요 텍스트 */
--color-text-secondary: /* 보조 텍스트 */
--color-text-tertiary: /* 설명 텍스트 */

/* 배경 색상 */
--color-background-primary: /* 기본 배경 */
--color-background-secondary: /* 보조 배경 */
--color-background-tertiary: /* 세번째 배경 */

/* 시멘틱 색상 */
--color-semantic-green: /* 성공, 완료 */
--color-semantic-orange: /* 경고, 포인트 */
--color-semantic-red: /* 오류, 위험 */
--color-semantic-indigo: /* 정보, 링크 */
```

### 타이포그래피 (Typography)

```css
/* 폰트 크기 */
--font-size-mini: 0.75rem (12px)
--font-size-small: 0.875rem (14px)
--font-size-regular: 1rem (16px)
--font-size-body1: 1.125rem (18px)
--font-size-title3: 1.25rem (20px)
--font-size-title2: 1.5rem (24px)
--font-size-title1: 2rem (32px)
--font-size-hero: 3rem (48px)

/* 폰트 굵기 */
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### 간격 시스템 (Spacing)

```css
/* 간격 */
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
--spacing-5: 1.25rem (20px)
--spacing-6: 1.5rem (24px)
--spacing-8: 2rem (32px)
--spacing-10: 2.5rem (40px)
--spacing-12: 3rem (48px)
```

### 모서리 반경 (Border Radius)

```css
--radius-4: 4px
--radius-6: 6px
--radius-8: 8px
--radius-12: 12px
--radius-16: 16px
--radius-20: 20px
--radius-24: 24px
--radius-rounded: 9999px
```

---

## 컴포넌트 라이브러리

### UI 컴포넌트 (`src/components/ui/`)

#### Button
```tsx
import { Button } from './ui/button';

// 기본 버튼
<Button>클릭하기</Button>

// 변형 (Variants)
<Button variant="default">기본</Button>
<Button variant="outline">윤곽선</Button>
<Button variant="ghost">고스트</Button>
<Button variant="destructive">위험</Button>

// 크기 (Sizes)
<Button size="sm">작게</Button>
<Button size="default">기본</Button>
<Button size="lg">크게</Button>

// 커스텀 스타일
<Button 
  style={{
    backgroundColor: 'var(--color-brand-primary)',
    color: 'var(--color-utility-white)'
  }}
>
  커스텀 버튼
</Button>
```

#### Card
```tsx
import { Card } from './ui/card';

<Card 
  className="p-4"
  style={{
    backgroundColor: 'var(--color-background-primary)',
    borderColor: 'var(--color-border-primary)',
    borderRadius: 'var(--radius-12)'
  }}
>
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</Card>
```

#### Badge
```tsx
import { Badge } from './ui/badge';

<Badge variant="default">기본</Badge>
<Badge variant="secondary">보조</Badge>
<Badge variant="outline">윤곽선</Badge>
<Badge variant="destructive">위험</Badge>
```

#### Input
```tsx
import { Input } from './ui/input';

<Input
  placeholder="텍스트 입력..."
  className="h-12"
  style={{
    borderRadius: 'var(--radius-8)',
    borderColor: 'var(--color-border-primary)',
    backgroundColor: 'var(--color-input-background)'
  }}
/>
```

#### Select
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

<Select>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">옵션 1</SelectItem>
    <SelectItem value="option2">옵션 2</SelectItem>
  </SelectContent>
</Select>
```

#### Tabs
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">탭 1</TabsTrigger>
    <TabsTrigger value="tab2">탭 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">탭 1 내용</TabsContent>
  <TabsContent value="tab2">탭 2 내용</TabsContent>
</Tabs>
```

### 커스텀 컴포넌트

#### NavigationBar
```tsx
import { NavigationBar } from './NavigationBar';

<NavigationBar
  onLogin={() => {}}
  onLogout={() => {}}
  onAdGeneration={() => {}}
  onMyPage={() => {}}
  onHome={() => {}}
  userAvatar="이미지URL"
  isLoggedIn={true}
  isLandingPage={false}
/>
```

#### SectionHeader
```tsx
import { SectionHeader } from './ui/section-header';

<SectionHeader
  badge="배지 텍스트"
  normalText="일반 텍스트"
  highlightedText="강조 텍스트"
  description="설명 텍스트"
/>
```

#### ProgressIndicator
```tsx
import { ProgressIndicator } from './ui/progress-indicator';

const steps = [
  { id: 'step1', label: '단계 1', icon: Icon1 },
  { id: 'step2', label: '단계 2', icon: Icon2 }
];

<ProgressIndicator 
  steps={steps} 
  currentStep="step1"
  variant="horizontal" // or "compact"
/>
```

---

## 페이지 컴포넌트

### 주요 페이지 구조

#### 1. LandingPage
- **목적**: 서비스 소개 및 마케팅
- **섹션**: Hero, Features, Testimonials, Pricing
- **네비게이션**: 앵커 링크 기반 스크롤

#### 2. MyPage
- **목적**: 사용자 프로필 및 프로젝트 관리
- **기능**: 프로젝트 목록, 통계, 포인트 관리
- **레이아웃**: 그리드/리스트 뷰 전환 가능

#### 3. ModelSelectionPage
- **목적**: AI 모델 선택 인터페이스
- **기능**: 카테고리별 필터, 모델 카드 그리드
- **상태관리**: 선택된 모델 추적

#### 4. ModelMarketplace
- **목적**: 모델 거래 플랫폼
- **기능**: 검색, 필터, 구매, 판매
- **레이아웃**: 마켓플레이스 스타일 그리드

#### 5. ImageGenerationWorkflow
- **목적**: 이미지 생성 워크플로우
- **단계**: Upload → Style → Generate → Edit → Download
- **상태관리**: 단계별 진행 상태 추적

---

## 레이아웃 패턴

### 기본 컨테이너
```tsx
// 표준 페이지 컨테이너
<main className="py-8 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
  {/* 콘텐츠 */}
</main>
```

### 반응형 그리드
```tsx
// 3열 그리드 (모바일 1열)
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>...</Card>
  ))}
</div>
```

### Flexbox 레이아웃
```tsx
// 수평 정렬
<div className="flex items-center justify-between gap-4">
  <div>왼쪽 콘텐츠</div>
  <div>오른쪽 콘텐츠</div>
</div>

// 수직 정렬
<div className="flex flex-col gap-4">
  <div>상단 콘텐츠</div>
  <div>하단 콘텐츠</div>
</div>
```

---

## 사용 예시

### 새 페이지 만들기
```tsx
import React from 'react';
import { NavigationBar } from './NavigationBar';
import { Button } from './ui/button';
import { Card } from './ui/card';

export function NewPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar {...props} />
      
      <main className="py-8 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <h1 style={{
          fontSize: 'var(--font-size-title1)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)'
        }}>
          페이지 제목
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-4">
            <h3>카드 1</h3>
          </Card>
          <Card className="p-4">
            <h3>카드 2</h3>
          </Card>
          <Card className="p-4">
            <h3>카드 3</h3>
          </Card>
        </div>
      </main>
    </div>
  );
}
```

### 포인트 표시 컴포넌트
```tsx
import { Coins } from 'lucide-react';

<div className="flex items-center gap-2 px-4 py-3 rounded-lg" 
     style={{ backgroundColor: 'var(--color-background-secondary)' }}>
  <Coins className="w-5 h-5" 
         style={{ color: 'var(--color-semantic-orange)' }} />
  <span style={{ 
    color: 'var(--color-text-primary)', 
    fontWeight: 'var(--font-weight-medium)' 
  }}>
    {points.toLocaleString()}P
  </span>
</div>
```

### 상태 뱃지 컴포넌트
```tsx
const statusColors = {
  completed: 'var(--color-semantic-green)',
  processing: 'var(--color-semantic-orange)',
  failed: 'var(--color-semantic-red)'
};

<Badge style={{ 
  backgroundColor: statusColors[status] + '20',
  color: statusColors[status]
}}>
  {statusText}
</Badge>
```

---

## 모범 사례

### DO's ✅
- CSS 변수를 활용한 일관된 스타일링
- 반응형 클래스 사용 (sm:, md:, lg:)
- 컴포넌트 재사용 최대화
- 접근성 속성 추가 (aria-label, role 등)
- 의미있는 컴포넌트 이름 사용

### DON'Ts ❌
- 인라인 스타일로 하드코딩된 색상값 사용
- 중복된 컴포넌트 생성
- CSS 변수 무시하고 직접 값 입력
- 반응형 고려 없이 고정 크기 사용
- 접근성 무시

---

## 자주 사용하는 패턴

### 로딩 상태
```tsx
{isLoading ? (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
) : (
  <div>{/* 콘텐츠 */}</div>
)}
```

### 빈 상태
```tsx
{items.length === 0 ? (
  <div className="text-center py-12">
    <ImageIcon className="w-12 h-12 mx-auto mb-4" 
                style={{ color: 'var(--color-text-tertiary)' }} />
    <p style={{ color: 'var(--color-text-secondary)' }}>
      아직 항목이 없습니다
    </p>
  </div>
) : (
  <div>{/* 항목 목록 */}</div>
)}
```

### 에러 처리
```tsx
{error && (
  <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
    <XCircle className="w-4 h-4 inline mr-2" />
    {error.message}
  </div>
)}
```

---

## 추가 리소스

- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Radix UI 문서](https://www.radix-ui.com/)
- [Lucide 아이콘](https://lucide.dev/)

---

*이 문서는 NoModel AI 플랫폼의 컴포넌트 사용을 위한 가이드입니다. 지속적으로 업데이트됩니다.*