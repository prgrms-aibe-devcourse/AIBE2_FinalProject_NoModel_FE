# Linear Design System - 컴포넌트 사용 가이드

## 📋 개요

Linear Design System은 일관되고 재사용 가능한 UI 컴포넌트를 제공하는 React 기반 디자인 시스템입니다. 모든 컴포넌트는 TypeScript로 작성되었으며, 접근성과 반응형 디자인을 기본으로 지원합니다.

## 🚀 시작하기

### 설치 및 Import

```tsx
// 컴포넌트 Import
import { 
  Button, 
  Input, 
  Card, 
  Badge, 
  Navbar, 
  Footer, 
  Hero, 
  Carousel 
} from '@/components';

// 타입 Import (필요시)
import type { 
  ButtonProps, 
  InputProps, 
  NavItem, 
  HeroAction 
} from '@/components';
```

### CSS Import
```tsx
// 디자인 토큰과 기본 스타일
import './src/design-tokens/tokens.css';
```

---

## 🔘 Button 컴포넌트

버튼은 사용자 상호작용의 핵심 요소입니다.

### 기본 사용법

```tsx
<Button variant="primary" size="medium">
  클릭하세요
</Button>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'outline' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` | 버튼의 시각적 스타일 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 버튼 크기 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |
| `loading` | `boolean` | `false` | 로딩 상태 |
| `fullWidth` | `boolean` | `false` | 전체 너비 사용 |
| `icon` | `ReactNode` | - | 아이콘 요소 |
| `iconPosition` | `'left' \| 'right'` | `'left'` | 아이콘 위치 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 버튼 타입 |
| `onClick` | `(event: MouseEvent) => void` | - | 클릭 핸들러 |

### 사용 예시

```tsx
// 기본 변형들
<Button variant="primary">주요 액션</Button>
<Button variant="secondary">보조 액션</Button>
<Button variant="outline">아웃라인</Button>
<Button variant="ghost">고스트</Button>

// 상태별 버튼
<Button variant="danger">삭제</Button>
<Button variant="success">저장</Button>
<Button loading>로딩중...</Button>
<Button disabled>비활성화</Button>

// 아이콘 버튼
<Button icon={<PlusIcon />}>추가</Button>
<Button icon={<HeartIcon />} iconPosition="right">좋아요</Button>

// 크기별 버튼
<Button size="small">작음</Button>
<Button size="medium">보통</Button>
<Button size="large">큼</Button>

// 폼 버튼
<Button type="submit" variant="primary">제출</Button>
<Button type="reset" variant="ghost">초기화</Button>
```

### 접근성 고려사항

- 모든 버튼은 키보드 탐색 지원
- 적절한 ARIA 속성 자동 적용
- 로딩 상태에서 스크린 리더 지원
- 최소 터치 타겟 크기 보장 (44px)

---

## 📝 Input 컴포넌트

폼 입력을 위한 텍스트 필드 컴포넌트입니다.

### 기본 사용법

```tsx
<Input 
  variant="default"
  label="이름"
  placeholder="이름을 입력하세요"
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'filled' \| 'outline'` | `'default'` | 입력 필드 스타일 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 입력 필드 크기 |
| `label` | `string` | - | 필드 라벨 |
| `placeholder` | `string` | - | 플레이스홀더 텍스트 |
| `error` | `string` | - | 에러 메시지 |
| `helperText` | `string` | - | 도움말 텍스트 |
| `required` | `boolean` | `false` | 필수 입력 여부 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |
| `type` | `string` | `'text'` | HTML input 타입 |
| `value` | `string` | - | 입력 값 |
| `onChange` | `(value: string) => void` | - | 값 변경 핸들러 |

### 사용 예시

```tsx
// 기본 입력
<Input 
  variant="default"
  label="이메일"
  type="email"
  placeholder="example@email.com"
  required
/>

// 에러 상태
<Input 
  label="비밀번호"
  type="password"
  error="비밀번호는 8자 이상이어야 합니다"
/>

// 도움말 텍스트
<Input 
  label="사용자명"
  helperText="3-20자의 영문, 숫자, 언더스코어만 사용 가능"
/>

// 제어된 컴포넌트
function MyForm() {
  const [email, setEmail] = useState('');
  
  return (
    <Input 
      label="이메일"
      value={email}
      onChange={setEmail}
      type="email"
    />
  );
}

// 다양한 타입
<Input label="전화번호" type="tel" />
<Input label="날짜" type="date" />
<Input label="숫자" type="number" />
<Input label="URL" type="url" />
```

### 폼 예시

```tsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="이름"
        value={formData.name}
        onChange={(value) => setFormData({...formData, name: value})}
        required
      />
      <Input
        label="이메일"
        type="email"
        value={formData.email}
        onChange={(value) => setFormData({...formData, email: value})}
        required
      />
      <Button type="submit" variant="primary">
        전송
      </Button>
    </form>
  );
}
```

---

## 📄 Card 컴포넌트

콘텐츠를 그룹화하는 컨테이너 컴포넌트입니다.

### 기본 사용법

```tsx
<Card variant="default" padding="medium">
  <h3>카드 제목</h3>
  <p>카드 내용입니다.</p>
</Card>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'outline' \| 'filled'` | `'default'` | 카드 스타일 |
| `padding` | `'none' \| 'small' \| 'medium' \| 'large'` | `'medium'` | 내부 여백 |
| `shadow` | `'none' \| 'small' \| 'medium' \| 'large'` | `'small'` | 그림자 효과 |
| `interactive` | `boolean` | `false` | 호버 효과 활성화 |
| `className` | `string` | - | 추가 CSS 클래스 |
| `onClick` | `() => void` | - | 클릭 핸들러 |

### 사용 예시

```tsx
// 기본 카드
<Card variant="default" padding="medium" shadow="low">
  <h3>제품 정보</h3>
  <p>제품에 대한 설명이 들어갑니다.</p>
</Card>

// 아웃라인 카드
<Card variant="outline" padding="large">
  <h3>중요한 정보</h3>
  <p>테두리가 강조된 카드입니다.</p>
</Card>

// 클릭 가능한 카드
<Card 
  variant="default" 
  padding="medium" 
  interactive
  onClick={() => console.log('카드 클릭')}
>
  <h3>클릭해보세요</h3>
  <p>이 카드는 클릭할 수 있습니다.</p>
</Card>

// 이미지 카드
<Card padding="none" shadow="medium">
  <img 
    src="/image.jpg" 
    alt="이미지" 
    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
  />
  <div style={{ padding: '1rem' }}>
    <h3>이미지 카드</h3>
    <p>이미지와 함께 사용하는 카드입니다.</p>
  </div>
</Card>
```

### 카드 레이아웃 패턴

```tsx
// 제품 카드
function ProductCard({ product }) {
  return (
    <Card variant="default" padding="medium" shadow="low" interactive>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <Badge variant="soft" color="blue">{product.category}</Badge>
          <h3 style={{ margin: '8px 0' }}>{product.name}</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>{product.description}</p>
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          ${product.price}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button variant="primary" size="small">구매하기</Button>
        <Button variant="outline" size="small">더 보기</Button>
      </div>
    </Card>
  );
}

// 통계 카드
function StatCard({ title, value, change }) {
  return (
    <Card variant="filled" padding="medium">
      <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-text-secondary)' }}>
        {title}
      </h4>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '8px 0' }}>
        {value}
      </div>
      <Badge 
        variant="soft" 
        color={change > 0 ? 'green' : 'red'}
      >
        {change > 0 ? '+' : ''}{change}%
      </Badge>
    </Card>
  );
}
```

---

## 🏷️ Badge 컴포넌트

상태나 카테고리를 표시하는 작은 라벨 컴포넌트입니다.

### 기본 사용법

```tsx
<Badge variant="filled" color="blue">
  새로운
</Badge>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'outline' \| 'filled' \| 'soft'` | `'filled'` | 배지 스타일 |
| `color` | `'gray' \| 'red' \| 'yellow' \| 'green' \| 'blue' \| 'indigo' \| 'purple' \| 'pink'` | `'gray'` | 배지 색상 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 배지 크기 |
| `className` | `string` | - | 추가 CSS 클래스 |

### 사용 예시

```tsx
// 상태 표시
<Badge variant="filled" color="green">활성</Badge>
<Badge variant="filled" color="red">비활성</Badge>
<Badge variant="filled" color="orange">대기</Badge>
<Badge variant="filled" color="blue">진행중</Badge>

// 카테고리 표시
<Badge variant="outline" color="blue">React</Badge>
<Badge variant="outline" color="green">TypeScript</Badge>
<Badge variant="outline" color="purple">Design</Badge>

// 소프트 스타일
<Badge variant="soft" color="indigo">베타</Badge>
<Badge variant="soft" color="pink">인기</Badge>
<Badge variant="soft" color="yellow">새로운</Badge>

// 크기별
<Badge size="small">작음</Badge>
<Badge size="medium">보통</Badge>
<Badge size="large">큼</Badge>
```

### 실제 사용 패턴

```tsx
// 알림 개수 표시
function NotificationIcon({ count }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <BellIcon />
      {count > 0 && (
        <Badge 
          variant="filled" 
          color="red" 
          size="small"
          style={{ 
            position: 'absolute', 
            top: '-8px', 
            right: '-8px' 
          }}
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </div>
  );
}

// 상태 표시 테이블
function UserTable({ users }) {
  return (
    <table>
      <thead>
        <tr>
          <th>이름</th>
          <th>상태</th>
          <th>역할</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <Badge 
                variant="filled" 
                color={user.status === 'active' ? 'green' : 'gray'}
              >
                {user.status === 'active' ? '활성' : '비활성'}
              </Badge>
            </td>
            <td>
              <Badge variant="outline" color="blue">
                {user.role}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## 🧭 Navbar 컴포넌트

사이트 네비게이션을 위한 상단 메뉴바 컴포넌트입니다.

### 기본 사용법

```tsx
<Navbar
  logo={<img src="/logo.png" alt="로고" />}
  items={navItems}
  rightContent={<div>로그인 버튼</div>}
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logo` | `ReactNode` | - | 로고 요소 |
| `items` | `NavItem[]` | `[]` | 네비게이션 아이템들 |
| `rightContent` | `ReactNode` | - | 오른쪽 영역 콘텐츠 |
| `variant` | `'default' \| 'transparent' \| 'filled'` | `'default'` | 네비게이션 스타일 |
| `fixed` | `boolean` | `false` | 고정 위치 여부 |
| `showMobileMenu` | `boolean` | `true` | 모바일 메뉴 표시 |
| `activeItem` | `string` | - | 활성 아이템 ID |
| `onItemClick` | `(item: NavItem) => void` | - | 아이템 클릭 핸들러 |

### NavItem 타입

```tsx
interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItem[]; // 드롭다운 메뉴
}
```

### 사용 예시

```tsx
// 기본 네비게이션 아이템
const navItems: NavItem[] = [
  { 
    id: 'home', 
    label: '홈', 
    href: '/' 
  },
  { 
    id: 'products', 
    label: '제품',
    children: [
      { id: 'web', label: '웹 앱', href: '/web' },
      { id: 'mobile', label: '모바일 앱', href: '/mobile' },
      { id: 'api', label: 'API', href: '/api' },
    ]
  },
  { 
    id: 'pricing', 
    label: '요금제', 
    href: '/pricing' 
  },
  { 
    id: 'company', 
    label: '회사',
    children: [
      { id: 'about', label: '회사 소개', href: '/about' },
      { id: 'careers', label: '채용', href: '/careers', badge: '3' },
      { id: 'contact', label: '연락처', href: '/contact' },
    ]
  },
];

// 완전한 네비게이션 예시
<Navbar
  logo={
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        backgroundColor: 'var(--color-brand-primary)', 
        borderRadius: '6px' 
      }} />
      <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
        Linear
      </span>
    </div>
  }
  items={navItems}
  rightContent={
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button variant="ghost" size="small">로그인</Button>
      <Button variant="primary" size="small">회원가입</Button>
    </div>
  }
  activeItem="home"
  fixed={true}
  onItemClick={(item) => console.log('Clicked:', item.label)}
/>

// 투명 배경 네비게이션
<Navbar
  variant="transparent"
  logo="Brand"
  items={[
    { id: 'home', label: '홈', href: '#' },
    { id: 'about', label: '소개', href: '#' },
  ]}
/>
```

### 네비게이션 패턴

```tsx
// React Router와 함께 사용
import { useLocation, Link } from 'react-router-dom';

function AppNavbar() {
  const location = useLocation();
  
  const navItems = [
    { id: 'dashboard', label: '대시보드', href: '/dashboard' },
    { id: 'projects', label: '프로젝트', href: '/projects' },
    { id: 'team', label: '팀', href: '/team' },
  ];

  return (
    <Navbar
      logo={<Link to="/">MyApp</Link>}
      items={navItems.map(item => ({
        ...item,
        onClick: () => navigate(item.href)
      }))}
      activeItem={navItems.find(item => 
        location.pathname.startsWith(item.href)
      )?.id}
    />
  );
}
```

---

## 🦶 Footer 컴포넌트

사이트 하단에 위치하는 푸터 컴포넌트입니다.

### 기본 사용법

```tsx
<Footer
  companyName="Your Company"
  sections={footerSections}
  socialLinks={socialLinks}
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `companyName` | `string` | - | 회사명 |
| `sections` | `FooterSection[]` | `[]` | 푸터 섹션들 |
| `socialLinks` | `SocialLink[]` | `[]` | 소셜 미디어 링크 |
| `newsletter` | `NewsletterConfig` | - | 뉴스레터 구독 설정 |
| `legal` | `FooterLink[]` | `[]` | 법적 정보 링크 |
| `variant` | `'default' \| 'minimal' \| 'extended'` | `'default'` | 푸터 스타일 |
| `description` | `string` | - | 회사 설명 |

### 타입 정의

```tsx
interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}

interface SocialLink {
  platform: 'twitter' | 'github' | 'linkedin' | 'facebook' | 'instagram';
  url: string;
}

interface NewsletterConfig {
  title: string;
  description: string;
  placeholder: string;
  onSubmit: (email: string) => Promise<void>;
}
```

### 사용 예시

```tsx
// 푸터 섹션 구성
const footerSections: FooterSection[] = [
  {
    title: "제품",
    links: [
      { label: "기능", href: "/features" },
      { label: "요금제", href: "/pricing" },
      { label: "API 문서", href: "/docs", external: true },
      { label: "업데이트", href: "/updates" },
    ]
  },
  {
    title: "회사",
    links: [
      { label: "회사 소개", href: "/about" },
      { label: "블로그", href: "/blog" },
      { label: "채용", href: "/careers" },
      { label: "언론 보도", href: "/press" },
    ]
  },
  {
    title: "지원",
    links: [
      { label: "도움말 센터", href: "/help" },
      { label: "커뮤니티", href: "/community" },
      { label: "상태 페이지", href: "/status", external: true },
      { label: "연락처", href: "/contact" },
    ]
  },
];

// 소셜 링크
const socialLinks: SocialLink[] = [
  { platform: 'twitter', url: 'https://twitter.com/company' },
  { platform: 'github', url: 'https://github.com/company' },
  { platform: 'linkedin', url: 'https://linkedin.com/company/company' },
];

// 완전한 푸터 예시
<Footer
  companyName="Linear Design System"
  description="팀이 좋아하는 이슈 추적기. 빠르고, 직관적이며, 강력합니다."
  sections={footerSections}
  socialLinks={socialLinks}
  newsletter={{
    title: "뉴스레터 구독",
    description: "제품 업데이트와 새로운 기능에 대한 소식을 받아보세요",
    placeholder: "이메일 주소를 입력하세요",
    onSubmit: async (email) => {
      console.log('구독 이메일:', email);
      // API 호출 로직
      await fetch('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    }
  }}
  legal={[
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "이용약관", href: "/terms" },
    { label: "쿠키 정책", href: "/cookies" },
  ]}
/>

// 미니멀 푸터
<Footer
  variant="minimal"
  companyName="Simple Company"
  sections={[
    {
      title: "링크",
      links: [
        { label: "홈", href: "/" },
        { label: "소개", href: "/about" },
        { label: "연락처", href: "/contact" },
      ]
    }
  ]}
  socialLinks={[
    { platform: 'twitter', url: 'https://twitter.com/company' },
    { platform: 'github', url: 'https://github.com/company' },
  ]}
/>
```

---

## 🦸 Hero 컴포넌트

랜딩 페이지나 섹션 상단의 주요 메시지를 표시하는 컴포넌트입니다.

### 기본 사용법

```tsx
<Hero
  title="멋진 제품을 만드세요"
  subtitle="최고의 도구로 더 나은 경험을 제공하세요"
  actions={heroActions}
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | 주 제목 |
| `subtitle` | `string` | - | 부 제목 |
| `description` | `string` | - | 상세 설명 |
| `actions` | `HeroAction[]` | `[]` | 액션 버튼들 |
| `layout` | `'left' \| 'center' \| 'right'` | `'center'` | 텍스트 정렬 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Hero 크기 |
| `backgroundImage` | `string` | - | 배경 이미지 URL |
| `backgroundVideo` | `string` | - | 배경 비디오 URL |
| `overlayOpacity` | `number` | `0.3` | 오버레이 투명도 (0-1) |
| `textColor` | `'light' \| 'dark'` | `'dark'` | 텍스트 색상 |

### HeroAction 타입

```tsx
interface HeroAction {
  id: string;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
}
```

### 사용 예시

```tsx
// 기본 Hero
const heroActions: HeroAction[] = [
  {
    id: 'get-started',
    label: '시작하기',
    variant: 'primary',
    onClick: () => navigate('/signup'),
  },
  {
    id: 'learn-more',
    label: '더 알아보기',
    variant: 'outline',
    href: '/features',
  },
];

<Hero
  title="Linear로 더 나은 제품을 만드세요"
  subtitle="팀이 좋아하는 이슈 추적기. 빠르고, 직관적이며, 강력합니다."
  actions={heroActions}
  layout="center"
/>

// 배경 이미지가 있는 Hero
<Hero
  title="멋진 팀워크"
  subtitle="함께 만들어가는 성공"
  actions={[
    { id: 'join', label: '팀 참여하기', variant: 'primary' },
  ]}
  layout="left"
  backgroundImage="https://images.unsplash.com/photo-teamwork"
  overlayOpacity={0.4}
  textColor="light"
/>

// 작은 크기 Hero (섹션용)
<Hero
  size="small"
  title="새로운 기능"
  subtitle="더욱 강력해진 도구들"
  actions={[
    {
      id: 'explore',
      label: '둘러보기',
      variant: 'primary',
      size: 'small',
    }
  ]}
/>

// 커스텀 스타일 Hero
<Hero
  title="창의적인 배경"
  subtitle="그라데이션과 패턴의 조화"
  actions={[{ id: 'try', label: '체험하기', variant: 'primary' }]}
  style={{
    background: `
      linear-gradient(135deg, #667eea 0%, #764ba2 100%),
      url("data:image/svg+xml,...")
    `,
    backgroundSize: 'cover, 50px 50px'
  }}
  textColor="light"
  overlayOpacity={0}
/>
```

### Hero 레이아웃 패턴

```tsx
// 제품 소개 Hero
function ProductHero({ product }) {
  return (
    <Hero
      title={product.name}
      subtitle={product.tagline}
      description={product.description}
      actions={[
        {
          id: 'try-free',
          label: '무료로 시작하기',
          variant: 'primary',
          size: 'large',
        },
        {
          id: 'watch-demo',
          label: '데모 보기',
          variant: 'outline',
          size: 'large',
        },
      ]}
      backgroundImage={product.heroImage}
      layout="center"
      textColor="light"
    />
  );
}

// 기능 소개 Hero
function FeatureHero({ feature }) {
  return (
    <Hero
      size="small"
      title={feature.title}
      subtitle={feature.subtitle}
      actions={[
        {
          id: 'learn-more',
          label: '자세히 보기',
          variant: 'primary',
        },
      ]}
      layout="left"
    />
  );
}
```

---

## 🎠 Carousel 컴포넌트

여러 콘텐츠를 슬라이드로 표시하는 컴포넌트입니다.

### 기본 사용법

```tsx
<Carousel
  items={carouselItems}
  autoPlay={true}
  showIndicators={true}
/>
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CarouselItem[]` | - | 슬라이드 아이템들 |
| `autoPlay` | `boolean` | `false` | 자동 재생 여부 |
| `autoPlayInterval` | `number` | `3000` | 자동 재생 간격 (ms) |
| `showIndicators` | `boolean` | `true` | 인디케이터 표시 |
| `showArrows` | `boolean` | `true` | 화살표 표시 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 슬라이드 방향 |
| `indicatorStyle` | `'dots' \| 'lines' \| 'numbers'` | `'dots'` | 인디케이터 스타일 |
| `loop` | `boolean` | `true` | 무한 반복 여부 |

### CarouselItem 타입

```tsx
interface CarouselItem {
  id: string;
  content: ReactNode;
  alt?: string;
}
```

### 사용 예시

```tsx
// 기본 캐러셀
const carouselItems: CarouselItem[] = [
  {
    id: '1',
    content: (
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        padding: '60px 40px',
        textAlign: 'center',
        borderRadius: '12px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '2rem' }}>
          혁신적인 기능
        </h3>
        <p style={{ margin: 0, fontSize: '1.25rem' }}>
          더욱 강력해진 도구로 생산성을 높이세요
        </p>
      </div>
    ),
    alt: '첫 번째 슬라이드'
  },
  {
    id: '2',
    content: (
      <div style={{ 
        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
        color: 'white',
        padding: '60px 40px',
        textAlign: 'center',
        borderRadius: '12px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '2rem' }}>
          팀 협업
        </h3>
        <p style={{ margin: 0, fontSize: '1.25rem' }}>
          팀원들과 실시간으로 소통하고 협업하세요
        </p>
      </div>
    ),
    alt: '두 번째 슬라이드'
  },
  {
    id: '3',
    content: (
      <div style={{ 
        background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        color: 'white',
        padding: '60px 40px',
        textAlign: 'center',
        borderRadius: '12px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '2rem' }}>
          데이터 분석
        </h3>
        <p style={{ margin: 0, fontSize: '1.25rem' }}>
          인사이트를 얻고 더 나은 결정을 내리세요
        </p>
      </div>
    ),
    alt: '세 번째 슬라이드'
  },
];

<Carousel
  items={carouselItems}
  autoPlay={true}
  autoPlayInterval={5000}
  showIndicators={true}
  showArrows={true}
  orientation="horizontal"
  indicatorStyle="dots"
/>

// 제품 쇼케이스 캐러셀
const productSlides = products.map(product => ({
  id: product.id,
  content: (
    <Card padding="large" shadow="medium">
      <div style={{ textAlign: 'center' }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{ width: '100%', maxWidth: '300px', marginBottom: '20px' }}
        />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button variant="primary" size="small">구매하기</Button>
          <Button variant="outline" size="small">자세히 보기</Button>
        </div>
      </div>
    </Card>
  ),
}));

<Carousel
  items={productSlides}
  autoPlay={false}
  showIndicators={true}
  indicatorStyle="numbers"
/>

// 이미지 갤러리 캐러셀
const imageSlides = images.map((image, index) => ({
  id: `image-${index}`,
  content: (
    <img 
      src={image.url} 
      alt={image.alt}
      style={{ 
        width: '100%', 
        height: '400px', 
        objectFit: 'cover',
        borderRadius: '8px'
      }}
    />
  ),
  alt: image.alt
}));

<Carousel
  items={imageSlides}
  autoPlay={true}
  autoPlayInterval={4000}
  showIndicators={true}
  showArrows={true}
  indicatorStyle="lines"
/>
```

---

## 🎨 스타일링 가이드

### CSS 커스텀 프로퍼티 사용

모든 컴포넌트는 CSS 커스텀 프로퍼티를 사용하여 스타일을 정의합니다:

```css
/* 브랜드 색상 커스터마이징 */
:root {
  --color-brand-primary: #6366f1;
  --color-brand-secondary: #8b5cf6;
  
  /* 컴포넌트별 커스터마이징 */
  --button-primary-bg: var(--color-brand-primary);
  --card-border-radius: 12px;
  --navbar-height: 72px;
}
```

### 반응형 디자인

모든 컴포넌트는 모바일 우선 반응형 디자인을 적용합니다:

```css
/* 자동으로 적용되는 반응형 브레이크포인트 */
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */
```

### 다크 모드 지원

시스템 다크 모드 설정을 자동으로 감지하고 적용합니다:

```css
@media (prefers-color-scheme: dark) {
  /* 다크 모드 스타일 자동 적용 */
}
```

---

## ♿ 접근성 가이드

### 키보드 내비게이션

- **Tab**: 다음 요소로 이동
- **Shift + Tab**: 이전 요소로 이동
- **Enter/Space**: 버튼 활성화
- **Arrow Keys**: 메뉴/캐러셀 내비게이션
- **Escape**: 모달/드롭다운 닫기

### 스크린 리더 지원

모든 컴포넌트는 적절한 ARIA 속성을 포함합니다:

```tsx
// 자동으로 적용되는 ARIA 속성들
<Button aria-label="사용자 메뉴 열기" />
<Input aria-describedby="help-text" />
<Navbar role="navigation" aria-label="주 메뉴" />
```

### 색상 대비

WCAG 2.1 AA 기준을 충족하는 색상 대비를 제공합니다:

- 일반 텍스트: 4.5:1 이상
- 큰 텍스트: 3:1 이상
- 상호작용 요소: 3:1 이상

---

## 🔧 고급 사용법

### 컴포넌트 조합 패턴

```tsx
// 검색 인터페이스
function SearchInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  return (
    <Card variant="outline" padding="large">
      <div style={{ marginBottom: '24px' }}>
        <Input
          label="검색어"
          value={query}
          onChange={setQuery}
          placeholder="검색할 내용을 입력하세요"
        />
      </div>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <Badge variant="outline" color="blue">React</Badge>
        <Badge variant="outline" color="green">TypeScript</Badge>
        <Badge variant="outline" color="purple">Design</Badge>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {results.map(item => (
          <Card key={item.id} variant="default" padding="medium" interactive>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <Button variant="primary" size="small">보기</Button>
              <Button variant="ghost" size="small">저장</Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}

// 대시보드 레이아웃
function Dashboard() {
  return (
    <div>
      <Navbar
        logo="Dashboard"
        items={dashboardNavItems}
        rightContent={<UserMenu />}
      />
      
      <main style={{ padding: '24px' }}>
        <Hero
          size="small"
          title="대시보드"
          subtitle="프로젝트 현황을 한눈에 확인하세요"
          layout="left"
        />
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '32px'
        }}>
          <StatCard title="총 프로젝트" value="24" change={12} />
          <StatCard title="완료율" value="87%" change={5} />
          <StatCard title="팀 멤버" value="12" change={-2} />
        </div>
      </main>
      
      <Footer
        companyName="My Company"
        sections={footerSections}
        variant="minimal"
      />
    </div>
  );
}
```

### 테마 커스터마이징

```tsx
// 컴포넌트별 테마 오버라이드
function CustomButton(props) {
  return (
    <Button
      {...props}
      style={{
        '--button-primary-bg': '#ff6b6b',
        '--button-primary-hover': '#ff5252',
        ...props.style
      }}
    />
  );
}

// 글로벌 테마 설정
function App() {
  return (
    <div 
      style={{
        '--color-brand-primary': '#your-brand-color',
        '--font-family-primary': 'Your Custom Font',
        '--border-radius-base': '8px',
      }}
    >
      <YourAppContent />
    </div>
  );
}
```

---

## 📚 추가 리소스

- [디자인 토큰 가이드](./DESIGN_TOKENS.md)
- [컴포넌트 API 참조](./API_REFERENCE.md)
- [접근성 체크리스트](./ACCESSIBILITY.md)
- [마이그레이션 가이드](./MIGRATION.md)
- [기여 가이드](./CONTRIBUTING.md)

---

## 🤝 지원 및 피드백

문제가 발생하거나 개선 사항이 있다면:

1. [GitHub Issues](https://github.com/your-org/linear-design-system/issues)에 리포트
2. [Discord 커뮤니티](https://discord.gg/linear-design-system) 참여
3. [이메일 문의](mailto:design-system@your-company.com)

Linear Design System으로 일관되고 아름다운 사용자 인터페이스를 구축하세요! 🚀