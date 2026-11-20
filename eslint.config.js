import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'coverage/', '.wrangler/', '.claude/'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.{js,jsx}'],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: globals.browser,
    },
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.{js,jsx}'],
    ...react.configs.flat['jsx-runtime'],
  },
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.{js,jsx}'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.{js,jsx}'],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.{js,jsx}'],
    rules: {
      // Props are typed with JSDoc and checked by tsc (ADR 0003), not PropTypes.
      'react/prop-types': 'off',
      'no-console': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
];
