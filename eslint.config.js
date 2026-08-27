import globals from 'globals';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import prettierConfig from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global ignores
  {
    ignores: [
      'node_modules/',
      'dist/',
      'dist-ssr/',
      'package/',
      'preview/',
      '**/.svelte-kit/',
      '*.local',
      '.env',
      '.vscode/*',
      '!.vscode/extensions.json',
      '.idea/',
      '.DS_Store',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?'
    ]
  },

  // Base configurations
  ...tseslint.configs.recommended,
  ...sveltePlugin.configs['flat/recommended'],
  prettierConfig,
  ...sveltePlugin.configs['flat/prettier'],

  // Main configuration for all source files
  {
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2017
      }
    },
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      '@typescript-eslint/no-explicit-any': ['error'],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_'
        }
      ],
      curly: ['error', 'all']
    }
  },

  // Override for Svelte files - TypeScript parser for script blocks
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  }
];
