import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte']
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		plugins: {
			'@typescript-eslint': ts
		},
		rules: {
			...ts.configs.recommended.rules,
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'no-unused-vars': 'off'
		}
	},
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte']
			},
			globals: {
				...globals.browser
			}
		},
		plugins: {
			'@typescript-eslint': ts
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'warn',
			'svelte/no-unused-svelte-ignore': 'warn',
			'svelte/no-at-html-tags': 'off', // We control the markdown content
			'svelte/valid-prop-names-in-kit-pages': 'off', // Allow error/status props in +error.svelte
			'svelte/no-navigation-without-resolve': 'off', // External links don't need resolve()
			'svelte/require-each-key': 'error',
			'no-unused-vars': 'off',
			'no-undef': 'off' // TypeScript handles this
		}
	},
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'node_modules/**',
			'*.cjs',
			'**/*.config.js',
			'**/*.config.ts'
		]
	}
];
