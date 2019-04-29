module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        'extensions': [
          '.ts',
          '.tsx',
        ],
      },
    },
  },
};
