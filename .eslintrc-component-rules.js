/**
 * ESLint Rules for Linear Design System Component Usage
 * 
 * This configuration enforces the use of our design system components
 * instead of native HTML elements or external libraries.
 */

module.exports = {
  rules: {
    // Restrict direct HTML element usage in favor of our components
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXOpeningElement[name.name="button"]:not([name.name="Button"])',
        message: 'Use the Button component from our design system instead of native <button>. Import: import { Button } from "@/components"'
      },
      {
        selector: 'JSXOpeningElement[name.name="input"]:not([name.name="Input"])',
        message: 'Use the Input component from our design system instead of native <input>. Import: import { Input } from "@/components"'
      },
      {
        selector: 'JSXOpeningElement[name.name="nav"]:not([name.name="Navbar"])',
        message: 'Use the Navbar component from our design system instead of native <nav>. Import: import { Navbar } from "@/components"'
      },
      {
        selector: 'JSXOpeningElement[name.name="footer"]:not([name.name="Footer"])',
        message: 'Use the Footer component from our design system instead of native <footer>. Import: import { Footer } from "@/components"'
      }
    ],

    // Restrict external UI libraries
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@mui/*', 'antd', 'react-bootstrap', 'semantic-ui-react'],
            message: 'Use components from our Linear Design System instead of external UI libraries. Import from "@/components"'
          }
        ],
        paths: [
          {
            name: 'react',
            importNames: ['createElement'],
            message: 'Avoid React.createElement for UI elements. Use our design system components instead.'
          }
        ]
      }
    ],

    // Custom rules for our design system
    'linear-design-system/prefer-design-system-components': 'error',
    'linear-design-system/no-inline-styles': 'warn',
    'linear-design-system/consistent-prop-naming': 'error'
  },

  // Custom rule definitions
  overrides: [
    {
      files: ['**/*.tsx', '**/*.jsx'],
      rules: {
        // Enforce our component imports
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              ['internal', 'parent', 'sibling', 'index']
            ],
            pathGroups: [
              {
                pattern: '@/components/**',
                group: 'internal',
                position: 'before'
              }
            ],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true
            }
          }
        ]
      }
    }
  ]
};