# Linear Design System - API 레퍼런스

## 📖 개요

이 문서는 Linear Design System의 모든 컴포넌트 Props와 TypeScript 인터페이스에 대한 완전한 API 레퍼런스를 제공합니다.

---

## 🔘 Button

### Props

```tsx
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### Types

```tsx
type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'outline'
  | 'ghost' 
  | 'danger' 
  | 'success';

type ButtonSize = 'small' | 'medium' | 'large';
type IconPosition = 'left' | 'right';
```

### Default Values

| Prop | Default |
|------|---------|
| `variant` | `'primary'` |
| `size` | `'medium'` |
| `disabled` | `false` |
| `loading` | `false` |
| `iconPosition` | `'left'` |
| `fullWidth` | `false` |
| `type` | `'button'` |

### CSS Custom Properties

```css
.btn {
  --button-padding-inline: var(--spacing-3);
  --button-padding-block: var(--spacing-2);
  --button-border-radius: var(--radius-8);
  --button-font-weight: var(--font-weight-medium);
  --button-transition: var(--animation-quick-transition);
}

.btn--primary {
  --button-primary-bg: var(--color-brand-primary);
  --button-primary-text: var(--color-utility-white);
  --button-primary-hover: var(--color-brand-secondary);
}
```

---

## 📝 Input

### Props

```tsx
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}
```

### Types

```tsx
type InputVariant = 'default' | 'filled' | 'outline';
type InputSize = 'small' | 'medium' | 'large';
```

### Default Values

| Prop | Default |
|------|---------|
| `variant` | `'default'` |
| `size` | `'medium'` |
| `fullWidth` | `true` |
| `type` | `'text'` |

### CSS Custom Properties

```css
.input {
  --input-padding-inline: var(--spacing-3);
  --input-padding-block: var(--spacing-2);
  --input-border-radius: var(--radius-6);
  --input-border-width: 1px;
  --input-transition: var(--animation-quick-transition);
}

.input--default {
  --input-bg: var(--color-bg-primary);
  --input-border: var(--color-border-primary);
  --input-focus-border: var(--color-brand-primary);
}
```

---

## 📄 Card

### Props

```tsx
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  shadow?: CardShadow;
  interactive?: boolean;
  as?: keyof JSX.IntrinsicElements;
}
```

### Types

```tsx
type CardVariant = 'default' | 'outline' | 'filled';
type CardPadding = 'none' | 'small' | 'medium' | 'large';
type CardShadow = 'none' | 'small' | 'medium' | 'large';
```

### Default Values

| Prop | Default |
|------|---------|
| `variant` | `'default'` |
| `padding` | `'medium'` |
| `shadow` | `'small'` |
| `interactive` | `false` |
| `as` | `'div'` |

### CSS Custom Properties

```css
.card {
  --card-border-radius: var(--radius-12);
  --card-border-width: 1px;
  --card-transition: var(--animation-quick-transition);
}

.card--default {
  --card-bg: var(--color-bg-primary);
  --card-border: var(--color-border-primary);
  --card-shadow: var(--shadow-tiny);
}
```

---

## 🏷️ Badge

### Props

```tsx
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  as?: keyof JSX.IntrinsicElements;
}
```

### Types

```tsx
type BadgeVariant = 'outline' | 'filled' | 'soft';
type BadgeSize = 'small' | 'medium' | 'large';
type BadgeColor = 
  | 'gray' 
  | 'red' 
  | 'yellow' 
  | 'green' 
  | 'blue' 
  | 'indigo' 
  | 'purple' 
  | 'pink';
```

### Default Values

| Prop | Default |
|------|---------|
| `variant` | `'filled'` |
| `size` | `'medium'` |
| `color` | `'gray'` |
| `as` | `'span'` |

### CSS Custom Properties

```css
.badge {
  --badge-padding-inline: var(--spacing-2);
  --badge-padding-block: var(--spacing-1);
  --badge-border-radius: var(--radius-rounded);
  --badge-font-size: var(--font-size-small);
  --badge-font-weight: var(--font-weight-medium);
}
```

---

## 🧭 Navbar

### Props

```tsx
interface NavbarProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  items?: NavItem[];
  rightContent?: ReactNode;
  variant?: NavbarVariant;
  fixed?: boolean;
  showMobileMenu?: boolean;
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}
```

### NavItem Interface

```tsx
interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItem[];
}
```

### Types

```tsx
type NavbarVariant = 'default' | 'transparent' | 'filled';
```

### Default Values

| Prop | Default |
|------|---------|
| `items` | `[]` |
| `variant` | `'default'` |
| `fixed` | `false` |
| `showMobileMenu` | `true` |

### CSS Custom Properties

```css
.navbar {
  --navbar-height: 64px;
  --navbar-padding-inline: var(--spacing-4);
  --navbar-border-width: 1px;
  --navbar-transition: var(--animation-quick-transition);
  --navbar-z-index: 50;
}
```

---

## 🦶 Footer

### Props

```tsx
interface FooterProps extends HTMLAttributes<HTMLElement> {
  companyName?: string;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  newsletter?: NewsletterConfig;
  legal?: FooterLink[];
  variant?: FooterVariant;
}
```

### FooterSection Interface

```tsx
interface FooterSection {
  title: string;
  links: FooterLink[];
}
```

### FooterLink Interface

```tsx
interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  icon?: ReactNode;
}
```

### SocialLink Interface

```tsx
interface SocialLink {
  platform: 'twitter' | 'github' | 'linkedin' | 'facebook' | 'instagram';
  url: string;
  label?: string;
}
```

### NewsletterConfig Interface

```tsx
interface NewsletterConfig {
  title: string;
  description: string;
  placeholder: string;
  onSubmit: (email: string) => Promise<void>;
  buttonLabel?: string;
}
```

### Types

```tsx
type FooterVariant = 'default' | 'minimal' | 'extended';
```

### Default Values

| Prop | Default |
|------|---------|
| `sections` | `[]` |
| `socialLinks` | `[]` |
| `legal` | `[]` |
| `variant` | `'default'` |

---

## 🦸 Hero

### Props

```tsx
interface HeroProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  actions?: HeroAction[];
  layout?: HeroLayout;
  size?: HeroSize;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number;
  textColor?: 'light' | 'dark';
}
```

### HeroAction Interface

```tsx
interface HeroAction {
  id: string;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}
```

### Types

```tsx
type HeroLayout = 'left' | 'center' | 'right';
type HeroSize = 'small' | 'medium' | 'large';
```

### Default Values

| Prop | Default |
|------|---------|
| `actions` | `[]` |
| `layout` | `'center'` |
| `size` | `'medium'` |
| `overlayOpacity` | `0.3` |
| `textColor` | `'dark'` |

### CSS Custom Properties

```css
.hero {
  --hero-padding-block: var(--spacing-16);
  --hero-padding-inline: var(--spacing-4);
  --hero-overlay-opacity: 0.3;
  --hero-text-align: center;
}

.hero--small {
  --hero-padding-block: var(--spacing-8);
}

.hero--large {
  --hero-padding-block: var(--spacing-24);
}
```

---

## 🎠 Carousel

### Props

```tsx
interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  orientation?: CarouselOrientation;
  indicatorStyle?: CarouselIndicatorStyle;
  loop?: boolean;
  onSlideChange?: (index: number) => void;
  onItemClick?: (item: CarouselItem, index: number) => void;
}
```

### CarouselItem Interface

```tsx
interface CarouselItem {
  id: string;
  content: ReactNode;
  alt?: string;
  disabled?: boolean;
}
```

### Types

```tsx
type CarouselOrientation = 'horizontal' | 'vertical';
type CarouselIndicatorStyle = 'dots' | 'lines' | 'numbers';
```

### Default Values

| Prop | Default |
|------|---------|
| `autoPlay` | `false` |
| `autoPlayInterval` | `3000` |
| `showIndicators` | `true` |
| `showArrows` | `true` |
| `orientation` | `'horizontal'` |
| `indicatorStyle` | `'dots'` |
| `loop` | `true` |

### CSS Custom Properties

```css
.carousel {
  --carousel-border-radius: var(--radius-12);
  --carousel-arrow-size: 40px;
  --carousel-arrow-bg: rgba(0, 0, 0, 0.5);
  --carousel-indicator-size: 8px;
  --carousel-transition: var(--animation-regular-transition);
}
```

---

## 🎨 Global Design Tokens

### Color Tokens

```css
:root {
  /* Brand Colors */
  --color-brand-primary: #6366f1;
  --color-brand-secondary: #8b5cf6;
  --color-brand-50: #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-900: #312e81;

  /* Semantic Colors */
  --color-semantic-red: #ef4444;
  --color-semantic-orange: #f97316;
  --color-semantic-yellow: #eab308;
  --color-semantic-green: #22c55e;
  --color-semantic-blue: #3b82f6;
  --color-semantic-indigo: #6366f1;
  --color-semantic-purple: #8b5cf6;
  --color-semantic-pink: #ec4899;

  /* Text Colors */
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  --color-text-disabled: #d1d5db;

  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;

  /* Border Colors */
  --color-border-primary: #e5e7eb;
  --color-border-secondary: #d1d5db;
  --color-border-tertiary: #9ca3af;

  /* Utility Colors */
  --color-utility-white: #ffffff;
  --color-utility-black: #000000;
}
```

### Spacing Tokens

```css
:root {
  /* Spacing Scale */
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;

  /* Page Layout */
  --spacing-page-padding-inline: var(--spacing-4);
  --spacing-page-padding-block: var(--spacing-8);
  --spacing-page-max-width: 1200px;
}
```

### Typography Tokens

```css
:root {
  /* Font Families */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-monospace: 'SF Mono', Monaco, 'Cascadia Code', monospace;

  /* Font Sizes */
  --font-size-micro: 0.75rem;    /* 12px */
  --font-size-small: 0.875rem;   /* 14px */
  --font-size-base: 1rem;        /* 16px */
  --font-size-lg: 1.125rem;      /* 18px */
  --font-size-xl: 1.25rem;       /* 20px */
  --font-size-2xl: 1.5rem;       /* 24px */
  --font-size-3xl: 1.875rem;     /* 30px */
  --font-size-4xl: 2.25rem;      /* 36px */
  --font-size-5xl: 3rem;         /* 48px */
  --font-size-6xl: 3.75rem;      /* 60px */

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### Border Radius Tokens

```css
:root {
  --radius-2: 2px;
  --radius-4: 4px;
  --radius-6: 6px;
  --radius-8: 8px;
  --radius-12: 12px;
  --radius-16: 16px;
  --radius-20: 20px;
  --radius-24: 24px;
  --radius-rounded: 9999px;
  --radius-circle: 50%;
}
```

### Shadow Tokens

```css
:root {
  --shadow-tiny: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-small: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

### Animation Tokens

```css
:root {
  --animation-quick-transition: 150ms ease-out;
  --animation-regular-transition: 250ms ease-out;
  --animation-slow-transition: 400ms ease-out;
  
  --easing-linear: linear;
  --easing-in: ease-in;
  --easing-out: ease-out;
  --easing-in-out: ease-in-out;
  --easing-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
  --easing-in-cubic: cubic-bezier(0.32, 0, 0.67, 0);
}
```

---

## 🔧 Utility Types

### Event Handlers

```tsx
type ClickHandler<T = HTMLElement> = (event: React.MouseEvent<T>) => void;
type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void;
type FormHandler = (event: React.FormEvent) => void;
type KeyboardHandler = (event: React.KeyboardEvent) => void;
```

### Common Props

```tsx
interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

interface InteractiveProps extends BaseProps {
  disabled?: boolean;
  onClick?: ClickHandler;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface FormElementProps extends InteractiveProps {
  name?: string;
  required?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

### Polymorphic Component Types

```tsx
type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
```

---

## 📚 TypeScript 사용 팁

### 컴포넌트 타입 확장

```tsx
// 기존 Button 컴포넌트 확장
interface CustomButtonProps extends ButtonProps {
  customProp?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ customProp, ...props }) => {
  return <Button {...props} />;
};
```

### 제네릭 컴포넌트

```tsx
// 제네릭 리스트 컴포넌트
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={keyExtractor(item)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
```

### Ref 전달

```tsx
// forwardRef 사용 예시
interface CustomInputProps extends InputProps {
  customFeature?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ customFeature, ...props }, ref) => {
    return <Input ref={ref} {...props} />;
  }
);

CustomInput.displayName = 'CustomInput';
```

---

## 🛠️ 개발자 도구

### Props 검증

```tsx
// PropTypes를 사용한 런타임 검증 (선택사항)
import PropTypes from 'prop-types';

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};
```

### 스토리북 타입

```tsx
// Storybook과 함께 사용할 때
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'outline', 'ghost', 'danger', 'success'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};
```

---

이 API 레퍼런스를 통해 Linear Design System의 모든 컴포넌트를 완전히 활용할 수 있습니다. 각 컴포넌트의 모든 Props와 타입이 TypeScript로 정의되어 있어 개발 시 자동 완성과 타입 검사의 이점을 받을 수 있습니다.