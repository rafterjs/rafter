module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: false,
    node: true,
    jest: true
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'max-len': ['error', { code: 120, tabWidth: 2 }],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off', // until I can refactor in TS
  }
};