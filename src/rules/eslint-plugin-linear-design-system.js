/**
 * Custom ESLint Plugin for Linear Design System
 * 
 * This plugin provides custom rules to enforce the use of our design system components.
 */

const DESIGN_SYSTEM_COMPONENTS = [
  'Button', 'Input', 'Card', 'Badge', 'Carousel', 'Navbar', 'Footer', 'Hero'
];

const HTML_TO_COMPONENT_MAP = {
  'button': 'Button',
  'input': 'Input', 
  'nav': 'Navbar',
  'footer': 'Footer',
  'article': 'Card',
  'section': 'Card'
};

module.exports = {
  rules: {
    'prefer-design-system-components': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce usage of design system components over native HTML elements',
          category: 'Best Practices',
          recommended: true
        },
        fixable: 'code',
        schema: [],
        messages: {
          useDesignSystemComponent: 'Use {{component}} from the design system instead of <{{element}}>. Import: import { {{component}} } from "@/components"',
          missingDesignSystemImport: 'Design system component {{component}} is used but not imported from "@/components"'
        }
      },
      create(context) {
        const sourceCode = context.getSourceCode();
        let hasDesignSystemImport = false;
        const importedComponents = new Set();

        return {
          ImportDeclaration(node) {
            if (node.source.value === '@/components') {
              hasDesignSystemImport = true;
              if (node.specifiers) {
                node.specifiers.forEach(spec => {
                  if (spec.type === 'ImportSpecifier') {
                    importedComponents.add(spec.imported.name);
                  }
                });
              }
            }
          },

          JSXOpeningElement(node) {
            if (node.name && node.name.type === 'JSXIdentifier') {
              const elementName = node.name.name;
              
              // Check if it's an HTML element that should use design system component
              if (HTML_TO_COMPONENT_MAP[elementName]) {
                const recommendedComponent = HTML_TO_COMPONENT_MAP[elementName];
                context.report({
                  node,
                  messageId: 'useDesignSystemComponent',
                  data: {
                    element: elementName,
                    component: recommendedComponent
                  },
                  fix(fixer) {
                    return fixer.replaceText(node.name, recommendedComponent);
                  }
                });
              }
              
              // Check if design system component is used but not imported
              if (DESIGN_SYSTEM_COMPONENTS.includes(elementName) && 
                  !importedComponents.has(elementName)) {
                context.report({
                  node,
                  messageId: 'missingDesignSystemImport',
                  data: {
                    component: elementName
                  }
                });
              }
            }
          }
        };
      }
    },

    'no-inline-styles': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Discourage inline styles in favor of design system props',
          category: 'Best Practices',
          recommended: true
        },
        schema: [],
        messages: {
          noInlineStyles: 'Avoid inline styles. Use design system props or CSS classes instead.'
        }
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name && node.name.name === 'style' && 
                node.value && node.value.type === 'JSXExpressionContainer') {
              context.report({
                node,
                messageId: 'noInlineStyles'
              });
            }
          }
        };
      }
    },

    'consistent-prop-naming': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce consistent prop naming conventions',
          category: 'Best Practices',
          recommended: true
        },
        schema: [],
        messages: {
          inconsistentPropNaming: 'Use consistent prop naming. Consider using "{{suggestion}}" instead of "{{actual}}"'
        }
      },
      create(context) {
        const propMappings = {
          'color': 'variant',
          'type': 'variant',
          'theme': 'variant',
          'kind': 'variant'
        };

        return {
          JSXAttribute(node) {
            if (node.name && node.name.name) {
              const propName = node.name.name;
              const suggestion = propMappings[propName];
              
              if (suggestion) {
                context.report({
                  node,
                  messageId: 'inconsistentPropNaming',
                  data: {
                    actual: propName,
                    suggestion: suggestion
                  }
                });
              }
            }
          }
        };
      }
    },

    'enforce-required-props': {
      meta: {
        type: 'error',
        docs: {
          description: 'Enforce required props for design system components',
          category: 'Possible Errors',
          recommended: true
        },
        schema: [],
        messages: {
          missingRequiredProp: 'Component {{component}} is missing required prop: {{prop}}'
        }
      },
      create(context) {
        const requiredProps = {
          'Button': ['variant'],
          'Input': ['variant'],
          'Badge': ['variant', 'color'],
          'Card': ['variant']
        };

        return {
          JSXOpeningElement(node) {
            if (node.name && node.name.type === 'JSXIdentifier') {
              const componentName = node.name.name;
              const required = requiredProps[componentName];
              
              if (required) {
                const presentProps = new Set(
                  node.attributes
                    .filter(attr => attr.type === 'JSXAttribute' && attr.name)
                    .map(attr => attr.name.name)
                );

                required.forEach(prop => {
                  if (!presentProps.has(prop)) {
                    context.report({
                      node,
                      messageId: 'missingRequiredProp',
                      data: {
                        component: componentName,
                        prop: prop
                      }
                    });
                  }
                });
              }
            }
          }
        };
      }
    }
  }
};