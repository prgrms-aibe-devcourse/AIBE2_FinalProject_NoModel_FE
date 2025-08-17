# Linear Design System

Linear.app에서 영감을 받은 완전한 디자인 시스템과 재사용 가능한 컴포넌트 라이브러리입니다.

## 🎨 특징

- **Linear.app 디자인 언어**: 모던하고 미니멀한 디자인 시스템
- **완전한 TypeScript 지원**: 타입 안전성과 개발자 경험 최적화
- **접근성 우선**: WCAG 2.1 AA 준수, 키보드 네비게이션, 스크린 리더 지원
- **반응형 디자인**: 모든 디바이스에서 완벽한 경험
- **CSS Custom Properties**: 테마 시스템과 다크 모드 지원
- **모듈형 아키텍처**: 필요한 컴포넌트만 가져와서 사용

## 🚀 시작하기

### 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 컴포넌트 데모를 확인하세요.

### 빌드

```bash
npm run build
```

## 📦 컴포넌트

### Button (버튼)

```tsx
import { Button } from './components';

<Button variant="primary" size="medium">
  클릭하세요
</Button>

<Button variant="secondary" icon={<Icon />} loading>
  로딩 중...
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'success'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `loading`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'
- `fullWidth`: boolean

### Input (입력 필드)

```tsx
import { Input } from './components';

<Input 
  label="이름"
  placeholder="이름을 입력하세요"
  required
  error="필수 항목입니다"
/>

<Input 
  leftIcon={<SearchIcon />}
  placeholder="검색..."
/>
```

**Props:**
- `label`: string
- `placeholder`: string
- `error`: string
- `helperText`: string
- `required`: boolean
- `disabled`: boolean
- `variant`: 'default' | 'filled' | 'outlined'
- `size`: 'small' | 'medium' | 'large'
- `leftIcon`, `rightIcon`: ReactNode

### Card (카드)

```tsx
import { Card } from './components';

<Card variant="elevated" padding="large" shadow="medium">
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</Card>

<Card interactive onClick={() => console.log('클릭!')}>
  클릭 가능한 카드
</Card>
```

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'filled'
- `padding`: 'none' | 'small' | 'medium' | 'large'
- `shadow`: 'none' | 'tiny' | 'low' | 'medium' | 'high'
- `interactive`: boolean
- `onClick`: function

### Badge (배지)

```tsx
import { Badge } from './components';

<Badge color="green" variant="filled">
  활성
</Badge>

<Badge color="red" size="small">
  에러
</Badge>
```

**Props:**
- `variant`: 'default' | 'filled' | 'outlined' | 'ghost'
- `size`: 'small' | 'medium' | 'large'
- `color`: 'blue' | 'red' | 'green' | 'orange' | 'yellow' | 'indigo' | 'purple' | 'gray'

### Carousel (캐러셀)

```tsx
import { Carousel } from './components';
import type { CarouselItem } from './components';

const items: CarouselItem[] = [
  {
    id: '1',
    alt: '첫 번째 슬라이드',
    content: <div>슬라이드 내용</div>
  }
];

<Carousel 
  items={items}
  autoPlay
  showIndicators
  onSlideChange={(index) => console.log(index)}
/>
```

**Props:**
- `items`: CarouselItem[] (필수) - 캐러셀 아이템 배열
- `orientation`: 'horizontal' | 'vertical' - 방향
- `showArrows`: boolean - 네비게이션 화살표 표시
- `showIndicators`: boolean - 인디케이터 표시
- `indicatorStyle`: 'dots' | 'lines' | 'numbers' - 인디케이터 스타일
- `autoPlay`: boolean - 자동 재생
- `autoPlayInterval`: number - 자동 재생 간격 (ms)
- `loop`: boolean - 무한 반복
- `pauseOnHover`: boolean - 호버 시 일시정지
- `onSlideChange`: (index: number) => void - 슬라이드 변경 콜백

## 🎨 디자인 토큰

### 컬러 시스템

```css
/* 브랜드 컬러 */
--color-brand-primary: #7170ff;
--color-brand-secondary: #8989f0;

/* 시맨틱 컬러 */
--color-semantic-blue: #4ea7fc;
--color-semantic-green: #4cb782;
--color-semantic-red: #eb5757;
--color-semantic-orange: #fc7840;
```

### 타이포그래피

```css
/* 폰트 패밀리 */
--font-family-regular: "Inter Variable", -apple-system, sans-serif;

/* 폰트 크기 */
--font-size-micro: 0.6875rem;    /* 11px */
--font-size-mini: 0.75rem;       /* 12px */
--font-size-small: 0.8125rem;    /* 13px */
--font-size-regular: 0.9375rem;  /* 15px */
--font-size-large: 1.125rem;     /* 18px */

/* 타이틀 */
.title-1, .title-2, .title-3 /* 등등... */
```

### 스페이싱

```css
--spacing-page-max-width: 1024px;
--spacing-page-padding-inline: 24px;
--spacing-block-small: 8px;
--spacing-block: 16px;
```

### 그림자 & 테두리

```css
--shadow-tiny: 0px 1px 1px 0px rgba(0,0,0,.09);
--shadow-low: 0px 1px 4px -1px rgba(0,0,0,.09);
--shadow-medium: 0px 3px 12px rgba(0,0,0,.09);

--radius-4: 4px;
--radius-8: 8px;
--radius-12: 12px;
--radius-rounded: 9999px;
```

## 🌙 다크 모드

자동으로 사용자의 시스템 설정을 따라 다크 모드가 적용됩니다.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #08090a;
    --color-text-primary: #f7f8f8;
    /* 등등... */
  }
}
```

## ♿ 접근성

모든 컴포넌트는 접근성을 고려하여 설계되었습니다:

- **키보드 네비게이션**: Tab, Enter, Space, Arrow keys 지원
- **스크린 리더**: ARIA 라벨과 역할 제공
- **포커스 관리**: 명확한 포커스 인디케이터
- **색상 대비**: WCAG 2.1 AA 기준 준수
- **의미있는 HTML**: 시맨틱 요소 사용

## 📱 반응형 디자인

```css
/* 브레이크포인트 */
--breakpoint-mobile: 640px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1280px;
```

모든 컴포넌트는 모바일부터 데스크톱까지 완벽하게 대응합니다.

## 🏗️ 아키텍처

```
src/
├── components/           # 재사용 가능한 컴포넌트
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   ├── Button.css
│   │   └── index.ts
│   └── ...
├── styles/              # 글로벌 스타일과 테마
│   ├── theme.ts         # 디자인 토큰
│   └── globals.css      # CSS Custom Properties
└── pages/              # 데모 페이지
    └── ComponentsDemo.tsx
```

## 🤝 컨트리뷰션

1. 새로운 컴포넌트는 `src/components/` 에 추가
2. TypeScript 인터페이스로 Props 정의
3. CSS는 BEM 네이밍 컨벤션 사용
4. 접근성 고려사항 준수
5. 반응형 디자인 구현

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

---

💡 **Tip**: 컴포넌트 데모 페이지에서 모든 컴포넌트의 사용법과 변형을 확인할 수 있습니다!
