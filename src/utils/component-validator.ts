/**
 * Runtime Component Validation Utilities
 * 
 * This module provides runtime validation and enforcement for
 * Linear Design System component usage.
 */

import { ReactElement, ComponentType } from 'react';

// Design System Component Registry
export const DESIGN_SYSTEM_COMPONENTS = {
  Button: '@/components/Button',
  Input: '@/components/Input',
  Card: '@/components/Card',
  Badge: '@/components/Badge',
  Navbar: '@/components/Navbar',
  Footer: '@/components/Footer',
  Hero: '@/components/Hero',
  Carousel: '@/components/Carousel',
} as const;

// Validation error types
export class ComponentValidationError extends Error {
  constructor(
    public componentName: string,
    public violationType: string,
    message: string
  ) {
    super(message);
    this.name = 'ComponentValidationError';
  }
}

// Component usage validator
export class ComponentValidator {
  private static violations: Array<{
    component: string;
    violation: string;
    location: string;
    timestamp: Date;
  }> = [];

  /**
   * Validates if a component is from our design system
   */
  static isDesignSystemComponent(componentName: string): boolean {
    return Object.keys(DESIGN_SYSTEM_COMPONENTS).includes(componentName);
  }

  /**
   * Validates component props against design system requirements
   */
  static validateProps(componentName: string, props: Record<string, any>): void {
    const requiredProps: Record<string, string[]> = {
      Button: ['variant'],
      Input: ['variant'],
      Card: ['variant'],
      Badge: ['variant', 'color'],
    };

    const required = requiredProps[componentName];
    if (!required) return;

    const missing = required.filter(prop => !(prop in props));
    if (missing.length > 0) {
      const error = new ComponentValidationError(
        componentName,
        'missing-props',
        `Component ${componentName} is missing required props: ${missing.join(', ')}`
      );
      
      if (process.env.NODE_ENV === 'development') {
        console.error(error.message);
        this.recordViolation(componentName, 'missing-props', 'unknown');
      } else {
        throw error;
      }
    }
  }

  /**
   * Records a validation violation
   */
  static recordViolation(
    component: string,
    violation: string,
    location: string
  ): void {
    this.violations.push({
      component,
      violation,
      location,
      timestamp: new Date()
    });

    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `[Design System Violation] ${violation} in ${component} at ${location}`
      );
    }
  }

  /**
   * Gets all recorded violations
   */
  static getViolations() {
    return [...this.violations];
  }

  /**
   * Clears all recorded violations
   */
  static clearViolations(): void {
    this.violations = [];
  }

  /**
   * Generates a violation report
   */
  static generateReport() {
    const violationsByComponent = this.violations.reduce((acc, violation) => {
      if (!acc[violation.component]) {
        acc[violation.component] = [];
      }
      acc[violation.component].push(violation);
      return acc;
    }, {} as Record<string, typeof this.violations>);

    const violationsByType = this.violations.reduce((acc, violation) => {
      if (!acc[violation.violation]) {
        acc[violation.violation] = 0;
      }
      acc[violation.violation]++;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.violations.length,
      byComponent: violationsByComponent,
      byType: violationsByType,
      recentViolations: this.violations.slice(-10)
    };
  }
}

// React component wrapper for validation
export function withComponentValidation<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName: string
) {
  const ValidatedComponent = (props: P) => {
    if (process.env.NODE_ENV === 'development') {
      // Validate component is from design system
      if (!ComponentValidator.isDesignSystemComponent(componentName)) {
        ComponentValidator.recordViolation(
          componentName,
          'non-design-system',
          'component-wrapper'
        );
      }

      // Validate required props
      ComponentValidator.validateProps(componentName, props as Record<string, any>);
    }

    return <WrappedComponent {...props} />;
  };

  ValidatedComponent.displayName = `Validated(${componentName})`;
  return ValidatedComponent;
}

// HTML element interceptor
export const createHTMLElementInterceptor = () => {
  const originalCreateElement = document.createElement;
  const prohibitedElements = ['button', 'input', 'nav', 'footer'];

  document.createElement = function(tagName: string, options?: ElementCreationOptions) {
    if (prohibitedElements.includes(tagName.toLowerCase())) {
      ComponentValidator.recordViolation(
        tagName,
        'html-element-usage',
        'document.createElement'
      );
      
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[Design System] Native <${tagName}> element created. ` +
          `Consider using design system components instead.`
        );
      }
    }

    return originalCreateElement.call(this, tagName, options);
  };
};

// Component usage analytics
export class ComponentUsageAnalytics {
  private static usage = new Map<string, number>();
  private static sessions = new Map<string, Set<string>>();

  static trackUsage(componentName: string, sessionId = 'default') {
    // Track total usage
    const current = this.usage.get(componentName) || 0;
    this.usage.set(componentName, current + 1);

    // Track session usage
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new Set());
    }
    this.sessions.get(sessionId)!.add(componentName);
  }

  static getUsageStats() {
    const totalUsage = Array.from(this.usage.entries());
    const sessionStats = Array.from(this.sessions.entries()).map(([session, components]) => ({
      session,
      components: Array.from(components),
      count: components.size
    }));

    return {
      totalUsage: Object.fromEntries(totalUsage),
      sessionStats,
      mostUsed: totalUsage.sort(([,a], [,b]) => b - a).slice(0, 5),
      coverage: (this.usage.size / Object.keys(DESIGN_SYSTEM_COMPONENTS).length) * 100
    };
  }

  static reset() {
    this.usage.clear();
    this.sessions.clear();
  }
}

// Development tools
export const DevTools = {
  /**
   * Scans the DOM for non-design-system elements
   */
  scanDOM(): Array<{ element: string; count: number; locations: string[] }> {
    const prohibitedElements = ['button', 'input', 'nav', 'footer'];
    const results: Array<{ element: string; count: number; locations: string[] }> = [];

    prohibitedElements.forEach(tagName => {
      const elements = document.querySelectorAll(tagName);
      if (elements.length > 0) {
        const locations = Array.from(elements).map((el, index) => 
          `${tagName}[${index}]: ${el.outerHTML.slice(0, 100)}...`
        );
        
        results.push({
          element: tagName,
          count: elements.length,
          locations
        });
      }
    });

    return results;
  },

  /**
   * Generates a comprehensive compliance report
   */
  generateComplianceReport() {
    const domScan = this.scanDOM();
    const violations = ComponentValidator.getViolations();
    const usage = ComponentUsageAnalytics.getUsageStats();
    const validationReport = ComponentValidator.generateReport();

    return {
      compliance: {
        domViolations: domScan.length,
        codeViolations: violations.length,
        designSystemCoverage: usage.coverage
      },
      details: {
        domScan,
        violations,
        usage,
        validationReport
      },
      recommendations: this.generateRecommendations(domScan, violations)
    };
  },

  /**
   * Generates recommendations based on violations
   */
  generateRecommendations(
    domScan: ReturnType<typeof DevTools.scanDOM>,
    violations: ReturnType<typeof ComponentValidator.getViolations>
  ) {
    const recommendations: string[] = [];

    if (domScan.length > 0) {
      recommendations.push(
        `Replace ${domScan.length} native HTML elements with design system components`
      );
    }

    if (violations.length > 0) {
      recommendations.push(
        `Fix ${violations.length} component usage violations`
      );
    }

    const missingComponents = Object.keys(DESIGN_SYSTEM_COMPONENTS).filter(
      component => !ComponentUsageAnalytics.getUsageStats().totalUsage[component]
    );

    if (missingComponents.length > 0) {
      recommendations.push(
        `Consider using unused components: ${missingComponents.join(', ')}`
      );
    }

    return recommendations;
  }
};

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  // Initialize HTML element interceptor
  createHTMLElementInterceptor();

  // Add global DevTools
  (window as any).__LINEAR_DESIGN_SYSTEM_DEVTOOLS__ = DevTools;
  
  console.info(
    '[Linear Design System] Validation and analytics enabled. ' +
    'Use window.__LINEAR_DESIGN_SYSTEM_DEVTOOLS__ for debugging.'
  );
}