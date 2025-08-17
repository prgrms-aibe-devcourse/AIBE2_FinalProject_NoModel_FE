import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

// Import our custom Linear Design System rules
import linearDesignSystemPlugin from './src/rules/eslint-plugin-linear-design-system.js'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'linear-design-system': linearDesignSystemPlugin,
    },
    rules: {
      // Linear Design System Rules
      'linear-design-system/prefer-design-system-components': 'error',
      'linear-design-system/no-inline-styles': 'warn',
      'linear-design-system/consistent-prop-naming': 'error',
      'linear-design-system/enforce-required-props': 'error',

      // Restrict direct HTML element usage
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
          ]
        }
      ]
    },
  },
])
