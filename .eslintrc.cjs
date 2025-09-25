module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'testing-library'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // project: ['./tsconfig.json'],
    // tsconfigRootDir: __dirname,
  },
  env: {
    es2022: true,
  },
  overrides: [
    {
      files: ['server/**/*.{ts,tsx,js,jsx}', 'scripts/**/*.{ts,tsx,js,jsx}'],
      env: { node: true, browser: false },
    },
    {
      files: ['client/**/*.{ts,tsx,js,jsx}'],
      env: { browser: true, node: false },
    },
    {
      files: ['*.config.{js,ts,cjs,mjs}', '*.config.*', 'vite.config.*', 'tailwind.config.*', 'postcss.config.*'],
      env: { node: true },
    },
    {
      files: ['**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
      extends: ['plugin:testing-library/react'],
      env: { browser: true },
    },
  ],
  ignorePatterns: [
    'dist/',
    'build/',
    'node_modules/',
    'coverage/',
    '.next/',
    '.turbo/',
    '.cache/',
    '**/*.tsbuildinfo',
  ],
  rules: {
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    'prefer-const': 'off',
    'no-case-declarations': 'off',
  },
};
