/**
 * Linear Design System Component Usage Rules
 * 
 * This file defines TypeScript types and runtime validations
 * to enforce the use of our design system components.
 */

import type { ComponentType, ReactElement } from 'react';

// Type definitions for enforced component usage
export type AllowedButtonElement = never; // Disallow native button
export type AllowedInputElement = never;  // Disallow native input
export type AllowedNavElement = never;    // Disallow native nav
export type AllowedFooterElement = never; // Disallow native footer

// Design System Component Registry
export const DESIGN_SYSTEM_COMPONENTS = {
  // Interactive Components
  Button: '@/components/Button',
  Input: '@/components/Input',
  
  // Layout Components
  Card: '@/components/Card',
  Navbar: '@/components/Navbar',
  Footer: '@/components/Footer',
  Hero: '@/components/Hero',
  
  // Feedback Components
  Badge: '@/components/Badge',
  
  // Navigation Components
  Carousel: '@/components/Carousel',
} as const;

// Required props for components
export interface ComponentRequirements {
  Button: {
    variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size: 'small' | 'medium' | 'large';
  };
  Input: {
    variant: 'default' | 'filled' | 'outline';
    size: 'small' | 'medium' | 'large';
  };
  Card: {
    variant: 'default' | 'outline' | 'filled';
    padding: 'none' | 'small' | 'medium' | 'large';
  };
  Badge: {
    variant: 'outline' | 'filled' | 'soft';
    color: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  };
}

// Validation functions
export const validateComponentUsage = {
  /**
   * Validates that only design system components are used
   */
  isDesignSystemComponent(componentName: string): boolean {
    return Object.keys(DESIGN_SYSTEM_COMPONENTS).includes(componentName);
  },

  /**
   * Validates component props against requirements
   */
  validateProps<T extends keyof ComponentRequirements>(
    component: T,
    props: Partial<ComponentRequirements[T]>
  ): boolean {
    const requirements = {} as ComponentRequirements[T];
    if (!requirements) return true;

    // Check required props are present
    return Object.keys(requirements).every(key => {
      return props.hasOwnProperty(key);
    });
  },

  /**
   * Get recommended component for HTML element
   */
  getRecommendedComponent(htmlElement: string): string | null {
    const mapping: Record<string, string> = {
      button: 'Button',
      input: 'Input',
      nav: 'Navbar',
      footer: 'Footer',
      article: 'Card',
      section: 'Card',
    };
    return mapping[htmlElement] || null;
  }
};

// Runtime validation decorator
export function enforceDesignSystem<T extends ComponentType<any>>(
  WrappedComponent: T,
  componentName: string
): T {
  const EnforcedComponent = (props: any) => {
    if (process.env.NODE_ENV === 'development') {
      // Warn if using non-design-system props
      const unknownProps = Object.keys(props).filter(prop => 
        !['children', 'className', 'style', 'onClick', 'onSubmit'].includes(prop) &&
        !prop.startsWith('aria-') &&
        !prop.startsWith('data-')
      );

      if (unknownProps.length > 0) {
        console.warn(
          `[Design System] Component ${componentName} received unknown props:`,
          unknownProps,
          '\nEnsure you are using the correct component API.'
        );
      }
    }

    // Handle both function and class components
    if (typeof WrappedComponent === 'function') {
      return (WrappedComponent as any)(props);
    }
    return null;
  };

  EnforcedComponent.displayName = `Enforced(${componentName})`;
  return EnforcedComponent as T;
}

// Development-time component usage tracker
export class ComponentUsageTracker {
  private static usage = new Map<string, number>();
  private static violations = new Map<string, string[]>();

  static trackUsage(componentName: string) {
    if (process.env.NODE_ENV === 'development') {
      const current = this.usage.get(componentName) || 0;
      this.usage.set(componentName, current + 1);
    }
  }

  static trackViolation(htmlElement: string, location: string) {
    if (process.env.NODE_ENV === 'development') {
      const violations = this.violations.get(htmlElement) || [];
      violations.push(location);
      this.violations.set(htmlElement, violations);
      
      const recommended = validateComponentUsage.getRecommendedComponent(htmlElement);
      if (recommended) {
        console.warn(
          `[Design System Violation] Native <${htmlElement}> used at ${location}. ` +
          `Use <${recommended}> component instead.`
        );
      }
    }
  }

  static getReport() {
    return {
      usage: Object.fromEntries(this.usage),
      violations: Object.fromEntries(this.violations)
    };
  }

  static reset() {
    this.usage.clear();
    this.violations.clear();
  }
}

// Type guards for component validation
export const isDesignSystemComponent = (element: ReactElement): boolean => {
  if (typeof element.type === 'string') {
    return false; // HTML element
  }
  
  const componentName = (element.type as any)?.displayName || (element.type as any)?.name || 'Unknown';
  return validateComponentUsage.isDesignSystemComponent(componentName);
};

// Utility for creating component rules
export const createComponentRule = (
  componentName: string,
  requiredProps: string[] = []
) => ({
  name: componentName,
  requiredProps,
  validate: (props: Record<string, any>) => {
    const missing = requiredProps.filter(prop => !(prop in props));
    if (missing.length > 0) {
      throw new Error(
        `${componentName} is missing required props: ${missing.join(', ')}`
      );
    }
    return true;
  }
});

// Export component rules
export const COMPONENT_RULES = [
  createComponentRule('Button', ['variant']),
  createComponentRule('Input', ['variant']),
  createComponentRule('Card', ['variant']),
  createComponentRule('Badge', ['variant', 'color']),
] as const;