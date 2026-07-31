import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default defineConfig(
  {
    ignores: [
      '.faststore/**',
      '.next/**',
      'node_modules/**',
      'public/**',
      'cms_schema.json',
      'cypress/**',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs}'],
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // Arquivos de configuração que rodam em Node (CommonJS)
    files: ['*.{js,cjs}', '*.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettier
)
