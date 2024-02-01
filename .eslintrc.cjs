module.exports = {
	root: true,
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'plugin:svelte/recommended',
		'prettier' // Enables eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
	],
	plugins: [
		'@typescript-eslint',
		'svelte',
		'prettier' // Runs Prettier as an ESLint rule and reports differences as individual ESLint issues
	],
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte/svelte'
		}
	],
	rules: {
		'prettier/prettier': 'error' // Add this to turn prettier errors into ESLint errors
		// Add any custom rules or overrides here
	}
};
