# Linear Design System - 빠른 시작 가이드

## 🚀 5분 만에 시작하기

Linear Design System을 프로젝트에 빠르게 적용하는 방법을 안내합니다.

## 📦 설치

### 1. 프로젝트에 컴포넌트 복사

```bash
# 컴포넌트 디렉토리 복사
cp -r src/components ./src/
cp -r src/design-tokens ./src/
```

### 2. CSS 토큰 Import

```tsx
// src/main.tsx 또는 App.tsx
import './design-tokens/tokens.css';
```

## 🎯 첫 번째 컴포넌트 사용

### Button 사용해보기

```tsx
import { Button } from '@/components';

function App() {
  return (
    <div>
      <Button variant="primary" onClick={() => alert('Hello!')}>
        클릭하세요
      </Button>
    </div>
  );
}
```

### 기본 레이아웃 구성

```tsx
import { Navbar, Hero, Card, Footer } from '@/components';

function LandingPage() {
  return (
    <div>
      {/* 네비게이션 */}
      <Navbar
        logo="MyApp"
        items={[
          { id: 'home', label: '홈', href: '/' },
          { id: 'features', label: '기능', href: '/features' },
          { id: 'pricing', label: '요금제', href: '/pricing' },
        ]}
      />

      {/* Hero 섹션 */}
      <Hero
        title="놀라운 제품을 만나보세요"
        subtitle="더 나은 경험을 제공하는 혁신적인 솔루션"
        actions={[
          { id: 'start', label: '시작하기', variant: 'primary' },
          { id: 'learn', label: '더 알아보기', variant: 'outline' },
        ]}
      />

      {/* 콘텐츠 영역 */}
      <main style={{ padding: '64px 24px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <Card variant="default" padding="large">
            <h3>빠른 개발</h3>
            <p>미리 만들어진 컴포넌트로 빠르게 개발하세요.</p>
          </Card>
          
          <Card variant="default" padding="large">
            <h3>일관된 디자인</h3>
            <p>디자인 시스템으로 일관된 UI를 유지하세요.</p>
          </Card>
          
          <Card variant="default" padding="large">
            <h3>접근성</h3>
            <p>모든 사용자가 접근할 수 있는 인터페이스를 제공합니다.</p>
          </Card>
        </div>
      </main>

      {/* 푸터 */}
      <Footer
        companyName="MyApp"
        sections={[
          {
            title: "제품",
            links: [
              { label: "기능", href: "/features" },
              { label: "요금제", href: "/pricing" },
            ]
          }
        ]}
      />
    </div>
  );
}
```

## 🎨 스타일 커스터마이징

### 브랜드 색상 변경

```css
/* src/styles/custom.css */
:root {
  --color-brand-primary: #your-brand-color;
  --color-brand-secondary: #your-secondary-color;
}
```

```tsx
// 적용
import './styles/custom.css';
```

## 📝 폼 만들기

```tsx
import { useState } from 'react';
import { Card, Input, Button, Badge } from '@/components';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('제출:', formData);
  };

  return (
    <Card variant="outline" padding="large" style={{ maxWidth: '500px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0' }}>문의하기</h2>
        <Badge variant="soft" color="blue">빠른 응답</Badge>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            label="이름"
            value={formData.name}
            onChange={(value) => setFormData({...formData, name: value})}
            placeholder="이름을 입력하세요"
            required
          />
          
          <Input
            label="이메일"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({...formData, email: value})}
            placeholder="이메일을 입력하세요"
            required
          />
          
          <Input
            label="메시지"
            value={formData.message}
            onChange={(value) => setFormData({...formData, message: value})}
            placeholder="메시지를 입력하세요"
            helperText="최소 10자 이상 입력해주세요"
          />
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="submit" variant="primary" fullWidth>
              전송하기
            </Button>
            <Button type="button" variant="ghost" onClick={() => setFormData({name: '', email: '', message: ''})}>
              초기화
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
```

## 🔄 상태 관리 패턴

```tsx
import { useState } from 'react';
import { Card, Button, Badge, Input } from '@/components';

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: '첫 번째 할 일', completed: false },
    { id: 2, text: '두 번째 할 일', completed: true },
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <Card variant="default" padding="large" style={{ maxWidth: '600px' }}>
      <h2>할 일 목록</h2>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Input
          placeholder="새 할 일 입력"
          value={newTodo}
          onChange={setNewTodo}
          style={{ flex: 1 }}
        />
        <Button variant="primary" onClick={addTodo}>
          추가
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {todos.map(todo => (
          <Card 
            key={todo.id} 
            variant="outline" 
            padding="medium"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
          >
            <span style={{ 
              textDecoration: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.6 : 1
            }}>
              {todo.text}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Badge 
                variant="soft" 
                color={todo.completed ? 'green' : 'gray'}
              >
                {todo.completed ? '완료' : '진행중'}
              </Badge>
              <Button 
                variant="ghost" 
                size="small"
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed ? '되돌리기' : '완료'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
```

## 📱 반응형 레이아웃

```tsx
import { Card, Button } from '@/components';

function ResponsiveGrid() {
  const items = [
    { title: '항목 1', description: '첫 번째 항목 설명' },
    { title: '항목 2', description: '두 번째 항목 설명' },
    { title: '항목 3', description: '세 번째 항목 설명' },
    { title: '항목 4', description: '네 번째 항목 설명' },
  ];

  return (
    <div style={{
      display: 'grid',
      // 모바일: 1열, 태블릿: 2열, 데스크톱: 3열
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      padding: '24px'
    }}>
      {items.map((item, index) => (
        <Card 
          key={index}
          variant="default" 
          padding="large"
          interactive
        >
          <h3 style={{ margin: '0 0 12px 0' }}>{item.title}</h3>
          <p style={{ 
            margin: '0 0 20px 0', 
            color: 'var(--color-text-secondary)' 
          }}>
            {item.description}
          </p>
          <Button variant="outline" size="small" fullWidth>
            자세히 보기
          </Button>
        </Card>
      ))}
    </div>
  );
}
```

## 🎪 인터랙티브 컴포넌트

```tsx
import { useState } from 'react';
import { Carousel, Card, Button, Badge } from '@/components';

function ProductShowcase() {
  const products = [
    {
      id: 1,
      name: '프리미엄 플랜',
      price: '$29/월',
      features: ['무제한 프로젝트', '팀 협업', '우선 지원'],
      popular: true
    },
    {
      id: 2,
      name: '스탠다드 플랜',
      price: '$19/월',
      features: ['10개 프로젝트', '기본 협업', '이메일 지원'],
      popular: false
    },
    {
      id: 3,
      name: '베이직 플랜',
      price: '$9/월',
      features: ['3개 프로젝트', '개인 사용', '커뮤니티 지원'],
      popular: false
    }
  ];

  const carouselItems = products.map(product => ({
    id: product.id.toString(),
    content: (
      <Card 
        variant="default" 
        padding="large"
        style={{ 
          textAlign: 'center',
          position: 'relative',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        {product.popular && (
          <Badge 
            variant="filled" 
            color="blue"
            style={{ 
              position: 'absolute',
              top: '16px',
              right: '16px'
            }}
          >
            인기
          </Badge>
        )}
        
        <div>
          <h3 style={{ margin: '0 0 12px 0' }}>{product.name}</h3>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            margin: '20px 0',
            color: 'var(--color-brand-primary)'
          }}>
            {product.price}
          </div>
          
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: '20px 0' 
          }}>
            {product.features.map((feature, index) => (
              <li key={index} style={{ 
                padding: '8px 0',
                borderBottom: '1px solid var(--color-border)',
              }}>
                ✓ {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          variant={product.popular ? 'primary' : 'outline'} 
          fullWidth
        >
          선택하기
        </Button>
      </Card>
    )
  }));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2>요금제를 선택하세요</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          프로젝트에 맞는 완벽한 플랜을 찾아보세요
        </p>
      </div>
      
      <Carousel
        items={carouselItems}
        autoPlay={false}
        showIndicators={true}
        showArrows={true}
        indicatorStyle="dots"
      />
    </div>
  );
}
```

## ✅ 체크리스트

프로젝트에 Linear Design System을 적용했다면:

- [ ] 디자인 토큰 CSS 파일 import 확인
- [ ] 첫 번째 컴포넌트가 올바르게 렌더링되는지 확인
- [ ] 브랜드 색상 커스터마이징 완료
- [ ] 반응형 디자인 테스트 (모바일/태블릿/데스크톱)
- [ ] 키보드 네비게이션 테스트
- [ ] 다크 모드 지원 확인

## 🎯 다음 단계

1. **[전체 컴포넌트 가이드](./COMPONENT_GUIDE.md)** 읽기
2. **[디자인 토큰 가이드](./DESIGN_TOKENS.md)** 확인
3. **[접근성 가이드](./ACCESSIBILITY.md)** 검토
4. **[고급 패턴](./ADVANCED_PATTERNS.md)** 학습

## 🆘 도움이 필요하다면

- 📖 [FAQ](./FAQ.md)
- 💬 [Discord 커뮤니티](https://discord.gg/linear-design-system)
- 🐛 [이슈 리포트](https://github.com/your-org/linear-design-system/issues)
- 📧 [이메일 지원](mailto:design-system@your-company.com)

Linear Design System으로 빠르고 일관된 UI 개발을 시작하세요! 🚀