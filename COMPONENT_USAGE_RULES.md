# Linear Design System - Component Usage Rules

## 📋 Overview

This document outlines the mandatory rules for using Linear Design System components in this project. All developers must follow these guidelines to ensure consistency, maintainability, and design coherence.

## 🚫 Prohibited Practices

### 1. Native HTML Elements
**NEVER use native HTML elements for UI components. Always use our design system components.**

❌ **Forbidden:**
```jsx
// DON'T
<button onClick={handleClick}>Click me</button>
<input type="text" placeholder="Enter text" />
<nav>Navigation content</nav>
<footer>Footer content</footer>
```

✅ **Required:**
```jsx
// DO
import { Button, Input, Navbar, Footer } from '@/components';

<Button variant="primary" size="medium" onClick={handleClick}>
  Click me
</Button>
<Input variant="outline" size="medium" placeholder="Enter text" />
<Navbar items={navItems} />
<Footer companyName="Your Company" />
```

### 2. External UI Libraries
**NEVER import components from external UI libraries.**

❌ **Forbidden:**
```jsx
// DON'T
import { Button } from '@mui/material';
import { Input } from 'antd';
import { Card } from 'react-bootstrap';
```

✅ **Required:**
```jsx
// DO
import { Button, Input, Card } from '@/components';
```

### 3. Inline Styles
**AVOID inline styles. Use component props and CSS classes.**

❌ **Discouraged:**
```jsx
// AVOID
<Button style={{ backgroundColor: 'red', padding: '10px' }}>
  Button
</Button>
```

✅ **Preferred:**
```jsx
// DO
<Button variant="danger" size="large">
  Button
</Button>
```

## ✅ Required Component Usage

### 1. Interactive Components

#### Button Component
```jsx
import { Button } from '@/components';

// Required props: variant
<Button variant="primary" size="medium">Primary</Button>
<Button variant="secondary" size="small">Secondary</Button>
<Button variant="outline" size="large">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

#### Input Component
```jsx
import { Input } from '@/components';

// Required props: variant
<Input variant="default" placeholder="Default input" />
<Input variant="filled" placeholder="Filled input" />
<Input variant="outline" placeholder="Outline input" />
```

### 2. Layout Components

#### Card Component
```jsx
import { Card } from '@/components';

// Required props: variant
<Card variant="default" padding="medium">
  Card content
</Card>
<Card variant="outline" padding="large">
  Outlined card
</Card>
<Card variant="filled" padding="small">
  Filled card
</Card>
```

#### Navbar Component
```jsx
import { Navbar } from '@/components';

<Navbar
  logo={<img src="/logo.png" alt="Logo" />}
  items={[
    { id: 'home', label: 'Home', href: '/' },
    { id: 'about', label: 'About', href: '/about' }
  ]}
  variant="default"
/>
```

#### Footer Component
```jsx
import { Footer } from '@/components';

<Footer
  companyName="Your Company"
  sections={[
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" }
      ]
    }
  ]}
/>
```

#### Hero Component
```jsx
import { Hero } from '@/components';

<Hero
  title="Welcome to Our Platform"
  subtitle="Build amazing experiences"
  layout="center"
  actions={[
    { label: "Get Started", variant: "primary", onClick: handleStart },
    { label: "Learn More", variant: "outline", href: "/learn" }
  ]}
/>
```

### 3. Feedback Components

#### Badge Component
```jsx
import { Badge } from '@/components';

// Required props: variant, color
<Badge variant="filled" color="red">Error</Badge>
<Badge variant="outline" color="green">Success</Badge>
<Badge variant="soft" color="blue">Info</Badge>
```

### 4. Navigation Components

#### Carousel Component
```jsx
import { Carousel } from '@/components';

<Carousel
  items={carouselItems}
  autoPlay={true}
  showIndicators={true}
  orientation="horizontal"
/>
```

## 🔧 Enforcement Tools

### 1. ESLint Configuration
Add to your `.eslintrc.js`:

```js
module.exports = {
  extends: ['./.eslintrc-component-rules.js'],
  plugins: ['./src/rules/eslint-plugin-linear-design-system'],
  rules: {
    'linear-design-system/prefer-design-system-components': 'error',
    'linear-design-system/no-inline-styles': 'warn',
    'linear-design-system/consistent-prop-naming': 'error',
    'linear-design-system/enforce-required-props': 'error'
  }
};
```

### 2. TypeScript Integration
Import validation utilities:

```tsx
import { validateComponentUsage, ComponentUsageTracker } from '@/rules/component-rules';

// Track component usage in development
ComponentUsageTracker.trackUsage('Button');
```

### 3. Pre-commit Hooks
Add to `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{tsx,jsx}": [
      "eslint --fix --config .eslintrc-component-rules.js",
      "git add"
    ]
  }
}
```

## 📊 Component Import Standards

### Required Import Pattern
```tsx
// Always import from the main components barrel
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

// Import types when needed
import type { 
  ButtonProps, 
  InputProps, 
  NavItem 
} from '@/components';
```

### Forbidden Import Patterns
```tsx
// DON'T import directly from component files
import { Button } from '@/components/Button/Button';

// DON'T use relative imports
import { Button } from '../../components/Button';

// DON'T import from external libraries
import { Button } from '@mui/material';
```

## 🎨 Styling Guidelines

### 1. Use Component Props
```tsx
// Preferred: Use component variant props
<Button variant="primary" size="large">Click me</Button>

// Avoid: Custom styling
<Button className="custom-button-style">Click me</Button>
```

### 2. CSS Custom Properties
When custom styling is necessary, use CSS custom properties:

```css
.custom-component {
  --button-custom-bg: var(--color-brand-primary);
  --button-custom-text: var(--color-utility-white);
}
```

### 3. Responsive Design
Use design system breakpoints:

```tsx
<Card 
  variant="default" 
  className="responsive-card"
  padding="medium"
>
  Content
</Card>
```

## 🚨 Violations and Penalties

### Development Environment
- ESLint errors will prevent builds
- TypeScript compilation errors for incorrect usage
- Console warnings for violations

### Code Review Process
- Pull requests with violations will be rejected
- Component usage must be reviewed and approved
- Documentation updates required for new patterns

## 📈 Monitoring and Reporting

### Usage Analytics
```tsx
// Get component usage report
import { ComponentUsageTracker } from '@/rules/component-rules';

const report = ComponentUsageTracker.getReport();
console.log('Component Usage:', report.usage);
console.log('Violations:', report.violations);
```

### Regular Audits
- Weekly component usage reviews
- Monthly design system compliance reports
- Quarterly rule updates and improvements

## 🔄 Migration Guide

### From Native HTML Elements
1. **Identify**: Find all native HTML elements
2. **Replace**: Use corresponding design system components
3. **Update**: Add required props
4. **Test**: Verify functionality and styling
5. **Validate**: Run ESLint and TypeScript checks

### Example Migration
```tsx
// Before
<button className="btn btn-primary" onClick={handleClick}>
  Submit
</button>

// After
<Button variant="primary" size="medium" onClick={handleClick}>
  Submit
</Button>
```

## 📚 Resources

- [Component Documentation](./src/pages/ComponentsDemo.tsx)
- [Design Tokens](./src/design-tokens/tokens.css)
- [ESLint Rules](./.eslintrc-component-rules.js)
- [TypeScript Rules](./src/rules/component-rules.ts)

## 🤝 Support

For questions or clarifications about component usage rules:

1. Check this documentation first
2. Review component examples in `ComponentsDemo.tsx`
3. Consult with the design system team
4. Create an issue for rule clarifications or updates

---

**Remember: Consistency is key to a successful design system. These rules ensure our interface remains cohesive, maintainable, and user-friendly.**